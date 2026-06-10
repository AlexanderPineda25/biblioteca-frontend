import { useState } from 'react';
import RoleCard from '../roles/RoleCard.jsx';
import Spinner from '../common/Spinner.jsx';

export default function RolesTab({ roles, loading, error, createRole, addPermission }) {
    const [newRoleName, setNewRoleName] = useState('');
    const [creating, setCreating] = useState(false);

    const handleCreateRole = async (e) => {
        e.preventDefault();
        if (!newRoleName.trim()) return;
        setCreating(true);
        try {
            await createRole(newRoleName);
            setNewRoleName('');
        } catch {
            // Error ya manejado en el hook
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-900/50">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Crear Rol</h3>
                <form onSubmit={handleCreateRole} className="mt-4 flex gap-3">
                    <input
                        type="text"
                        placeholder="Nombre del rol"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-500 transition focus:border-university-600 focus:outline-none focus:ring-2 focus:ring-university-600/10 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400"
                    />
                    <button
                        type="submit"
                        disabled={creating || !newRoleName.trim()}
                        className="inline-flex rounded-full bg-university-600 px-6 py-3 text-sm font-semibold text-slate-50 transition hover:bg-university-700 dark:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Crear
                    </button>
                </form>
            </div>

            {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-800 shadow-sm transition-colors duration-200 dark:border-rose-800/40 dark:bg-rose-900/20 dark:text-rose-400 dark:shadow-slate-900/50">{error}</div>}
            {loading && <Spinner />}

            {!loading && !error && roles.length === 0 && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-700 shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:shadow-slate-900/50">
                    <p className="text-lg font-semibold">No hay roles</p>
                </div>
            )}

            {!loading && !error && roles.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                    {roles.map((role) => (
                        <RoleCard
                            key={role.id || role.name}
                            role={role}
                            onAddPermission={addPermission}
                            loading={loading}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
