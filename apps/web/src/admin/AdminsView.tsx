import { useCallback, useEffect, useState } from 'react';
import { adminApi, ApiError, type AdminRow } from '../services/adminApi';
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTable,
  FieldFeedback,
  AdminAlert,
  AdminModal,
  Spinner
} from './ui';

export function AdminsView() {
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  // Formulario de creación
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Modal para cambio de contraseña
  const [resetModalAdmin, setResetModalAdmin] = useState<AdminRow | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetErrors, setResetErrors] = useState<Record<string, string>>({});
  const [resetting, setResetting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.admins();
      setAdmins(res.items);
    } catch (e) {
      setFeedback({ type: 'error', message: (e as Error).message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function validateCreate(): boolean {
    const errs: Record<string, string> = {};
    const cleanUser = username.trim();

    if (!cleanUser) {
      errs.username = 'El nombre de usuario es obligatorio.';
    } else if (cleanUser.length < 3 || cleanUser.length > 30) {
      errs.username = 'Debe tener entre 3 y 30 caracteres.';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(cleanUser)) {
      errs.username = 'Solo se permiten letras, números, guión y guión bajo.';
    }

    if (!password) {
      errs.password = 'La contraseña es obligatoria.';
    } else if (password.length < 4) {
      errs.password = 'La contraseña debe tener al menos 4 caracteres.';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Debes confirmar la contraseña.';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (!validateCreate()) return;

    setSubmitting(true);
    try {
      await adminApi.createAdmin(username.trim(), password);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setFieldErrors({});
      setFeedback({ type: 'success', message: `Administrador "${username.trim()}" creado exitosamente.` });
      await load();
    } catch (err) {
      if (err instanceof ApiError && err.fields) {
        setFieldErrors(err.fields);
      }
      setFeedback({ type: 'error', message: (err as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  function openResetModal(admin: AdminRow) {
    setResetModalAdmin(admin);
    setNewPassword('');
    setConfirmNewPassword('');
    setResetErrors({});
  }

  function closeResetModal() {
    setResetModalAdmin(null);
    setNewPassword('');
    setConfirmNewPassword('');
    setResetErrors({});
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!resetModalAdmin) return;

    const errs: Record<string, string> = {};
    if (!newPassword) {
      errs.newPassword = 'La nueva contraseña es requerida.';
    } else if (newPassword.length < 4) {
      errs.newPassword = 'Debe tener al menos 4 caracteres.';
    }

    if (!confirmNewPassword) {
      errs.confirmNewPassword = 'Confirma la nueva contraseña.';
    } else if (newPassword !== confirmNewPassword) {
      errs.confirmNewPassword = 'Las contraseñas no coinciden.';
    }

    if (Object.keys(errs).length > 0) {
      setResetErrors(errs);
      return;
    }

    setResetting(true);
    try {
      await adminApi.changePassword(resetModalAdmin.username, newPassword);
      setFeedback({
        type: 'success',
        message: `Contraseña actualizada para el administrador "${resetModalAdmin.username}".`
      });
      closeResetModal();
    } catch (err) {
      setResetErrors({ newPassword: (err as Error).message });
    } finally {
      setResetting(false);
    }
  }

  async function handleDelete(a: AdminRow) {
    if (!confirm(`¿Estás seguro de eliminar permanentemente al administrador "${a.username}"?`)) return;
    setFeedback(null);
    try {
      await adminApi.deleteAdmin(a.id);
      setFeedback({ type: 'success', message: `Administrador "${a.username}" eliminado.` });
      await load();
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {feedback && (
        <AdminAlert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      <AdminCard title="Nuevo Administrador">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-400">
                Nombre de usuario
              </label>
              <AdminInput
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username) setFieldErrors((prev) => ({ ...prev, username: '' }));
                }}
                hasError={Boolean(fieldErrors.username)}
                placeholder="Ej: kevin_admin"
                disabled={submitting}
              />
              <FieldFeedback error={fieldErrors.username} />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-400">
                Contraseña
              </label>
              <AdminInput
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                }}
                hasError={Boolean(fieldErrors.password)}
                type="password"
                placeholder="Mínimo 4 caracteres"
                disabled={submitting}
              />
              <FieldFeedback error={fieldErrors.password} />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-400">
                Confirmar contraseña
              </label>
              <AdminInput
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                hasError={Boolean(fieldErrors.confirmPassword)}
                type="password"
                placeholder="Repite la contraseña"
                disabled={submitting}
              />
              <FieldFeedback error={fieldErrors.confirmPassword} />
            </div>
          </div>

          <div className="flex justify-end">
            <AdminButton type="submit" disabled={submitting}>
              {submitting ? 'Creando…' : 'Crear Administrador'}
            </AdminButton>
          </div>
        </form>
      </AdminCard>

      <AdminCard title={`Cuentas de Administradores (${admins.length})`}>
        {loading ? (
          <Spinner />
        ) : (
          <AdminTable head={['Usuario', 'Fecha de Registro', 'Acciones']}>
            {admins.map((a) => (
              <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-3 py-3 font-semibold text-white">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold"></span>
                    {a.username}
                  </span>
                </td>
                <td className="px-3 py-3 text-neutral-400 text-xs">
                  {new Date(a.created_at).toLocaleString()}
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <AdminButton
                      variant="ghost"
                      onClick={() => openResetModal(a)}
                    >
                      🔑 Cambiar Contraseña
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      onClick={() => handleDelete(a)}
                    >
                      🗑️ Eliminar
                    </AdminButton>
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      {/* Modal interactivo de cambio de contraseña */}
      <AdminModal
        isOpen={Boolean(resetModalAdmin)}
        onClose={closeResetModal}
        title={`Cambiar Contraseña: ${resetModalAdmin?.username ?? ''}`}
      >
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <p className="text-xs text-neutral-400">
            Ingresa y confirma la nueva clave de acceso para este usuario.
          </p>

          <div>
            <label className="mb-1 block text-xs font-semibold text-neutral-300">
              Nueva Contraseña
            </label>
            <AdminInput
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              hasError={Boolean(resetErrors.newPassword)}
              placeholder="Mínimo 4 caracteres"
              disabled={resetting}
              autoFocus
            />
            <FieldFeedback error={resetErrors.newPassword} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-neutral-300">
              Confirmar Nueva Contraseña
            </label>
            <AdminInput
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              hasError={Boolean(resetErrors.confirmNewPassword)}
              placeholder="Repite la nueva contraseña"
              disabled={resetting}
            />
            <FieldFeedback error={resetErrors.confirmNewPassword} />
          </div>

          <div className="mt-2 flex justify-end gap-2 border-t border-white/10 pt-3">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={closeResetModal}
              disabled={resetting}
            >
              Cancelar
            </AdminButton>
            <AdminButton type="submit" disabled={resetting}>
              {resetting ? 'Guardando…' : 'Actualizar Contraseña'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}