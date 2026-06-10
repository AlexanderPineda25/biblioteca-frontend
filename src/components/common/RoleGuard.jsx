import { useAuth } from '../../hooks/useAuth.js';

export default function RoleGuard({ allowedRoles, children }) {
    const { user } = useAuth();

    const hasAccess = allowedRoles.some((role) => user?.roles?.includes(role));

    if (!hasAccess) {
        return (
            <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-900 shadow-sm transition-colors duration-200 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400 dark:shadow-slate-900/50">
                <h1 className="text-2xl font-semibold">Acceso denegado</h1>
                <p className="mt-3 text-slate-700 dark:text-slate-300">No tienes permisos suficientes para ver esta página.</p>
            </div>
        );
    }

    return children;
}
