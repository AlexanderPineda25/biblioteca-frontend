import { BookOpen, LayoutDashboard, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { ROLES } from '../../utils/roles.js';
import ThemeToggle from './ThemeToggle.jsx';

export default function Navbar() {
    const { user, isAuthenticated, logout, hasRole } = useAuth();
    const navigate = useNavigate();
    const canManage = hasRole(ROLES.ADMIN) || hasRole(ROLES.BIBLIOTECARIO);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900/95">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3.5 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center justify-between gap-6">
                    <Link to="/catalog" className="inline-flex items-center gap-3 text-xl font-bold tracking-tight text-slate-900 transition hover:text-university-800 dark:text-slate-100 dark:hover:text-university-400">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-university-700 text-white shadow-sm shadow-university-700/20 dark:bg-university-600">
                            <BookOpen size={22} aria-hidden="true" />
                        </span>
                        <span>Biblioteca U</span>
                    </Link>
                    <nav className="hidden items-center gap-2 sm:flex">
                        <Link className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-university-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-university-400" to="/catalog">
                            <BookOpen size={16} aria-hidden="true" />
                            Catálogo
                        </Link>
                        {canManage && (
                            <Link className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-university-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-university-400" to="/admin">
                                <LayoutDashboard size={16} aria-hidden="true" />
                                Panel Admin
                            </Link>
                        )}
                    </nav>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <ThemeToggle />
                    {!isAuthenticated ? (
                        <Link className="btn-premium px-4 py-2.5" to="/login">
                            <LogIn size={16} aria-hidden="true" />
                            Iniciar sesión
                        </Link>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="btn-premium-secondary px-4 py-2.5"
                        >
                            <LogOut size={16} aria-hidden="true" />
                            Cerrar sesión
                        </button>
                    )}
                </div>
            </div>

            {isAuthenticated && user && (
                <div className="border-t border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-500 transition-colors duration-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 sm:px-6">
                    <div className="mx-auto max-w-7xl flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="flex items-center gap-1.5">
                            <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                            Conectado como: <span className="font-bold text-slate-800 dark:text-slate-200">{user.username}</span>
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {user.roles.map((role) => (
                                <span key={role} className="rounded-md border border-university-200 bg-university-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-university-700 dark:border-university-700/40 dark:bg-university-900/30 dark:text-university-400">
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
