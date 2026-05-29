import { useState } from 'react';
import BookForm from '../books/BookForm.jsx';
import Spinner from '../common/Spinner.jsx';
import { getApiErrorMessage } from '../../utils/apiError.js';

export default function BooksTab({ books, loading, error, page, pagination, setPage, deleteBook, saveBook }) {
    const [editingBook, setEditingBook] = useState(null);
    const [formError, setFormError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleDelete = async (book) => {
        const confirmed = window.confirm(`¿Eliminar el libro "${book.title}"?`);
        if (!confirmed) return;
        await deleteBook(book.id);
    };

    const handleOpenForm = (book = null) => {
        setEditingBook(book);
        setFormError(null);
        setShowForm(true);
    };

    const handleSave = async (payload, id) => {
        setFormError(null);
        setSaving(true);
        try {
            await saveBook(payload, id);
            setShowForm(false);
        } catch (saveError) {
            setFormError(getApiErrorMessage(saveError, 'Error al guardar libro'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:grid-cols-3">
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">Libros disponibles</p>
                    <p className="mt-3 text-3xl font-semibold text-university-600">{pagination.total ?? books.length}</p>
                </div>
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">Página actual</p>
                    <p className="mt-3 text-3xl font-semibold text-university-600">{page}</p>
                </div>
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">Acción</p>
                    <button
                        type="button"
                        onClick={() => handleOpenForm()}
                        className="mt-3 inline-flex rounded-full bg-university-600 px-5 py-3 text-sm font-semibold text-slate-50 transition hover:bg-university-700"
                    >
                        Nuevo libro
                    </button>
                </div>
            </div>

            {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-800 shadow-sm">{error}</div>}
            {loading && <Spinner />}

            {!loading && !error && (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-slate-600">Título</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-600">Autor</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-600">ISBN</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-600">Copias</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-600">Disponibles</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {books.map((book) => (
                                <tr key={book.id} className="transition hover:bg-slate-50">
                                    <td className="whitespace-nowrap px-4 py-4 text-slate-800">{book.title}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-slate-700">{book.author}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-slate-700">{book.isbn || 'N/A'}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-slate-700">{book.totalCopies ?? 0}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-slate-700">{book.availableCopies ?? 0}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-slate-700">
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => handleOpenForm(book)}
                                                className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(book)}
                                                className="rounded-full bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
                        <span>Mostrando página {page} de {Math.max(1, Math.ceil(pagination.total / pagination.limit))}</span>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page <= 1}
                                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 transition hover:bg-slate-100"
                            >
                                Anterior
                            </button>
                            <button
                                type="button"
                                onClick={() => setPage(page + 1)}
                                disabled={page >= Math.ceil(pagination.total / pagination.limit)}
                                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 transition hover:bg-slate-100"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showForm && (
                <BookForm
                    key={editingBook?.id ?? 'new'}
                    book={editingBook}
                    onClose={() => setShowForm(false)}
                    onSave={handleSave}
                    loading={saving}
                    error={formError}
                />
            )}
        </div>
    );
}
