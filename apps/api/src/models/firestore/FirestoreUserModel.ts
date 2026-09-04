import crypto from 'node:crypto';
import type { Firestore, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import type { SessionUser } from '@personalidad/core';
import type { StoredUser } from '../UserModel.js';

export class FirestoreUserModel {
  constructor(private readonly db: Firestore) {}

  async createOrFind(user: SessionUser): Promise<StoredUser[]> {
    if (user.email) {
      const snap = await this.db.collection('users').where('email', '==', user.email).limit(1).get();
      if (!snap.empty) {
        const doc = snap.docs[0];
        return [{ id: doc.id, ...(doc.data() as any) } as StoredUser];
      }
    }

    const id = crypto.randomUUID();
    const data: StoredUser = {
      id,
      name: user.name,
      email: user.email ?? null,
      created_at: new Date().toISOString()
    };
    await this.db.collection('users').doc(id).set(data);
    return [data];
  }

  async findById(id: string): Promise<StoredUser | undefined> {
    const doc = await this.db.collection('users').doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...(doc.data() as any) } as StoredUser;
  }

  async list(opts?: { search?: string; limit?: number; offset?: number }): Promise<StoredUser[]> {
    const snap = await this.db.collection('users').orderBy('created_at', 'desc').get();
    let users = snap.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...(doc.data() as any) }) as StoredUser);

    if (opts?.search && opts.search.trim()) {
      const term = opts.search.trim().toLowerCase();
      users = users.filter(
        (u: StoredUser) =>
          u.name.toLowerCase().includes(term) ||
          (u.email && u.email.toLowerCase().includes(term))
      );
    }

    const offset = opts?.offset ?? 0;
    const limit = opts?.limit ?? 50;
    return users.slice(offset, offset + limit);
  }

  async count(): Promise<number> {
    const snap = await this.db.collection('users').count().get();
    return snap.data().count;
  }

  async remove(id: string): Promise<void> {
    await this.db.collection('users').doc(id).delete();
  }
}
