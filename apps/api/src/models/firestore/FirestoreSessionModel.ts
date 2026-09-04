import crypto from 'node:crypto';
import type { Firestore, Query, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import type { MBTICode } from '@personalidad/core';
import type {
  ActiveUser,
  CreateSessionInput,
  PersonalityCount,
  SessionStats,
  SessionWithUser,
  StoredSession
} from '../SessionModel.js';

export class FirestoreSessionModel {
  constructor(private readonly db: Firestore) {}

  async create(input: CreateSessionInput): Promise<StoredSession[]> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const data: StoredSession = {
      id,
      user_id: input.userId,
      status: input.status ?? 'started',
      personality_code: input.personalityCode ?? null,
      started_at: now,
      completed_at: null,
      last_active_at: now,
      user_agent: input.userAgent ?? null,
      ip: input.ip ?? null
    };
    await this.db.collection('test_sessions').doc(id).set(data);
    return [data];
  }

  async updateActivity(
    id: string,
    patch: { status?: 'completed'; personalityCode?: MBTICode; completedAt?: string }
  ): Promise<StoredSession[]> {
    const updateData: Record<string, any> = {
      last_active_at: new Date().toISOString()
    };
    if (patch.status) updateData.status = patch.status;
    if (patch.personalityCode) updateData.personality_code = patch.personalityCode;
    if (patch.completedAt) updateData.completed_at = patch.completedAt;

    await this.db.collection('test_sessions').doc(id).update(updateData);
    const doc = await this.db.collection('test_sessions').doc(id).get();
    if (!doc.exists) return [];
    return [{ id: doc.id, ...(doc.data() as any) } as StoredSession];
  }

  async activeUsers(): Promise<ActiveUser[]> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const snap = await this.db
      .collection('test_sessions')
      .where('last_active_at', '>', fiveMinutesAgo)
      .get();

    const activeList: ActiveUser[] = [];
    for (const doc of snap.docs) {
      const s = doc.data() as StoredSession;
      if (!s.user_id) continue;

      const userDoc = await this.db.collection('users').doc(s.user_id).get();
      const u = userDoc.data();
      activeList.push({
        user_id: s.user_id,
        name: u?.name ?? 'Usuario Anónimo',
        email: u?.email ?? null,
        session_id: doc.id,
        status: s.status,
        personality_code: s.personality_code,
        last_active_at: s.last_active_at
      });
    }

    return activeList.sort((a, b) => b.last_active_at.localeCompare(a.last_active_at));
  }

  async stats(): Promise<SessionStats> {
    const snap = await this.db.collection('test_sessions').get();
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    let completed_count = 0;
    let started_count = 0;
    let online_count = 0;
    const uniqueUserIds = new Set<string>();

    for (const doc of snap.docs) {
      const data = doc.data();
      if (data.status === 'completed') completed_count++;
      if (data.status === 'started') started_count++;
      if (data.user_id) uniqueUserIds.add(data.user_id);
      if (data.last_active_at && data.last_active_at > fiveMinutesAgo) {
        online_count++;
      }
    }

    return {
      completed_count,
      started_count,
      unique_users: uniqueUserIds.size,
      online_count
    };
  }

  async findByUserId(userId: string): Promise<StoredSession[]> {
    const snap = await this.db
      .collection('test_sessions')
      .where('user_id', '==', userId)
      .orderBy('started_at', 'desc')
      .get();
    return snap.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...(doc.data() as any) }) as StoredSession);
  }

  async listWithUsers(opts?: {
    personality?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<SessionWithUser[]> {
    let query: Query = this.db.collection('test_sessions');
    if (opts?.status) query = query.where('status', '==', opts.status);
    if (opts?.personality) query = query.where('personality_code', '==', opts.personality);

    const snap = await query.orderBy('started_at', 'desc').get();
    const userIds = Array.from(
      new Set(snap.docs.map((d: QueryDocumentSnapshot) => d.data().user_id).filter(Boolean))
    ) as string[];

    const userMap = new Map<string, { id: string; name: string; email: string | null }>();
    for (const uid of userIds) {
      const userDoc = await this.db.collection('users').doc(uid).get();
      if (userDoc.exists) {
        const u = userDoc.data();
        userMap.set(uid, { id: userDoc.id, name: u?.name ?? '', email: u?.email ?? null });
      }
    }

    const allSessions: SessionWithUser[] = snap.docs.map((doc: QueryDocumentSnapshot) => {
      const s = { id: doc.id, ...(doc.data() as any) } as StoredSession;
      return {
        ...s,
        user: s.user_id ? userMap.get(s.user_id) : undefined
      };
    });

    const offset = opts?.offset ?? 0;
    const limit = opts?.limit ?? 50;
    return allSessions.slice(offset, offset + limit);
  }

  async remove(id: string): Promise<void> {
    await this.db.collection('test_sessions').doc(id).delete();
  }

  async countByPersonality(): Promise<PersonalityCount[]> {
    const snap = await this.db.collection('test_sessions').get();
    const counts: Record<string, number> = {};

    for (const doc of snap.docs) {
      const code = doc.data().personality_code;
      if (code) {
        counts[code] = (counts[code] ?? 0) + 1;
      }
    }

    return Object.entries(counts)
      .map(([personality_code, count]) => ({ personality_code, count }))
      .sort((a, b) => b.count - a.count);
  }
}
