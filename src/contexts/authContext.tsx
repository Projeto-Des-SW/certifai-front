import React, {
    createContext,
    useState,
    useContext,
    useEffect,
} from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api.tsx';
import apiWithoutAuthHeader from '../apiSemHeader.tsx';
import LoadingSpinner from '../components/common/LoadingSpinner/index.tsx';

import type { UsuarioResponse } from '../interfaces/UsuarioInterfaces.tsx';
import type { AuthResponse } from '../interfaces/AuthInterfaces.tsx';
import type { LoginResponse } from '../interfaces/LoginInterfaces.tsx';
import type { AbstractResponse } from '../interfaces/AbstractInterfaces.tsx';

const AuthContext = createContext<AuthResponse | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UsuarioResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await api.post<AbstractResponse<LoginResponse>>(
                '/auth/login',
                { email, password }
            );

            const loginData = response.data.data;
            if (loginData.token) {
                localStorage.setItem('token', loginData.token);
            }
            setUser(loginData.usuario);
            return true;
        } catch (_error) {
            setUser(null);
            return false;
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            sessionStorage.removeItem('token');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        } catch (_error) {
            sessionStorage.removeItem('token');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            setUser(null);
        }
    };

    useEffect(() => {
        const verifyAuth = async () => {
            const publicRoutesWithoutAuthCheck = [
                '/auth/reset-password', 
                '/auth/verify',         
                '/login',              
                '/register',           
                '/esqueci-senha',
                '/forgot-password',
                '/auth/validate-reset-token',    
            ];

            const token = localStorage.getItem('token');
            if (publicRoutesWithoutAuthCheck.includes(location.pathname) || !token) {
                setIsLoading(false); 
                setUser(null); 
                return;
            }
            const apiToUse = token ? api : apiWithoutAuthHeader; 

            try {
                const response = await apiToUse.get<AbstractResponse<UsuarioResponse>>('/auth/me');

                if (response.data && response.data.success) {
                    setUser(response.data.data);
                    if (!token) {
                        localStorage.setItem('loginWithGoogle', 'true');
                    }
                } else {
                    setUser(null);
                }
            } catch (_error) {
                localStorage.removeItem('token'); 
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        verifyAuth();
    }, [location.pathname]); 

    const isAuthenticated = !!user;

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Carregando CertifAI..." />;
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
