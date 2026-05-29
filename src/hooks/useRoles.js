import { useCallback, useEffect, useState } from 'react';
import * as rolesApi from '../api/roles.api.js';

export const useRoles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        queueMicrotask(() => {
            if (!cancelled) setLoading(true);
            if (!cancelled) setError(null);
        });

        rolesApi.getRoles()
            .then(response => {
                if (cancelled) return;
                let rolesList = [];

                if (response && response.data && Array.isArray(response.data)) {
                    rolesList = response.data;
                } else if (Array.isArray(response)) {
                    rolesList = response;
                }

                setRoles(rolesList);
            })
            .catch(fetchError => {
                if (cancelled) return;
                setError(fetchError.response?.data?.message || fetchError.message || 'Error al cargar roles');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [refreshKey]);

    const fetchRoles = useCallback(() => {
        setRefreshKey(k => k + 1);
    }, []);

    const createRole = async (name) => {
        setError(null);
        try {
            await rolesApi.createRole(name);
            fetchRoles();
        } catch (createError) {
            setError(createError.response?.data?.message || createError.message || 'Error al crear rol');
            throw createError;
        }
    };

    const addPermission = async (roleName, code, description = '') => {
        setError(null);
        try {
            await rolesApi.addPermissionToRole(roleName, code, description);
            fetchRoles();
        } catch (addError) {
            setError(addError.response?.data?.message || addError.message || 'Error al agregar permiso');
            throw addError;
        }
    };

    return {
        roles,
        loading,
        error,
        fetchRoles,
        createRole,
        addPermission,
    };
};
