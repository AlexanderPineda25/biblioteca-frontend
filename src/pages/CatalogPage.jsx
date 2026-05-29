import { ArrowLeft, ArrowRight, LayoutDashboard, Sparkles, Search } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/books/BookCard.jsx';
import BookFilters from '../components/books/BookFilters.jsx';
import Spinner from '../components/common/Spinner.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useBooks } from '../hooks/useBooks.js';
import { useAiRecommendations } from '../hooks/useAiRecommendations.js';
import { canManageBooks } from '../utils/roles.js';

export default function CatalogPage() {
    const { user } = useAuth();
    const { books, filters, loading, error, page, pagination, updateFilters, setPage } = useBooks({ title: '', author: '', category: '', available: false });
    const { interest, setInterest, result: aiResult, loading: aiLoading, error: aiError, submit: handleAiSubmit } = useAiRecommendations();
    const canManage = useMemo(() => canManageBooks(user?.roles || []), [user?.roles]);
    const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.limit));

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="bg-slate-950 px-6 py-8 sm:px-10">
                    <div className="max-w-3xl text-slate-50">
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Catálogo universitario</p>
                        <h1 className="mt-3 text-4xl font-semibold leading-tight text-slate-50">Descubre libros con una experiencia limpia y moderna</h1>
                        <p className="mt-4 max-w-2xl text-sm text-slate-200/80">Filtra por título, autor, categoría y disponibilidad. Todas las funciones están optimizadas para una navegación rápida y minimalista.</p>
                    </div>
                </div>
                <div className="grid gap-6 border-t border-slate-200 px-6 py-6 sm:grid-cols-[1fr_0.5fr]">
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-slate-900">Total de libros</p>
                        <p className="text-3xl font-semibold text-university-900">{pagination.total ?? books.length}</p>
                    </div>
                    <div className="space-y-3 rounded-lg bg-slate-50 p-5">
                        <p className="text-sm font-semibold text-slate-900">Filtros activos</p>
                        <p className="text-sm text-slate-600">{filters.title || filters.author || filters.category || filters.available ? 'Se están aplicando filtros' : 'No hay filtros activos'}</p>
                        {filters.available && <span className="inline-flex rounded-md bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Solo disponibles</span>}
                    </div>
                </div>
            </div>

            <form onSubmit={handleAiSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                    <label className="space-y-2">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <Sparkles size={16} className="text-university-700" aria-hidden="true" />
                            Recomendador IA
                        </span>
                        <input
                            type="text"
                            value={interest}
                            onChange={(event) => setInterest(event.target.value)}
                            minLength={4}
                            maxLength={300}
                            required
                            placeholder="Ej: Quiero aprender microservicios y bases de datos"
                            className="input-premium"
                        />
                    </label>
                    <button
                        type="submit"
                        disabled={aiLoading}
                        className="btn-premium"
                    >
                        <Search size={16} aria-hidden="true" />
                        {aiLoading ? 'Consultando...' : 'Recomendar'}
                    </button>
                </div>

                {aiError && <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{aiError}</div>}
                {aiResult && (
                    <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                            {aiResult.provider} - {aiResult.model}
                        </p>
                        <p className="mt-2 text-xs font-semibold text-emerald-800">
                            Servicio externo: {aiResult.externalAiService || 'Hugging Face Inference API'} - {aiResult.externalAiServiceUsed ? 'usado' : 'fallback local'}
                        </p>
                        {aiResult.rankingStrategy && (
                            <p className="mt-1 text-xs text-emerald-800">
                                Ranking: {aiResult.rankingStrategy}
                            </p>
                        )}
                        {aiResult.chatAiUsed && (
                            <p className="mt-1 text-xs font-medium text-emerald-800">
                                Explicación Conversacional: Generada con {aiResult.chatAiProvider?.toUpperCase() || 'Chat LLM'}
                            </p>
                        )}
                        <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-6 text-slate-800">{aiResult.recommendation}</pre>
                    </div>
                )}
            </form>

            <BookFilters filters={filters} onChange={updateFilters} />

            {loading && <Spinner />}
            {error && <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-rose-800 shadow-sm">{error}</div>}

            {!loading && !error && (
                <div className="grid gap-6 lg:grid-cols-2">
                    {books.length ? books.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            currentRoles={user?.roles || []}
                            onEdit={canManage ? undefined : undefined}
                            onDelete={canManage ? undefined : undefined}
                        />
                    )) : (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-10 text-center text-slate-700 shadow-sm">
                            <p className="text-lg font-semibold text-slate-900">No hay libros que coincidan</p>
                            <p className="mt-3 text-sm text-slate-600">Prueba con otro término de búsqueda o desactiva el filtro de disponibilidad.</p>
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-slate-600">Página {page} de {totalPages}</span>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page <= 1}
                        className="btn-premium-secondary px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ArrowLeft size={16} aria-hidden="true" />
                        Anterior
                    </button>
                    <button
                        type="button"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages}
                        className="btn-premium-secondary px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Siguiente
                        <ArrowRight size={16} aria-hidden="true" />
                    </button>
                </div>
            </div>

            {canManage && (
                <div className="rounded-lg border border-university-100 bg-university-50 p-6 text-slate-700 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-university-900">Acceso administrativo</p>
                            <p className="mt-2 text-sm">Admin y Bibliotecario pueden crear, editar y eliminar libros desde el panel de administración.</p>
                        </div>
                        <Link
                            to="/admin"
                            className="btn-premium"
                        >
                            <LayoutDashboard size={16} aria-hidden="true" />
                            Abrir panel admin
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
