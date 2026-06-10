import { useState } from 'react';
import Spinner from '../common/Spinner.jsx';
import { getApiErrorMessage } from '../../utils/apiError.js';

export default function UsersTab({ users, loading, error, roles, assignRole }) {
    const [assigningRole, setAssigningRole] = useState({});
    const [assignError, setAssignError] = useState(null);

    const handleAssignRole = async (userId, roleName) => {
        if (!roleName) {
            setAssignError('Selecciona un rol');
            return;
        }
        setAssignError(null);
        try {
            await assignRole(userId, roleName);
            setAssigningRole(prev => ({ ...prev, [userId]: '' }));
        } catch (error) {
            setAssignError(getApiErrorMessage(error, 'Error al asignar rol'));
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-900/50">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Gestionar Usuarios</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Asigna roles a los usuarios del sistema.</p>
            </div>

            {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-800 shadow-sm dark:border-rose-800/40 dark:bg-rose-900/20 dark:text-rose-400 dark:shadow-slate-900/50">{error}</div>}
            {assignError && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-800 shadow-sm dark:border-rose-800/40 dark:bg-rose-900/20 dark:text-rose-400 dark:shadow-slate-900/50">{assignError}</div>}
            {loading && <Spinner />}

            {!loading && !error && users.length === 0 && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-700 shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:shadow-slate-900/50">
                    <p className="text-lg font-semibold">No hay usuarios</p>
                </div>
            )}

            {!loading && !error && users.length > 0 && (
                <div className="space-y-4">
                    {users.map((u) => (
                        <div key={u.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-900/50">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{u.username}</h4>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{u.email}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {u.roles && u.roles.length > 0 ? (
                                            u.roles.map((role) => (
                                                <span
                                                    key={role.id || role.name}
                                                    className="inline-flex rounded-full bg-university-100 px-3 py-1 text-xs font-semibold text-university-800 dark:bg-university-900/20 dark:text-university-300"
                                                >
                                                    {role.name || role}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-sm text-slate-500 italic dark:text-slate-400">Sin roles asignados</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 sm:w-56">
                                    <div className="flex gap-2">
                                        <select
                                            value={assigningRole[u.id] || ''}
                                            onChange={(e) => setAssigningRole(prev => ({ ...prev, [u.id]: e.target.value }))}
                                            className="flex-1 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-university-600 focus:outline-none focus:ring-2 focus:ring-university-600/10 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                                        >
                                            <option value="">Seleccionar rol...</option>
                                            {roles.map((role) => (
                                                <option key={role.id || role.name} value={role.name}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => handleAssignRole(u.id, assigningRole[u.id])}
                                            className="rounded-2xl bg-university-600 px-4 py-2 text-sm font-semibold text-slate-50 transition hover:bg-university-700 dark:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                            disabled={!assigningRole[u.id]}
                                        >
                                            Asignar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
