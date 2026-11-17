import api from '../api';
import type { AbstractResponse } from '../interfaces/AbstractInterfaces';
import type { UsuarioResponse } from '../interfaces/UsuarioInterfaces';

export interface UpdateUserPayload {
  nome?: string;
  email?: string;
  role?: string;
  ativo?: boolean;
}

export const userService = {
  getAll: async (statusFilter?: string): Promise<UsuarioResponse[]> => {
    const endpoint = statusFilter ? `/usuarios?status=${statusFilter}` : '/usuarios';
    const response = await api.get<AbstractResponse<UsuarioResponse[]>>(endpoint);
    return response.data.data || [];
  },

  getById: async (id: number): Promise<UsuarioResponse> => {
    const response = await api.get<AbstractResponse<UsuarioResponse>>(`/usuarios/${id}`);
    return response.data.data;
  },

  update: async (id: number, data: UpdateUserPayload): Promise<UsuarioResponse> => {
    const response = await api.put<AbstractResponse<UsuarioResponse>>(`/usuarios/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete<AbstractResponse<void>>(`/usuarios/${id}`);
  },

  deactivate: async (id: number): Promise<void> => {
    await api.patch<AbstractResponse<void>>(`/usuarios/${id}/desativar`);
  },
};

export default userService;

