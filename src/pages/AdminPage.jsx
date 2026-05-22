import { useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useBooks } from '../hooks/useBooks.js';
import { useUsers } from '../hooks/useUsers.js';
import { useRoles } from '../hooks/useRoles.js';
import { canManageBooks } from '../utils/roles.js';
import BookForm from '../components/books/BookForm.jsx';
import RoleCard from '../components/roles/RoleCard.jsx';
import Spinner from '../components/common/Spinner.jsx';
import { getApiErrorMessage } from '../utils/apiError.js';

const TABS = ['Libros', 'Usuarios', 'Roles'];

export default function AdminPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Libros');
    
    // Books
    const { books, loading: booksLoading, error: booksError, page: booksPage, pagination: booksPagination, setPage: setBooksPage, deleteBook, saveBook } = useBooks({ title: '', author: '', category: '', available: false });
    const [editingBook, setEditingBook] = useState(null);
    const [formError, setFormError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    
    // Users
    const { users, loading: usersLoading, error: usersError, assignRole } = useUsers();
    const [assigningRole, setAssigningRole] = useState({});
    const [userAssignRoleError, setUserAssignRoleError] = useState(null);
    
    // Roles
    const { roles, loading: rolesLoading, error: rolesError, createRole, addPermission } = useRoles();
    const [newRoleName, setNewRoleName] = useState('');
    const [creatingRole, setCreatingRole] = useState(false);

    const canManage = useMemo(() => canManageBooks(user?.roles || []), [user?.roles]);
    const isAdmin = useMemo(() => user?.roles?.includes('Admin'), [user?.roles]);

    const handleDeleteBook = async (book) => {
        const confirmed = window.confirm(`¿Eliminar el libro "${book.title}"?`);
        if (!confirmed) return;
        await deleteBook(book.id);
    };

    const handleOpenForm = (book = null) => {
        setEditingBook(book);
        setFormError(null);
        setShowForm(true);
    };

    const handleSaveBook = async (payload, id) => {
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

    const handleAssignRole = async (userId, roleName) => {
        if (!roleName) {
            setUserAssignRoleError('Selecciona un rol');
            return;
        }
        setUserAssignRoleError(null);
        try {
            await assignRole(userId, roleName);
            setAssigningRole(prev => ({ ...prev, [userId]: '' }));
        } catch (error) {
            setUserAssignRoleError(getApiErrorMessage(error, 'Error al asignar rol'));
        }
    };

    const handleCreateRole = async (e) => {
        e.preventDefault();
        if (!newRoleName.trim()) return;
        setCreatingRole(true);
        try {
            await createRole(newRoleName);
            setNewRoleName('');
        } catch {
            // Error ya manejado en el hook
        } finally {
            setCreatingRole(false);
        }
    };

    if (!canManage) {
        return (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-900 shadow-sm">
                <h1 className="text-2xl font-semibold">Acceso denegado</h1>
                <p className="mt-3">Solo Admin o Bibliotecario pueden acceder al panel de administración.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
                <div className="bg-gradient-to-r from-slate-900 to-university-600 px-6 py-8 sm:px-10">
                    <div className="max-w-3xl text-slate-50">
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-200">Panel administrativo</p>
                        <h1 className="mt-3 text-4xl font-semibold leading-tight text-slate-50">Gestiona tu biblioteca</h1>
                        <p className="mt-4 text-sm text-slate-200/80">Administra libros, usuarios y roles desde un panel centralizado.</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <div className="flex gap-4 overflow-x-auto bg-white px-6 py-4">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
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
            </div>

            {/* Books Tab */}
            {activeTab === 'Libros' && (
                <div className="space-y-6">
                    <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:grid-cols-3">
                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                            <p className="text-sm font-semibold text-slate-900">Libros disponibles</p>
                            <p className="mt-3 text-3xl font-semibold text-university-600">{booksPagination.total ?? books.length}</p>
                        </div>
                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                            <p className="text-sm font-semibold text-slate-900">Página actual</p>
                            <p className="mt-3 text-3xl font-semibold text-university-600">{booksPage}</p>
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

                    {booksError && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-800 shadow-sm">{booksError}</div>}
                    {booksLoading && <Spinner />}

                    {!booksLoading && !booksError && (
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
                                                        onClick={() => handleDeleteBook(book)}
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
                                <span>Mostrando página {booksPage} de {Math.max(1, Math.ceil(booksPagination.total / booksPagination.limit))}</span>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setBooksPage(Math.max(1, booksPage - 1))}
                                        disabled={booksPage <= 1}
                                        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 transition hover:bg-slate-100"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setBooksPage(booksPage + 1)}
                                        disabled={booksPage >= Math.ceil(booksPagination.total / booksPagination.limit)}
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
                            onSave={handleSaveBook}
                            loading={saving}
                            error={formError}
                        />
                    )}
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'Usuarios' && isAdmin && (
                <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-900">Gestionar Usuarios</h3>
                        <p className="mt-2 text-sm text-slate-600">Asigna roles a los usuarios del sistema.</p>
                    </div>

                    {usersError && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-800 shadow-sm">{usersError}</div>}
                    {userAssignRoleError && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-800 shadow-sm">{userAssignRoleError}</div>}
                    {usersLoading && <Spinner />}

                    {!usersLoading && !usersError && users.length === 0 && (
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-700 shadow-sm">
                            <p className="text-lg font-semibold">No hay usuarios</p>
                        </div>
                    )}

                    {!usersLoading && !usersError && users.length > 0 && (
                        <div className="space-y-4">
                            {users.map((u) => (
                                <div key={u.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex-1">
                                            <h4 className="text-lg font-semibold text-slate-900">{u.username}</h4>
                                            <p className="mt-1 text-sm text-slate-600">{u.email}</p>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {u.roles && u.roles.length > 0 ? (
                                                    u.roles.map((role) => (
                                                        <span
                                                            key={role.id || role.name}
                                                            className="inline-flex rounded-full bg-university-100 px-3 py-1 text-xs font-semibold text-university-800"
                                                        >
                                                            {role.name || role}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-slate-500 italic">Sin roles asignados</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 sm:w-56">
                                            <div className="flex gap-2">
                                                <select
                                                    value={assigningRole[u.id] || ''}
                                                    onChange={(e) => setAssigningRole(prev => ({ ...prev, [u.id]: e.target.value }))}
                                                    className="flex-1 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-university-600 focus:outline-none focus:ring-2 focus:ring-university-600/10"
                                                >
                                                    <option value="">Seleccionar rol...</option>
                                                    {roles.map((role) => (
                                                        <option key={role.id || role.name} value={role.name}>
                                                            {role.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => handleAssignRole(u.id, assigningRole[u.id])}
                                                    className="rounded-2xl bg-university-600 px-4 py-2 text-sm font-semibold text-slate-50 transition hover:bg-university-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                    disabled={!assigningRole[u.id]}
                                                >
                                                    Asignar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Roles Tab */}
            {activeTab === 'Roles' && isAdmin && (
                <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-900">Crear Rol</h3>
                        <form onSubmit={handleCreateRole} className="mt-4 flex gap-3">
                            <input
                                type="text"
                                placeholder="Nombre del rol"
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                                className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-500 transition focus:border-university-600 focus:outline-none focus:ring-2 focus:ring-university-600/10"
                            />
                            <button
                                type="submit"
                                disabled={creatingRole || !newRoleName.trim()}
                                className="inline-flex rounded-full bg-university-600 px-6 py-3 text-sm font-semibold text-slate-50 transition hover:bg-university-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Crear
                            </button>
                        </form>
                    </div>

                    {rolesError && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-800 shadow-sm">{rolesError}</div>}
                    {rolesLoading && <Spinner />}

                    {!rolesLoading && !rolesError && roles.length === 0 && (
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-700 shadow-sm">
                            <p className="text-lg font-semibold">No hay roles</p>
                        </div>
                    )}

                    {!rolesLoading && !rolesError && roles.length > 0 && (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {roles.map((role) => (
                                <RoleCard
                                    key={role.id || role.name}
                                    role={role}
                                    onAddPermission={addPermission}
                                    loading={rolesLoading}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {!isAdmin && activeTab !== 'Libros' && (
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm">
                    <p className="font-semibold">Solo administradores</p>
                    <p className="mt-2 text-sm">La pestaña "{activeTab}" solo está disponible para administradores.</p>
                </div>
            )}
        </div>
    );
}
