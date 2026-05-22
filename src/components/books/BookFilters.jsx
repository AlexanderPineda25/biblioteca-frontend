export default function BookFilters({ filters, onChange }) {
    const handleInput = (field) => (event) => {
        onChange({ ...filters, [field]: event.target.value });
    };

    const handleCheckbox = (event) => {
        onChange({ ...filters, available: event.target.checked });
    };

    const handleClear = () => {
        onChange({ title: '', author: '', category: '', available: false });
    };

    return (
        <section className="mb-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="space-y-2">
                    <p className="text-lg font-semibold text-slate-900">Filtrar libros</p>
                    <p className="text-sm text-slate-600">Busca por título, autor o categoría y ve solo los libros disponibles.</p>
                </div>
                <button
                    type="button"
                    onClick={handleClear}
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                    Limpiar filtros
                </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <label className="space-y-2 text-sm text-slate-700">
                    Título
                    <input
                        type="text"
                        value={filters.title || ''}
                        onChange={handleInput('title')}
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-university-500 focus:ring-2 focus:ring-university-100"
                    />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                    Autor
                    <input
                        type="text"
                        value={filters.author || ''}
                        onChange={handleInput('author')}
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-university-500 focus:ring-2 focus:ring-university-100"
                    />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                    Categoría
                    <input
                        type="text"
                        value={filters.category || ''}
                        onChange={handleInput('category')}
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-university-500 focus:ring-2 focus:ring-university-100"
                    />
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <input
                        type="checkbox"
                        checked={filters.available || false}
                        onChange={handleCheckbox}
                        className="h-4 w-4 rounded border-slate-300 text-university-600 focus:ring-university-500"
                    />
                    Solo disponibles
                </label>
            </div>
        </section>
    );
}
