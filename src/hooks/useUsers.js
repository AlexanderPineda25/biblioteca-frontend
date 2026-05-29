import { useCallback, useEffect, useState } from 'react';
import * as usersApi from '../api/users.api.js';

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        queueMicrotask(() => {
            if (!cancelled) setLoading(true);
            if (!cancelled) setError(null);
        });

        usersApi.getUsers()
            .then(response => {
                if (cancelled) return;
                let usersList = [];

                if (response && response.data && Array.isArray(response.data)) {
                    usersList = response.data;
                } else if (Array.isArray(response)) {
                    usersList = response;
                }

                setUsers(usersList);
            })
            .catch(fetchError => {
                if (cancelled) return;
                setError(fetchError.response?.data?.message || fetchError.message || 'Error al cargar usuarios');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [refreshKey]);

    const fetchUsers = useCallback(() => {
        setRefreshKey(k => k + 1);
    }, []);

    const activateUser = async (id) => {
        setError(null);
        try {
            await usersApi.activateUser(id);
            fetchUsers();
        } catch (activateError) {
            setError(activateError.response?.data?.message || activateError.message || 'Error al activar usuario');
            throw activateError;
        }
    };

    const deactivateUser = async (id) => {
        setError(null);
        try {
            await usersApi.deactivateUser(id);
            fetchUsers();
        } catch (deactivateError) {
            setError(deactivateError.response?.data?.message || deactivateError.message || 'Error al desactivar usuario');
            throw deactivateError;
        }
    };

    const assignRole = async (id, roleName) => {
        setError(null);
        try {
            await usersApi.assignRoleToUser(id, roleName);
            fetchUsers();
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
