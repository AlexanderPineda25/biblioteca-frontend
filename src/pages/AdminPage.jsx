import { useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useBooks } from '../hooks/useBooks.js';
import { useUsers } from '../hooks/useUsers.js';
import { useRoles } from '../hooks/useRoles.js';
import { canManageBooks } from '../utils/roles.js';
import AdminTabs from '../components/admin/AdminTabs.jsx';
import BooksTab from '../components/admin/BooksTab.jsx';
import UsersTab from '../components/admin/UsersTab.jsx';
import RolesTab from '../components/admin/RolesTab.jsx';

export default function AdminPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Libros');

    const { books, loading: booksLoading, error: booksError, page: booksPage, pagination: booksPagination, setPage: setBooksPage, deleteBook, saveBook } = useBooks({ title: '', author: '', category: '', available: false });
    const { users, loading: usersLoading, error: usersError, assignRole } = useUsers();
    const { roles, loading: rolesLoading, error: rolesError, createRole, addPermission } = useRoles();

    const canManage = useMemo(() => canManageBooks(user?.roles || []), [user?.roles]);
    const isAdmin = useMemo(() => user?.roles?.includes('Admin'), [user?.roles]);

    if (!canManage) {
        return (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-900 shadow-sm transition-colors duration-200 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400 dark:shadow-slate-900/50">
                <h1 className="text-2xl font-semibold">Acceso denegado</h1>
                <p className="mt-3">Solo Admin o Bibliotecario pueden acceder al panel de administración.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-900/50">
                <div className="bg-gradient-to-r from-slate-900 to-university-600 px-6 py-8 sm:px-10">
                    <div className="max-w-3xl text-slate-50 dark:text-slate-100">
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-200 dark:text-slate-400">Panel administrativo</p>
                        <h1 className="mt-3 text-4xl font-semibold leading-tight text-slate-50 dark:text-slate-100">Gestiona tu biblioteca</h1>
                        <p className="mt-4 text-sm text-slate-200/80 dark:text-slate-400/80">Administra libros, usuarios y roles desde un panel centralizado.</p>
                    </div>
                </div>
            </div>

            <div className="border-b border-slate-200 dark:border-slate-700">
                <AdminTabs activeTab={activeTab} onChange={setActiveTab} />
            </div>

            {activeTab === 'Libros' && (
                <BooksTab
                    books={books}
                    loading={booksLoading}
                    error={booksError}
                    page={booksPage}
                    pagination={booksPagination}
                    setPage={setBooksPage}
                    deleteBook={deleteBook}
                    saveBook={saveBook}
                />
            )}

            {activeTab === 'Usuarios' && isAdmin && (
                <UsersTab
                    users={users}
                    loading={usersLoading}
                    error={usersError}
                    roles={roles}
                    assignRole={assignRole}
                />
            )}

            {activeTab === 'Roles' && isAdmin && (
                <RolesTab
                    roles={roles}
                    loading={rolesLoading}
                    error={rolesError}
                    createRole={createRole}
                    addPermission={addPermission}
                />
            )}

            {!isAdmin && activeTab !== 'Libros' && (
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm transition-colors duration-200 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-400 dark:shadow-slate-900/50">
                    <p className="font-semibold">Solo administradores</p>
                    <p className="mt-2 text-sm">La pestaña "{activeTab}" solo está disponible para administradores.</p>
                </div>
            )}
        </div>
    );
}
