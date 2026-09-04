import { Hono } from 'hono';
import type { Config } from '../config.js';
import { requireAdmin } from '../auth/jwt.js';
import type { SessionController } from '../controllers/SessionController.js';
import type { QuestionsController } from '../controllers/QuestionsController.js';
import type { PersonalitiesController } from '../controllers/PersonalitiesController.js';
import type { HealthController } from '../controllers/HealthController.js';
import type { AdminAuthController } from '../controllers/AdminAuthController.js';
import type { AdminUsersController } from '../controllers/AdminUsersController.js';
import type { AdminSessionsController } from '../controllers/AdminSessionsController.js';
import type { AdminQuestionsController } from '../controllers/AdminQuestionsController.js';
import type { AdminPersonalitiesController } from '../controllers/AdminPersonalitiesController.js';
import type { AdminManageController } from '../controllers/AdminManageController.js';

/** Composición de rutas: une cada controlador con su endpoint. */
export function buildRouter(
  config: Config,
  session: SessionController,
  questions: QuestionsController,
  personalities: PersonalitiesController,
  health: HealthController,
  adminAuth: AdminAuthController,
  adminManage: AdminManageController,
  adminUsers: AdminUsersController,
  adminSessions: AdminSessionsController,
  adminQuestions: AdminQuestionsController,
  adminPersonalities: AdminPersonalitiesController
): Hono {
  const app = new Hono();

  // --- Público ---
  app.get('/health', (c) => health.check(c));
  app.get('/api/questions', (c) => questions.list(c));
  app.get('/api/personalities', (c) => personalities.list(c));

  app.post('/api/sessions', (c) => session.start(c));
  app.patch('/api/sessions/:id/heartbeat', (c) => session.heartbeat(c));
  app.post('/api/sessions/:id/complete', (c) => session.complete(c));
  app.get('/api/sessions/online', (c) => session.online(c));
  app.get('/api/stats', (c) => session.stats(c));

  // --- Admin (login y "yo" sin token previo) ---
  app.post('/api/admin/login', (c) => adminAuth.login(c));
  app.get('/api/admin/me', requireAdmin(config), (c) => adminAuth.me(c));

  // --- Admin (protegidos) ---
  const admin = new Hono();
  admin.use('*', requireAdmin(config));

  // Gestión de administradores
  admin.get('/admins', (c) => adminManage.list(c));
  admin.post('/admins', (c) => adminManage.create(c));
  admin.post('/admins/:username/password', (c) => adminManage.changePassword(c));
  admin.delete('/admins/:id', (c) => adminManage.remove(c));

  // Usuarios
  admin.get('/users', (c) => adminUsers.list(c));
  admin.delete('/users/:id', (c) => adminUsers.remove(c));

  // Sesiones
  admin.get('/sessions', (c) => adminSessions.list(c));
  admin.get('/sessions/by-personality', (c) => adminSessions.byPersonality(c));
  admin.delete('/sessions/:id', (c) => adminSessions.remove(c));

  // Preguntas
  admin.get('/questions', (c) => adminQuestions.list(c));
  admin.post('/questions', (c) => adminQuestions.create(c));
  admin.patch('/questions/:id', (c) => adminQuestions.update(c));
  admin.delete('/questions/:id', (c) => adminQuestions.remove(c));

  // Personalidades
  admin.get('/personalities', (c) => adminPersonalities.list(c));
  admin.post('/personalities', (c) => adminPersonalities.upsert(c));
  admin.delete('/personalities/:code', (c) => adminPersonalities.remove(c));

  app.route('/api/admin', admin);

  return app;
}