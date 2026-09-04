import type { Config } from '../config.js';

interface RequestOptions extends RequestInit {
  query?: Record<string, string>;
}

export type TableRow = Record<string, unknown>;

/**
 * Cliente HTTP delgado para PostgREST.
 * PostgREST expone la base de datos como una API RESTful,
 * así que este cliente solo necesita hacer fetch con las
 * cabeceras de autenticación y un formato JSON.
 */
export class PostgRestClient {
  constructor(private readonly config: Config) {}

  private baseUrl(table: string): URL {
    return new URL(`${this.config.pgrestUrl}/${table}`);
  }

  private headers(extra?: Record<string, string>): Headers {
    const h = new Headers(extra ?? {});
    h.set('Content-Type', 'application/json');
    h.set('Accept', 'application/json');
    h.set('Accept-Profile', this.config.pgrestAcceptProfile);
    if (this.config.pgrestApikey) {
      h.set('apikey', this.config.pgrestApikey);
      h.set('Authorization', `Bearer ${this.config.pgrestApikey}`);
    }
    return h;
  }

  private async request<T>(
    table: string,
    init: RequestOptions,
    raw = false
  ): Promise<T> {
    const url = this.baseUrl(table);
    if (init.query) {
      for (const [k, v] of Object.entries(init.query)) {
        if (v !== undefined && v !== '') url.searchParams.set(k, v);
      }
    }

    const res = await fetch(url.toString(), {
      ...init,
      headers: this.headers(init.headers as Record<string, string>)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `PostgREST ${res.status} en ${table}: ${text || res.statusText}`
      );
    }

    if (raw) return (await res.text()) as unknown as T;
    if (res.status === 204) return undefined as unknown as T;
    return (await res.json()) as T;
  }

  select<T>(table: string, query?: Record<string, string>): Promise<T> {
    return this.request<T>(table, { method: 'GET', query });
  }

  insert<T>(table: string, body: unknown, raw = false): Promise<T> {
    return this.request<T>(
      table,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { Prefer: 'return=representation' }
      },
      raw
    );
  }

  /** Insertar o actualizar según la clave primaria (UPSERT de PostgREST). */
  upsert<T>(table: string, body: unknown, onConflict = 'id', raw = false): Promise<T> {
    return this.request<T>(
      table,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          Prefer: 'return=representation,resolution=merge-duplicates',
          'on_conflict': onConflict
        }
      },
      raw
    );
  }

  update<T>(table: string, idFilter: Record<string, string>, body: unknown, raw = false): Promise<T> {
    const query: Record<string, string> = {};
    for (const [k, v] of Object.entries(idFilter)) {
      query[k] = `eq.${v}`;
    }
    return this.request<T>(
      table,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: { Prefer: 'return=representation' },
        query
      },
      raw
    );
  }

  delete(table: string, idFilter: Record<string, string>): Promise<void> {
    const query: Record<string, string> = {};
    for (const [k, v] of Object.entries(idFilter)) {
      query[k] = `eq.${v}`;
    }
    return this.request<void>(table, { method: 'DELETE', query });
  }
}
