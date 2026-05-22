import { useCallback, useEffect, useState } from 'react';
import * as rolesApi from '../api/roles.api.js';

export const useRoles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRoles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await rolesApi.getRoles();
            // Manejar diferentes formatos de respuesta
            let rolesList = [];

            if (response && response.data && Array.isArray(response.data)) {
                // Formato: { data: [...] }
                rolesList = response.data;
            } else if (Array.isArray(response)) {
                // Respuesta directa como array
                rolesList = response;
            }

            setRoles(rolesList);
        } catch (fetchError) {
            setError(fetchError.response?.data?.message || fetchError.message || 'Error al cargar roles');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const createRole = async (name) => {
        setError(null);
        try {
            await rolesApi.createRole(name);
            await fetchRoles();
        } catch (createError) {
            setError(createError.response?.data?.message || createError.message || 'Error al crear rol');
            throw createError;
        }
    };

    const addPermission = async (roleName, code, description = '') => {
        setError(null);
        try {
            await rolesApi.addPermissionToRole(roleName, code, description);
            await fetchRoles();
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
