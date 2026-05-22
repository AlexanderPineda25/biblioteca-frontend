import { useCallback, useEffect, useState } from 'react';
import * as usersApi from '../api/users.api.js';

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await usersApi.getUsers();
            // Manejar diferentes formatos de respuesta del servidor
            let usersList = [];

            if (response && response.data && Array.isArray(response.data)) {
                // Formato: { data: [...] }
                usersList = response.data;
            } else if (Array.isArray(response)) {
                // Respuesta directa como array
                usersList = response;
            }

            setUsers(usersList);
        } catch (fetchError) {
            setError(fetchError.response?.data?.message || fetchError.message || 'Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const activateUser = async (id) => {
        setError(null);
        try {
            await usersApi.activateUser(id);
            await fetchUsers();
        } catch (activateError) {
            setError(activateError.response?.data?.message || activateError.message || 'Error al activar usuario');
            throw activateError;
        }
    };

    const deactivateUser = async (id) => {
        setError(null);
        try {
            await usersApi.deactivateUser(id);
            await fetchUsers();
        } catch (deactivateError) {
            setError(deactivateError.response?.data?.message || deactivateError.message || 'Error al desactivar usuario');
            throw deactivateError;
        }
    };

    const assignRole = async (id, roleName) => {
        setError(null);
        try {
            await usersApi.assignRoleToUser(id, roleName);
            await fetchUsers();
        } catch (assignError) {
            setError(assignError.response?.data?.message || assignError.message || 'Error al asignar rol');
            throw assignError;
        }
    };

    return {
        users,
        loading,
        error,
        fetchUsers,
        activateUser,
        deactivateUser,
        assignRole,
    };
};
