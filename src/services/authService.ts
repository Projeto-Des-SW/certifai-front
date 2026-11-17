import api from '../api';
import apiWithoutAuthHeader from '../apiSemHeader';
import type { AbstractResponse } from '../interfaces/AbstractInterfaces';
import type { LoginResponse } from '../interfaces/LoginInterfaces';
import type { UsuarioResponse } from '../interfaces/UsuarioInterfaces';

export interface LoginPayload {
  email: string;
  senha?: string;
  password?: string;
}

export interface RegisterPayload {
  nome: string;
  email: string;
  senha?: string;
  password?: string;
  role?: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<AbstractResponse<LoginResponse>>('/auth/login', {
      email,
      password,
    });
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async (useToken = true): Promise<UsuarioResponse> => {
    const client = useToken ? api : apiWithoutAuthHeader;
    const response = await client.get<AbstractResponse<UsuarioResponse>>('/auth/me');
    return response.data.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiWithoutAuthHeader.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, novaSenha: string): Promise<void> => {
    await apiWithoutAuthHeader.post('/auth/reset-password', {
      token,
      novaSenha,
    });
  },

  validateResetToken: async (token: string): Promise<boolean> => {
    const response = await apiWithoutAuthHeader.get<AbstractResponse<boolean>>(
      `/auth/validate-reset-token?token=${encodeURIComponent(token)}`
    );
    return response.data.data;
  },

  verifyEmail: async (token: string): Promise<void> => {
    await apiWithoutAuthHeader.get(`/auth/verify?token=${encodeURIComponent(token)}`);
  },
};

export default authService;
