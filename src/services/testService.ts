import api from '../api';
import type { AbstractResponse } from '../interfaces/AbstractInterfaces';
import type { TestData, TestFormData } from '../pages/tests/indexModel';

export interface CreateCustomTestPayload {
  usuarioId: number;
  certificacaoId: number;
  quantidadeQuestoes: number;
  tempoLimiteMinutos?: number;
}

export const testService = {
  getAll: async (): Promise<TestData[]> => {
    const response = await api.get<AbstractResponse<TestData[]>>('/provas');
    return response.data.data || [];
  },

  getById: async (id: number): Promise<TestData> => {
    const response = await api.get<AbstractResponse<TestData>>(`/provas/${id}`);
    return response.data.data;
  },

  createCustom: async (payload: CreateCustomTestPayload): Promise<TestData> => {
    const response = await api.post<AbstractResponse<TestData>>('/provas/montar-personalizada', payload);
    return response.data.data;
  },

  update: async (id: number, data: Partial<TestFormData>): Promise<TestData> => {
    const response = await api.put<AbstractResponse<TestData>>(`/provas/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete<AbstractResponse<void>>(`/provas/${id}`);
  },

  start: async (id: number): Promise<TestData> => {
    const response = await api.post<AbstractResponse<TestData>>(`/provas/${id}/iniciar`);
    return response.data.data;
  },

  finish: async (id: number): Promise<void> => {
    await api.post<AbstractResponse<void>>(`/provas/${id}/finalizar`);
  },
};

export default testService;
