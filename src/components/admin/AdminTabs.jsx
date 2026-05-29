const TABS = ['Libros', 'Usuarios', 'Roles'];

export default function AdminTabs({ activeTab, onChange }) {
    return (
        <div className="flex gap-4 overflow-x-auto bg-white px-6 py-4">
            {TABS.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    className={`pb-3 px-3 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                        activeTab === tab
                            ? 'border-university-600 text-university-600'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}
