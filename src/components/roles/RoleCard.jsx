import { useState } from 'react';

export default function RoleCard({ role, onAddPermission, loading = false }) {
    const [showAddPermission, setShowAddPermission] = useState(false);
    const [permissionCode, setPermissionCode] = useState('');
    const [permissionDescription, setPermissionDescription] = useState('');
    const [error, setError] = useState(null);

    const handleAddPermission = async (e) => {
        e.preventDefault();
        if (!permissionCode.trim()) {
            setError('El código de permiso es requerido');
            return;
        }
        setError(null);
        try {
            await onAddPermission(role.name, permissionCode, permissionDescription);
            setPermissionCode('');
            setPermissionDescription('');
            setShowAddPermission(false);
        } catch (err) {
            setError(err.message || 'Error al agregar permiso');
        }
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-900/50">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{role.name}</h4>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{role.description || 'Sin descripción'}</p>
            
            {role.permissions && role.permissions.length > 0 && (
                <div className="mt-4 space-y-2">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Permisos ({role.permissions.length}):</p>
                    <div className="flex flex-wrap gap-2">
                        {role.permissions.map((perm, idx) => (
                            <span
                                key={idx}
                                className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                                title={perm.description || perm.code || perm}
                            >
                                {perm.code || perm}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {showAddPermission && (
                <form onSubmit={handleAddPermission} className="mt-4 space-y-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                    {error && <p className="text-sm text-rose-700 dark:text-rose-400">{error}</p>}
                    <input
                        type="text"
                        placeholder="Código de permiso (ej: users.read)"
                        value={permissionCode}
                        onChange={(e) => setPermissionCode(e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-500 transition focus:border-university-600 focus:outline-none focus:ring-2 focus:ring-university-600/10 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400"
                    />
                    <input
                        type="text"
                        placeholder="Descripción (opcional)"
                        value={permissionDescription}
                        onChange={(e) => setPermissionDescription(e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-500 transition focus:border-university-600 focus:outline-none focus:ring-2 focus:ring-university-600/10 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400"
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={loading || !permissionCode.trim()}
                            className="flex-1 rounded-2xl bg-university-600 px-3 py-2 text-sm font-semibold text-slate-50 transition hover:bg-university-700 dark:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Agregar
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowAddPermission(false);
                                setPermissionCode('');
                                setPermissionDescription('');
                                setError(null);
                            }}
                            className="flex-1 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {!showAddPermission && (
                <button
                    onClick={() => setShowAddPermission(true)}
                    className="mt-4 rounded-2xl border border-university-200 bg-university-50 px-4 py-2 text-sm font-semibold text-university-700 transition hover:bg-university-100 dark:border-university-700/40 dark:bg-university-900/30 dark:text-university-400 dark:hover:bg-university-900/20"
                >
                    + Agregar Permiso
                </button>
            )}
        </div>
    );
}
