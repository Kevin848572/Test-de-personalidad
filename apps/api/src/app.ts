import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { loadConfig, type Config } from './config.js';
import { initFirestore } from './db/firestore.js';
import { createDatabaseAdapter, type DatabaseAdapter } from './db/databaseAdapter.js';
import { UserModel } from './models/UserModel.js';
import { SessionModel } from './models/SessionModel.js';
import { AdminModel } from './models/AdminModel.js';
import { QuestionModel } from './models/QuestionModel.js';
import { PersonalityModel } from './models/PersonalityModel.js';
import { FirestoreUserModel } from './models/firestore/FirestoreUserModel.js';
import { FirestoreSessionModel } from './models/firestore/FirestoreSessionModel.js';
import { FirestoreAdminModel } from './models/firestore/FirestoreAdminModel.js';
import { FirestoreQuestionModel } from './models/firestore/FirestoreQuestionModel.js';
import { FirestorePersonalityModel } from './models/firestore/FirestorePersonalityModel.js';
import { SessionService } from './services/SessionService.js';
import { AdminService } from './services/AdminService.js';
import { SessionController } from './controllers/SessionController.js';
import { QuestionsController } from './controllers/QuestionsController.js';
import { PersonalitiesController } from './controllers/PersonalitiesController.js';
import { HealthController } from './controllers/HealthController.js';
import { AdminAuthController } from './controllers/AdminAuthController.js';
import { AdminUsersController } from './controllers/AdminUsersController.js';
import { AdminSessionsController } from './controllers/AdminSessionsController.js';
import { AdminQuestionsController } from './controllers/AdminQuestionsController.js';
import { AdminPersonalitiesController } from './controllers/AdminPersonalitiesController.js';
import { AdminManageController } from './controllers/AdminManageController.js';
import { buildRouter } from './routes/index.js';

export async function createApp(customConfig?: Partial<Config>) {
  const config: Config = { ...loadConfig(), ...customConfig };

  // 1. Detección del motor de base de datos
  // Si se solicita 'firebase' o se configuran credenciales de Firebase, se usa Firestore
  let firestore = null;
  const hasFirebaseCreds = Boolean(
    config.firebaseServiceAccount ||
    (config.firebaseProjectId && config.firebaseClientEmail) ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS
  );

  if (config.dbDriver === 'firebase' || (config.dbDriver === 'auto' && hasFirebaseCreds)) {
    firestore = initFirestore(config);
  }

  let userModel: any;
  let sessionModel: any;
  let adminModel: any;
  let questionModel: any;
  let personalityModel: any;
  let sqlDb: DatabaseAdapter | null = null;

  if (firestore) {
    console.log('🚀 Base de datos activa: Firebase Firestore');
    userModel = new FirestoreUserModel(firestore);
    sessionModel = new FirestoreSessionModel(firestore);
    adminModel = new FirestoreAdminModel(firestore);
    questionModel = new FirestoreQuestionModel(firestore);
    personalityModel = new FirestorePersonalityModel(firestore);
  } else {
    console.log('🚀 Base de datos activa: SQL Adapter (PostgreSQL / SQLite)');
    sqlDb = await createDatabaseAdapter(config);
    userModel = new UserModel(sqlDb);
    sessionModel = new SessionModel(sqlDb);
    adminModel = new AdminModel(sqlDb);
    questionModel = new QuestionModel(sqlDb);
    personalityModel = new PersonalityModel(sqlDb);
  }

  // 2. Servicios de negocio
  const sessionService = new SessionService(userModel, sessionModel);
  const adminService = new AdminService(adminModel, config);

  // 3. Controladores
  const sessionController = new SessionController(sessionService);
  const questionsController = new QuestionsController(questionModel);
  const personalitiesController = new PersonalitiesController(personalityModel);
  const healthController = new HealthController();
  const adminAuthController = new AdminAuthController(adminService);
  const adminManageController = new AdminManageController(adminService);
  const adminUsersController = new AdminUsersController(userModel);
  const adminSessionsController = new AdminSessionsController(sessionModel);
  const adminQuestionsController = new AdminQuestionsController(questionModel);
  const adminPersonalitiesController = new AdminPersonalitiesController(personalityModel);

  // 4. App Hono
  const app = new Hono();
  app.use('*', logger());
  app.use(
    '*',
    cors({
      origin: config.corsOrigin,
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
    })
  );

  app.route(
    '/',
    buildRouter(
      config,
      sessionController,
      questionsController,
      personalitiesController,
      healthController,
      adminAuthController,
      adminManageController,
      adminUsersController,
      adminSessionsController,
      adminQuestionsController,
      adminPersonalitiesController
    )
  );

  // 5. Sembrado de datos
  async function seed() {
    try {
      await questionModel.seedIfEmpty();
      await personalityModel.seedIfEmpty();
      await adminService.ensureDefaultAdmin();
      console.log('🌱 Datos iniciales listos.');
    } catch (err) {
      console.warn('⚠️ Seed inicial omitido:', (err as Error).message);
    }
  }

  return {
    app,
    config,
    seed,
    isFirestore: Boolean(firestore),
    sqlDb,
    firestore
  };
}
