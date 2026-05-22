import { useState } from 'react';

const currentYear = new Date().getFullYear();

const toPublicationDate = (year) => {
    if (!year) return '';
    return `${year}-01-01`;
};

const getYearFromDate = (date) => {
    if (!date) return undefined;
    return new Date(`${date}T00:00:00`).getFullYear();
};

const initialForm = {
    title: '',
    author: '',
    isbn: '',
    editorial: '',
    publicationDate: '',
    categories: '',
    totalCopies: '',
    availableCopies: '',
    description: '',
};

const buildFormState = (book) => ({
    title: book?.title || '',
    author: book?.author || '',
    isbn: book?.isbn || '',
    editorial: book?.editorial || '',
    publicationDate: toPublicationDate(book?.year),
    categories: (book?.categories || []).join(', '),
    totalCopies: book?.totalCopies ?? '',
    availableCopies: book?.availableCopies ?? '',
    description: book?.description || '',
});

export default function BookForm({ book, onClose, onSave, loading, error }) {
    const [form, setForm] = useState(() => (book ? buildFormState(book) : initialForm));
    const [errors, setErrors] = useState({});

    const handleChange = (field) => (event) => {
        setForm({ ...form, [field]: event.target.value });
        setErrors({ ...errors, [field]: '' });
    };

    const validate = () => {
        const nextErrors = {};
        const publicationYear = getYearFromDate(form.publicationDate);
        const totalCopies = Number(form.totalCopies);
        const availableCopies = Number(form.availableCopies);

        if (!form.title.trim()) nextErrors.title = 'Titulo es obligatorio';
        if (!form.author.trim()) nextErrors.author = 'Autor es obligatorio';
        if (!form.totalCopies || Number.isNaN(totalCopies) || totalCopies < 1) {
            nextErrors.totalCopies = 'Copias totales debe ser mayor a 0';
        }
        if (form.availableCopies === '' || Number.isNaN(availableCopies) || availableCopies < 0) {
            nextErrors.availableCopies = 'Copias disponibles debe ser 0 o mas';
        }
        if (totalCopies >= 0 && availableCopies > totalCopies) {
            nextErrors.availableCopies = 'Las copias disponibles no pueden superar las totales';
        }
        if (publicationYear && (publicationYear < 1000 || publicationYear > currentYear + 5)) {
            nextErrors.publicationDate = `Selecciona una fecha entre el ano 1000 y ${currentYear + 5}`;
        }

        return nextErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = validate();
        if (Object.keys(nextErrors).length) {
            setErrors(nextErrors);
            return;
        }

        const payload = {
            title: form.title.trim(),
            author: form.author.trim(),
            isbn: form.isbn.trim() || undefined,
            editorial: form.editorial.trim() || undefined,
            year: getYearFromDate(form.publicationDate),
            categories: form.categories.split(',').map((tag) => tag.trim()).filter(Boolean),
            totalCopies: Number(form.totalCopies),
            availableCopies: Number(form.availableCopies),
            description: form.description.trim() || undefined,
        };

        await onSave(payload, book?.id);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 px-4 py-10">
            <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-2xl ring-1 ring-slate-200 md:p-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-university-600">Gestion de libros</p>
                        <h2 className="mt-2 text-2xl font-semibold text-university-900">
                            {book ? 'Editar libro' : 'Agregar nuevo libro'}
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Completa los datos esenciales para mantener el catalogo ordenado.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        Cerrar
                    </button>
                </div>

                {error && <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

                <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
                    {[
                        { label: 'Titulo', field: 'title' },
                        { label: 'Autor', field: 'author' },
                        { label: 'ISBN', field: 'isbn' },
                        { label: 'Editorial', field: 'editorial' },
                    ].map(({ label, field }) => (
                        <label key={field} className="block text-sm text-slate-700">
                            <span className="font-medium">{label}</span>
                            <input
                                type="text"
                                value={form[field]}
                                onChange={handleChange(field)}
                                className="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-university-500 focus:ring-2 focus:ring-university-100"
                            />
                            {errors[field] && <p className="mt-2 text-xs text-rose-600">{errors[field]}</p>}
                        </label>
                    ))}

                    <div className="grid gap-5 md:grid-cols-2">
                        <label className="block text-sm text-slate-700">
                            <span className="font-medium">Fecha de publicacion</span>
                            <input
                                type="date"
                                value={form.publicationDate}
                                onChange={handleChange('publicationDate')}
                                min="1000-01-01"
                                max={`${currentYear + 5}-12-31`}
                                className="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-university-500 focus:ring-2 focus:ring-university-100"
                            />
                            {errors.publicationDate && <p className="mt-2 text-xs text-rose-600">{errors.publicationDate}</p>}
                        </label>
                        <label className="block text-sm text-slate-700">
                            <span className="font-medium">Categorias</span>
                            <input
                                type="text"
                                value={form.categories}
                                onChange={handleChange('categories')}
                                placeholder="Ej: Clasicos, Historia"
                                className="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-university-500 focus:ring-2 focus:ring-university-100"
                            />
                        </label>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <label className="block text-sm text-slate-700">
                            <span className="font-medium">Copias totales</span>
                            <input
                                type="number"
                                min="1"
                                value={form.totalCopies}
                                onChange={handleChange('totalCopies')}
                                className="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-university-500 focus:ring-2 focus:ring-university-100"
                            />
                            {errors.totalCopies && <p className="mt-2 text-xs text-rose-600">{errors.totalCopies}</p>}
                        </label>
                        <label className="block text-sm text-slate-700">
                            <span className="font-medium">Copias disponibles</span>
                            <input
                                type="number"
                                min="0"
                                value={form.availableCopies}
                                onChange={handleChange('availableCopies')}
                                className="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-university-500 focus:ring-2 focus:ring-university-100"
                            />
                            {errors.availableCopies && <p className="mt-2 text-xs text-rose-600">{errors.availableCopies}</p>}
                        </label>
                    </div>

                    <label className="block text-sm text-slate-700">
                        <span className="font-medium">Descripcion</span>
                        <textarea
                            value={form.description}
                            onChange={handleChange('description')}
                            rows="4"
                            className="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-university-500 focus:ring-2 focus:ring-university-100"
                        />
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center rounded-md bg-university-600 px-6 py-3 text-sm font-semibold text-slate-50 transition hover:bg-university-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? 'Guardando...' : book ? 'Guardar cambios' : 'Crear libro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
