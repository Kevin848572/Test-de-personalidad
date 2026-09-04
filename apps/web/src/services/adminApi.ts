import type { PersonalityInfo, MBTICode, DimensionPair } from '@personalidad/core';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';
const TOKEN_KEY = 'admin_token';
const USERNAME_KEY = 'admin_username';

export interface AdminSession {
  token: string;
  admin: { id: string; username: string };
}

export interface AdminRow {
  id: string;
  username: string;
  created_at: string;
}

export interface UserRow {
  id: string;
  name: string;
  email: string | null;
  created_at: string;
}

export interface SessionRow {
  id: string;
  user_id: string | null;
  status: 'started' | 'completed';
  personality_code: string | null;
  started_at: string;
  completed_at: string | null;
  last_active_at: string;
  user: { id: string; name: string; email: string | null } | null;
}

export interface QuestionRow {
  id: number;
  text: string;
  column: number;
  dim: DimensionPair;
  is_active: boolean;
}

export interface PersonalityRow extends PersonalityInfo {
  code: MBTICode;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
}

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function saveSession(session: AdminSession) {
  localStorage.setItem(TOKEN_KEY, session.token);
  if (session.admin) localStorage.setItem(USERNAME_KEY, session.admin.username);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export class ApiError extends Error {
  fields?: Record<string, string>;
  status: number;
  constructor(message: string, status: number, fields?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = fields;
  }
}

export function getStoredUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${url}`, { ...init, headers });

  if (res.status === 401) {
    clearSession(); // sesión expirada
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.error ?? `Error ${res.status}`, res.status, body?.fields);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** Cliente HTTP del panel de administración (requiere token JWT). */
export const adminApi = {
  async login(username: string, password: string): Promise<void> {
    const res = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new ApiError(body?.error ?? 'Error de credenciales', res.status, body?.fields);
    }
    const session = (await res.json()) as AdminSession;
    saveSession(session);
  },

  me(): Promise<{ admin: { id: string; username: string } | null }> {
    return request('/admin/me');
  },

  // --- Usuarios ---
  users(search?: string): Promise<{ items: UserRow[]; total: number }> {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    return request(`/admin/users${q}`);
  },
  deleteUser(id: string): Promise<{ ok: boolean }> {
    return request(`/admin/users/${id}`, { method: 'DELETE' });
  },

  // --- Sesiones ---
  sessions(status?: string, personality?: string): Promise<{ items: SessionRow[]; count: number }> {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (personality) params.set('personality', personality);
    const qs = params.toString();
    return request(`/admin/sessions${qs ? `?${qs}` : ''}`);
  },
  deleteSession(id: string): Promise<{ ok: boolean }> {
    return request(`/admin/sessions/${id}`, { method: 'DELETE' });
  },

  // --- Preguntas ---
  questions(): Promise<ListResponse<QuestionRow>> {
    return request('/admin/questions');
  },
  createQuestion(data: Omit<QuestionRow, 'id'>): Promise<QuestionRow> {
    return request('/admin/questions', { method: 'POST', body: JSON.stringify(data) });
  },
  updateQuestion(id: number, data: Partial<QuestionRow>): Promise<QuestionRow> {
    return request(`/admin/questions/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },
  deleteQuestion(id: number): Promise<{ ok: boolean }> {
    return request(`/admin/questions/${id}`, { method: 'DELETE' });
  },

  // --- Personalidades ---
  personalities(): Promise<ListResponse<PersonalityRow>> {
    return request('/admin/personalities');
  },
  upsertPersonality(data: PersonalityRow): Promise<PersonalityRow> {
    return request('/admin/personalities', { method: 'POST', body: JSON.stringify(data) });
  },
  deletePersonality(code: string): Promise<{ ok: boolean }> {
    return request(`/admin/personalities/${code}`, { method: 'DELETE' });
  },

  // --- Admins ---
  admins(): Promise<ListResponse<AdminRow>> {
    return request('/admin/admins');
  },
  createAdmin(username: string, password: string): Promise<AdminRow> {
    return request('/admin/admins', { method: 'POST', body: JSON.stringify({ username, password }) });
  },
  changePassword(username: string, password: string): Promise<{ ok: boolean }> {
    return request(`/admin/admins/${encodeURIComponent(username)}/password`, {
      method: 'POST',
      body: JSON.stringify({ password })
    });
  },
  deleteAdmin(id: string): Promise<{ ok: boolean }> {
    return request(`/admin/admins/${id}`, { method: 'DELETE' });
  }
};