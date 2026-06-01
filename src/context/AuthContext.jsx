/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth.api.js';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        authApi.getMe({ signal })
            .then(data => {
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
            .catch(err => {
                if (err.name === 'CanceledError' || signal.aborted) return;
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });

        const onUnauthorized = () => setUser(null);
        window.addEventListener('auth:unauthorized', onUnauthorized);

        return () => {
            controller.abort();
            window.removeEventListener('auth:unauthorized', onUnauthorized);
        };
    }, []);

    const login = async (credentials) => {
        const controller = new AbortController();
        try {
            await authApi.login(credentials, { signal: controller.signal });
            const data = await authApi.getMe({ signal: controller.signal });
            if (data?.username) {
                setUser({
                    userId: data.userId,
                    username: data.username,
                    email: data.email,
                    roles: data.roles || [],
                });
            }
            return data;
        } catch (err) {
            if (err.name === 'CanceledError' || controller.signal.aborted) return;
            throw err;
        }
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
