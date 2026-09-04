import { useCallback, useEffect, useState } from 'react';
import { adminApi, type UserRow } from '../services/adminApi';
import { AdminButton, AdminCard, AdminInput, AdminTable, Spinner } from './ui';

export function UsersView() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (term?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.users(term);
      setUsers(res.items);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este usuario y sus sesiones?')) return;
    await adminApi.deleteUser(id);
    await load(search);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    load(search);
  }

  return (
    <AdminCard
      title="Usuarios"
      action={
        <form onSubmit={handleSearch} className="flex gap-2">
          <AdminInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email…"
            className="w-56"
          />
          <AdminButton type="submit" variant="ghost">Buscar</AdminButton>
        </form>
      }
    >
      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

      {loading ? (
        <Spinner />
      ) : users.length === 0 ? (
        <p className="text-sm text-neutral-500">No hay usuarios.</p>
      ) : (
        <AdminTable head={['Nombre', 'Email', 'Registro', '']}>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="px-3 py-2.5 font-medium text-white">{u.name}</td>
              <td className="px-3 py-2.5 text-neutral-400">{u.email ?? '—'}</td>
              <td className="px-3 py-2.5 text-neutral-500">{new Date(u.created_at).toLocaleString()}</td>
              <td className="px-3 py-2.5 text-right">
                <AdminButton variant="danger" onClick={() => handleDelete(u.id)}>
                  Eliminar
                </AdminButton>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </AdminCard>
  );
}