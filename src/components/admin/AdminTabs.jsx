const TABS = ['Libros', 'Usuarios', 'Roles'];

export default function AdminTabs({ activeTab, onChange }) {
    return (
        <div className="flex gap-4 overflow-x-auto bg-white px-6 py-4 transition-colors duration-200 dark:bg-slate-900">
            {TABS.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    className={`pb-3 px-3 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                        activeTab === tab
                            ? 'border-university-600 text-university-600 dark:border-university-400 dark:text-university-400'
                            : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}
