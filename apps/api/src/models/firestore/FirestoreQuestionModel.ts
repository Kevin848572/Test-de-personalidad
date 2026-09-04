import type { Firestore, Query, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { questions as coreQuestions, type DimensionPair } from '@personalidad/core';
import type { CreateQuestionInput, StoredQuestion } from '../QuestionModel.js';

export class FirestoreQuestionModel {
  constructor(private readonly db: Firestore) {}

  async list(activeOnly = false, order = 'id.asc'): Promise<StoredQuestion[]> {
    let query: Query = this.db.collection('questions');
    if (activeOnly) {
      query = query.where('is_active', '==', true);
    }

    const snap = await query.orderBy('id', order === 'id.desc' ? 'desc' : 'asc').get();
    return snap.docs.map((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      return {
        id: Number(data.id),
        text: data.text,
        column: Number(data.column),
        dim: data.dim as DimensionPair,
        is_active: Boolean(data.is_active)
      };
    });
  }

  async findById(id: number): Promise<StoredQuestion | undefined> {
    const doc = await this.db.collection('questions').doc(String(id)).get();
    if (!doc.exists) return undefined;
    const data = doc.data()!;
    return {
      id: Number(data.id),
      text: data.text,
      column: Number(data.column),
      dim: data.dim as DimensionPair,
      is_active: Boolean(data.is_active)
    };
  }

  async create(input: CreateQuestionInput): Promise<StoredQuestion[]> {
    let id = input.id;
    if (id === undefined) {
      const snap = await this.db.collection('questions').orderBy('id', 'desc').limit(1).get();
      id = snap.empty ? 1 : Number(snap.docs[0].data().id) + 1;
    }

    const data: StoredQuestion = {
      id,
      text: input.text,
      column: input.column,
      dim: input.dim,
      is_active: input.is_active ?? true
    };

    await this.db.collection('questions').doc(String(id)).set({
      ...data,
      updated_at: new Date().toISOString()
    });

    return [data];
  }

  async update(id: number, patch: Partial<CreateQuestionInput>): Promise<StoredQuestion[]> {
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };
    if (patch.text !== undefined) updateData.text = patch.text;
    if (patch.column !== undefined) updateData.column = patch.column;
    if (patch.dim !== undefined) updateData.dim = patch.dim;
    if (patch.is_active !== undefined) updateData.is_active = patch.is_active;

    await this.db.collection('questions').doc(String(id)).update(updateData);
    const updated = await this.findById(id);
    return updated ? [updated] : [];
  }

  async remove(id: number): Promise<void> {
    await this.db.collection('questions').doc(String(id)).delete();
  }

  async count(): Promise<number> {
    const snap = await this.db.collection('questions').count().get();
    return snap.data().count;
  }

  async seedIfEmpty(): Promise<void> {
    const count = await this.count();
    if (count > 0) return;

    console.log('🌱 Sembrando banco de preguntas MBTI en Firestore...');
    const batch = this.db.batch();
    for (const q of coreQuestions) {
      const ref = this.db.collection('questions').doc(String(q.id));
      batch.set(ref, {
        id: q.id,
        text: q.text,
        column: q.column,
        dim: q.dim,
        is_active: true,
        updated_at: new Date().toISOString()
      });
    }
    await batch.commit();
    console.log(`✅ ${coreQuestions.length} preguntas sembradas en Firestore.`);
  }
}
