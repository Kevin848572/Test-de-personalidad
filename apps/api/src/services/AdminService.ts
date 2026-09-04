import type { Config } from '../config.js';
import type { AdminModel, AdminSafe, StoredAdmin } from '../models/AdminModel.js';
import { signAdminToken } from '../auth/jwt.js';
import bcrypt from 'bcryptjs';

export interface LoginResult {
  token: string;
  admin: AdminSafe;
}

/**
 * Servicio de Administración.
 * Orquesta el modelo de admins y la emisión de tokens.
 */
export class AdminService {
  constructor(
    private readonly admins: AdminModel,
    private readonly config: Config
  ) {}

  async login(username: string, plainPassword: string): Promise<LoginResult | null> {
    const admin = await this.admins.verifyCredentials(username, plainPassword);
    if (!admin) return null;
    const token = await signAdminToken(this.config.jwtSecret, {
      id: admin.id,
      username: admin.username
    });
    return {
      token,
      admin: { id: admin.id, username: admin.username, created_at: admin.created_at }
    };
  }

  async list(): Promise<AdminSafe[]> {
    return this.admins.list();
  }

  async createAdmin(username: string, password: string): Promise<AdminSafe | null> {
    if (await this.admins.findByUsername(username)) return null;
    const created = await this.admins.create(username, password);
    const row = created[0];
    return { id: row.id, username: row.username, created_at: row.created_at };
  }

  async updatePassword(username: string, password: string): Promise<boolean> {
    const admin = await this.admins.findByUsername(username);
    if (!admin) return false;
    await this.admins.updatePassword(admin.id, password);
    return true;
  }

  async deleteAdmin(id: string, currentId: string): Promise<boolean> {
    if (id === currentId) return false; // no eliminarse a sí mismo
    const admin = await this.admins.findById(id);
    if (!admin) return false;
    await this.admins.delete(id);
    return true;
  }

  /**
   * Garantiza que exista al menos el admin por defecto (desde .env)
   * para no quedarse bloqueado fuera del panel.
   */
  async ensureDefaultAdmin(): Promise<void> {
    const existing = await this.admins.findByUsername(this.config.adminUsername);
    if (!existing) {
      await this.admins.create(this.config.adminUsername, this.config.adminPassword);
    }
  }
}

export type { StoredAdmin };
