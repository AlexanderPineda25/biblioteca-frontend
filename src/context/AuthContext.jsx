/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '../api/auth.api.js';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        queueMicrotask(() => {
            if (!cancelled) setLoading(true);
        });

        authApi.getMe()
            .then(data => {
                if (cancelled) return;
                if (data?.username) {
                    setUser({
                        userId: data.userId,
                        username: data.username,
                        email: data.email,
                        roles: data.roles || [],
                    });
                } else {
                    setUser(null);
                }
            })
            .catch(() => {
                if (cancelled) return;
                setUser(null);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        const onUnauthorized = () => {
            if (!cancelled) setUser(null);
        };
        window.addEventListener('auth:unauthorized', onUnauthorized);

        return () => {
            cancelled = true;
            window.removeEventListener('auth:unauthorized', onUnauthorized);
        };
    }, []);

    const login = async (credentials) => {
        await authApi.login(credentials);
        const data = await authApi.getMe();
        if (data?.username) {
            setUser({
                userId: data.userId,
                username: data.username,
                email: data.email,
                roles: data.roles || [],
            });
        }
        return data;
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch {
            // ignorar errores de logout
        }
        setUser(null);
    };

    const isAuthenticated = Boolean(user);

    const hasRole = (role) => {
        if (!user?.roles) return false;
        return user.roles.includes(role);
    };

    const contextValue = {
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        hasRole,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
