import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import type { Config } from '../config.js';

let firestoreInstance: Firestore | null = null;

export function initFirestore(config: Config): Firestore | null {
  if (firestoreInstance) return firestoreInstance;

  try {
    if (getApps().length > 0) {
      firestoreInstance = getFirestore();
      return firestoreInstance;
    }

    // 1. JSON completo como variable de entorno (formato estándar de Vercel)
    if (config.firebaseServiceAccount && config.firebaseServiceAccount.trim()) {
      try {
        const parsed = JSON.parse(config.firebaseServiceAccount.trim());
        const app = initializeApp({
          credential: cert(parsed),
          databaseURL: config.firebaseDatabaseUrl
        });
        firestoreInstance = getFirestore(app);
        console.log(`🔥 Firebase Firestore conectado usando Service Account JSON (Proyecto: ${parsed.project_id || 'detectado'})`);
        return firestoreInstance;
      } catch (e) {
        console.error('❌ Error al parsear FIREBASE_SERVICE_ACCOUNT JSON:', (e as Error).message);
      }
    }

    // 2. Variables individuales
    if (config.firebaseProjectId && config.firebaseClientEmail && config.firebasePrivateKey) {
      const app = initializeApp({
        credential: cert({
          projectId: config.firebaseProjectId,
          clientEmail: config.firebaseClientEmail,
          privateKey: config.firebasePrivateKey
        }),
        databaseURL: config.firebaseDatabaseUrl
      });
      firestoreInstance = getFirestore(app);
      console.log(`🔥 Firebase Firestore conectado con credenciales individuales (Proyecto: ${config.firebaseProjectId})`);
      return firestoreInstance;
    }

    // 3. Project ID solo (si se corre en GCP o emulador local)
    if (config.firebaseProjectId) {
      const app = initializeApp({
        projectId: config.firebaseProjectId,
        databaseURL: config.firebaseDatabaseUrl
      });
      firestoreInstance = getFirestore(app);
      console.log(`🔥 Firebase Firestore conectado con Project ID: ${config.firebaseProjectId}`);
      return firestoreInstance;
    }

    // 4. Google Application Default Credentials
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      const app = initializeApp();
      firestoreInstance = getFirestore(app);
      console.log('🔥 Firebase Firestore conectado mediante GOOGLE_APPLICATION_CREDENTIALS');
      return firestoreInstance;
    }

    return null;
  } catch (err) {
    console.warn('⚠️ No se pudo inicializar Firebase Admin Firestore:', (err as Error).message);
    return null;
  }
}
