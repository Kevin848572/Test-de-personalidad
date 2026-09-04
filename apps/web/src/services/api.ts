import type { Question, PersonalityInfo, MBTICode } from '@personalidad/core';

export interface StartSessionResponse {
  sessionId: string;
}

export interface HeartbeatResponse {
  ok: boolean;
  lastActiveAt: string;
}

export interface CompleteResponse {
  ok: boolean;
  personalityCode: string;
}

export interface ActiveUser {
  user_id: string;
  name: string;
  email: string | null;
  session_id: string;
  status: string;
  personality_code: string | null;
  last_active_at: string;
}

export interface SessionStats {
  completed_count: number;
  started_count: number;
  unique_users: number;
  online_count: number;
}

export interface QuestionsResponse {
  questions: Question[];
}

export interface PersonalityRecord extends PersonalityInfo {
  code: MBTICode;
}

export interface PersonalitiesResponse {
  items: PersonalityRecord[];
  total: number;
}

const API_URL = import.meta.env.VITE_API_URL ?? '/api';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Error ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** Cliente HTTP de la vista hacia el Controlador (API Hono). */
export const api = {
  getQuestions(): Promise<QuestionsResponse> {
    return request('/questions');
  },

  getPersonalities(): Promise<PersonalitiesResponse> {
    return request('/personalities');
  },

  startSession(name: string, email?: string): Promise<StartSessionResponse> {
    return request('/sessions', {
      method: 'POST',
      body: JSON.stringify({ name, email: email?.trim() ? email : undefined })
    });
  },

  heartbeat(sessionId: string): Promise<HeartbeatResponse> {
    return request(`/sessions/${sessionId}/heartbeat`, { method: 'PATCH' });
  },

  complete(sessionId: string, answers: Record<number, 'A' | 'B'>): Promise<CompleteResponse> {
    return request(`/sessions/${sessionId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ answers })
    });
  },

  onlineUsers(): Promise<ActiveUser[]> {
    return request('/sessions/online');
  },

  stats(): Promise<SessionStats> {
    return request('/stats');
  }
};
