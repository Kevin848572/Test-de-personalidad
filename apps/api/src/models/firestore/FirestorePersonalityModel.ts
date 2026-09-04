import type { Firestore, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import {
  personalities as corePersonalities,
  type MBTICode,
  type PersonalityInfo
} from '@personalidad/core';
import type { CreatePersonalityInput, StoredPersonality } from '../PersonalityModel.js';

export class FirestorePersonalityModel {
  constructor(private readonly db: Firestore) {}

  async list(): Promise<StoredPersonality[]> {
    const snap = await this.db.collection('personalities').orderBy('code', 'asc').get();
    return snap.docs.map((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      return {
        code: (data.code || doc.id) as MBTICode,
        titulo: data.titulo,
        descripcion: data.descripcion,
        fortalezas: Array.isArray(data.fortalezas) ? data.fortalezas : [],
        debilidades: Array.isArray(data.debilidades) ? data.debilidades : [],
        updated_at: data.updated_at
      };
    });
  }

  async findByCode(code: string): Promise<StoredPersonality | undefined> {
    const clean = code.toUpperCase();
    const doc = await this.db.collection('personalities').doc(clean).get();
    if (!doc.exists) return undefined;
    const data = doc.data()!;
    return {
      code: (data.code || doc.id) as MBTICode,
      titulo: data.titulo,
      descripcion: data.descripcion,
      fortalezas: Array.isArray(data.fortalezas) ? data.fortalezas : [],
      debilidades: Array.isArray(data.debilidades) ? data.debilidades : [],
      updated_at: data.updated_at
    };
  }

  async upsert(input: CreatePersonalityInput): Promise<StoredPersonality[]> {
    const clean = input.code.toUpperCase() as MBTICode;
    const data: StoredPersonality = {
      code: clean,
      titulo: input.titulo,
      descripcion: input.descripcion,
      fortalezas: input.fortalezas,
      debilidades: input.debilidades,
      updated_at: new Date().toISOString()
    };
    await this.db.collection('personalities').doc(clean).set(data);
    return [data];
  }

  async remove(code: string): Promise<void> {
    await this.db.collection('personalities').doc(code.toUpperCase()).delete();
  }

  async count(): Promise<number> {
    const snap = await this.db.collection('personalities').count().get();
    return snap.data().count;
  }

  async seedIfEmpty(): Promise<void> {
    const count = await this.count();
    if (count > 0) return;

    console.log('🌱 Sembrando perfiles MBTI en Firestore...');
    const batch = this.db.batch();
    for (const [code, info] of Object.entries(corePersonalities) as [MBTICode, PersonalityInfo][]) {
      const ref = this.db.collection('personalities').doc(code);
      batch.set(ref, {
        code,
        titulo: info.titulo,
        descripcion: info.descripcion,
        fortalezas: info.fortalezas,
        debilidades: info.debilidades,
        updated_at: new Date().toISOString()
      });
    }
    await batch.commit();
    console.log('✅ 16 perfiles MBTI sembrados en Firestore.');
  }
}
