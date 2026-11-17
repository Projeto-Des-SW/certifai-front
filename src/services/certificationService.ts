import api from '../api';
import type { AbstractResponse } from '../interfaces/AbstractInterfaces';
import type { CertificationData, CertificationFormData } from '../pages/certifications/indexModel';

export const certificationService = {
  getAll: async (): Promise<CertificationData[]> => {
    const response = await api.get<AbstractResponse<CertificationData[]>>('/certificacoes');
    return response.data.data || [];
  },

  getById: async (id: number): Promise<CertificationData> => {
    const response = await api.get<AbstractResponse<CertificationData>>(`/certificacoes/${id}`);
    return response.data.data;
  },

  create: async (data: CertificationFormData): Promise<CertificationData> => {
    const response = await api.post<AbstractResponse<CertificationData>>('/certificacoes', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<CertificationFormData>): Promise<CertificationData> => {
    const response = await api.put<AbstractResponse<CertificationData>>(`/certificacoes/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete<AbstractResponse<void>>(`/certificacoes/${id}`);
  },
};

export default certificationService;
