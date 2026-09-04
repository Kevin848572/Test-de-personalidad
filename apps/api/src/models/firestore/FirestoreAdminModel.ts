import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import type { Firestore, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import type { AdminSafe, StoredAdmin } from '../AdminModel.js';

export class FirestoreAdminModel {
  constructor(private readonly db: Firestore) {}

  async findByUsername(username: string): Promise<StoredAdmin | undefined> {
    const snap = await this.db.collection('admins').where('username', '==', username).limit(1).get();
    if (snap.empty) return undefined;
    const doc = snap.docs[0];
    return { id: doc.id, ...(doc.data() as any) } as StoredAdmin;
  }

  async findById(id: string): Promise<StoredAdmin | undefined> {
    const doc = await this.db.collection('admins').doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...(doc.data() as any) } as StoredAdmin;
  }

  async list(): Promise<AdminSafe[]> {
    const snap = await this.db.collection('admins').orderBy('created_at', 'asc').get();
    return snap.docs.map((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      return {
        id: doc.id,
        username: data.username,
        created_at: data.created_at
      };
    });
  }

  async create(username: string, plainPassword: string): Promise<StoredAdmin[]> {
    const passwordHash = await bcrypt.hash(plainPassword, 10);
    const id = crypto.randomUUID();
    const data: StoredAdmin = {
      id,
      username,
      password_hash: passwordHash,
      created_at: new Date().toISOString()
    };
    await this.db.collection('admins').doc(id).set(data);
    return [data];
  }

  async updatePassword(id: string, plainPassword: string): Promise<StoredAdmin[]> {
    const passwordHash = await bcrypt.hash(plainPassword, 10);
    await this.db.collection('admins').doc(id).update({
      password_hash: passwordHash
    });
    const updated = await this.findById(id);
    return updated ? [updated] : [];
  }

  async delete(id: string): Promise<void> {
    await this.db.collection('admins').doc(id).delete();
  }

  async verifyCredentials(username: string, plainPassword: string): Promise<StoredAdmin | null> {
    const admin = await this.findByUsername(username);
    if (!admin) return null;
    const ok = await bcrypt.compare(plainPassword, admin.password_hash);
    return ok ? admin : null;
  }
}
