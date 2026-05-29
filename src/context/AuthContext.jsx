/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth.api.js';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const data = await authApi.getMe();
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
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (credentials) => {
        await authApi.login(credentials);
        await fetchUser();
        return user;
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
