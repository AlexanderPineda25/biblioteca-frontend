/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
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
        console.log('[AuthContext] login called with:', credentials);
        const loginResp = await authApi.login(credentials);
        console.log('[AuthContext] authApi.login succeeded, response:', loginResp);
        const data = await authApi.getMe();
        console.log('[AuthContext] authApi.getMe succeeded, data:', data);
        if (data?.username) {
            console.log('[AuthContext] calling setUser with username:', data.username);
            setUser({
                userId: data.userId,
                username: data.username,
                email: data.email,
                roles: data.roles || [],
            });
        } else {
            console.log('[AuthContext] data.username is falsy, NOT calling setUser');
        }
        console.log('[AuthContext] login returning');
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
