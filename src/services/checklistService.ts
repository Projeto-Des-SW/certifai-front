import api from '../api';
import type { AbstractResponse } from '../interfaces/AbstractInterfaces';
import type { Checklist, ItemChecklist } from '../pages/checklist/indexModel';

export interface ChecklistDTO {
  nome: string;
  descricao?: string;
  certificacao_id?: number | null;
  itensChecklist: ItemChecklist[];
}

export const checklistService = {
  getAll: async (certificacaoId?: number): Promise<Checklist[]> => {
    const url = certificacaoId ? `/checklist?certificacao_id=${certificacaoId}` : '/checklist';
    const response = await api.get<AbstractResponse<Checklist[]>>(url);
    return response.data.data || [];
  },

  create: async (data: ChecklistDTO): Promise<Checklist> => {
    const response = await api.post<AbstractResponse<Checklist>>('/checklist', data);
    return response.data.data;
  },

  update: async (id: number, data: ChecklistDTO): Promise<Checklist> => {
    const response = await api.put<AbstractResponse<Checklist>>(`/checklist/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete<AbstractResponse<void>>(`/checklist/${id}`);
  },
};

export default checklistService;
