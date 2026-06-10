import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { register } from '../api/auth.api.js';
import Spinner from '../components/common/Spinner.jsx';
import { getApiErrorMessage } from '../utils/apiError.js';

const EyeIcon = ({ hidden }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        {hidden ? (
            <>
                <path d="M3 3l18 18" />
                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                <path d="M9.9 5.2A9.8 9.8 0 0 1 12 5c5 0 8.5 4.2 9.5 7a12.3 12.3 0 0 1-2.3 3.6" />
                <path d="M6.4 6.8A12.4 12.4 0 0 0 2.5 12c1 2.8 4.5 7 9.5 7a9.7 9.7 0 0 0 4-.8" />
            </>
        ) : (
            <>
                <path d="M2.5 12c1-2.8 4.5-7 9.5-7s8.5 4.2 9.5 7c-1 2.8-4.5 7-9.5 7s-8.5-4.2-9.5-7z" />
                <circle cx="12" cy="12" r="3" />
            </>
        )}
    </svg>
);

export default function RegisterPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [success] = useState(location.state?.successMessage || '');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (field) => (event) => {
        setForm({ ...form, [field]: event.target.value });
        setErrors({ ...errors, [field]: '' });
        setServerError('');
    };

    const validate = () => {
        const nextErrors = {};
        if (!form.username.trim()) nextErrors.username = 'Usuario es obligatorio';
        if (!form.email.trim()) nextErrors.email = 'Email es obligatorio';
        if (!form.password.trim()) nextErrors.password = 'Contrasena es obligatoria';
        if (form.password && form.password.length < 6) nextErrors.password = 'Debe tener al menos 6 caracteres';
        return nextErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = validate();
        if (Object.keys(nextErrors).length) {
            setErrors(nextErrors);
            return;
        }

        setLoading(true);
        setServerError('');
        try {
            await register(form);
            navigate('/login', { state: { successMessage: 'Registro exitoso, ahora inicia sesion.' } });
        } catch (error) {
            setServerError(getApiErrorMessage(error, 'No se pudo registrar el usuario.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center px-4 py-10 sm:px-6">
            <div className="grid w-full grid-cols-1 gap-8 rounded-lg border border-slate-200 bg-white p-6 shadow-xl transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900 lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
                <div className="space-y-6">
                    <div className="inline-flex items-center rounded-md bg-university-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-university-700 dark:bg-university-900/30 dark:text-university-400">
                        Registrate ahora
                    </div>
                    <div>
                        <h1 className="text-3xl font-semibold text-university-900 sm:text-4xl dark:text-university-300">Crea tu cuenta universitaria</h1>
                        <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-400">
                            Unete al sistema y gestiona tus libros favoritos desde una interfaz clara y funcional.
                        </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-5 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">Dato util</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Usa un correo valido y una contrasena segura para acceder a todas las funciones.</p>
                    </div>
                </div>

                <div className="space-y-5">
                    {success && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-900/20 dark:text-emerald-400">{success}</div>}
                    {serverError && <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800/40 dark:bg-rose-900/20 dark:text-rose-400">{serverError}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block text-sm text-slate-700 dark:text-slate-300">
                            <span className="font-medium">Usuario</span>
                            <input
                                id="reg-username"
                                type="text"
                                value={form.username}
                                onChange={handleChange('username')}
                                autoComplete="username"
                                className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-university-500 focus:ring-2 focus:ring-university-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-university-400 dark:focus:ring-university-900/50"
                            />
                            {errors.username && <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">{errors.username}</p>}
                        </label>

                        <label className="block text-sm text-slate-700 dark:text-slate-300">
                            <span className="font-medium">Email</span>
                            <input
                                id="reg-email"
                                type="email"
                                value={form.email}
                                onChange={handleChange('email')}
                                autoComplete="email"
                                className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-university-500 focus:ring-2 focus:ring-university-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-university-400 dark:focus:ring-university-900/50"
                            />
                            {errors.email && <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">{errors.email}</p>}
                        </label>

                        <label className="block text-sm text-slate-700 dark:text-slate-300">
                            <span className="font-medium">Contrasena</span>
                            <div className="mt-2 flex rounded-md border border-slate-300 bg-white focus-within:border-university-500 focus-within:ring-2 focus-within:ring-university-100 dark:border-slate-600 dark:bg-slate-800 dark:focus-within:border-university-400 dark:focus-within:ring-university-900/50">
                                <input
                                    id="reg-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange('password')}
                                    autoComplete="new-password"
                                    className="min-w-0 flex-1 rounded-md border-0 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none dark:text-slate-100"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((current) => !current)}
                                    aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                                    title={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                                    className="inline-flex w-11 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                                >
                                    <EyeIcon hidden={showPassword} />
                                </button>
                            </div>
                            {errors.password && <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">{errors.password}</p>}
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center rounded-md bg-university-600 px-4 py-3 text-sm font-semibold text-slate-50 transition hover:bg-university-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-university-700 dark:hover:bg-university-600"
                        >
                            {loading ? <Spinner /> : 'Registrar cuenta'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                        Ya tienes cuenta?{' '}
                        <Link to="/login" className="font-semibold text-university-700 hover:text-university-900 dark:text-university-400 dark:hover:text-university-300">
                            Inicia sesion
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
