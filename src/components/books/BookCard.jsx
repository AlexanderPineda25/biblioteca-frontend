import { CalendarDays, Pencil, Trash2 } from 'lucide-react';
import { canManageBooks } from '../../utils/roles.js';

export default function BookCard({ book, onEdit, onDelete, currentRoles }) {
    const available = book.availableCopies > 0;
    const showActions = canManageBooks(currentRoles) && (onEdit || onDelete);

    return (
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-university-900">{book.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{book.author} · {book.editorial || 'Editorial desconocida'}</p>
                    <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDays size={15} aria-hidden="true" />
                        Año: {book.year || 'N/A'}
                    </p>
                </div>
                <div className="space-y-2 text-right">
                    <span className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {available ? 'Disponible' : 'Agotado'} · {book.availableCopies ?? 0}
                    </span>
                    <div className="flex flex-wrap justify-end gap-2">
                        {book.categories?.map((category) => (
                            <span key={category} className="rounded-md bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">
                                {category}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {book.description && <p className="mt-4 text-sm leading-6 text-slate-700">{book.description}</p>}

            {showActions && (
                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
                    {onEdit && (
                        <button
                            onClick={() => onEdit(book)}
                            className="btn-premium px-4 py-2"
                        >
                            <Pencil size={16} aria-hidden="true" />
                            Editar
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(book)}
                            className="btn-premium-danger px-4 py-2"
                        >
                            <Trash2 size={16} aria-hidden="true" />
                            Eliminar
                        </button>
                    )}
                </div>
            )}
        </article>
    );
}
