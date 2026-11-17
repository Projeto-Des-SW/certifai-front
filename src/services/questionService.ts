import api from '../api';
import type { AbstractResponse } from '../interfaces/AbstractInterfaces';
import type { Questao } from '../pages/questions/indexModel';
import type { Alternativa } from '../pages/questions/components/QuestionModal/indexModel';

export const questionService = {
  getAll: async (): Promise<Questao[]> => {
    const response = await api.get<AbstractResponse<Questao[]>>('/questoes');
    return response.data.data || [];
  },

  getById: async (id: number): Promise<Questao> => {
    const response = await api.get<AbstractResponse<Questao>>(`/questoes/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<Questao>): Promise<Questao> => {
    const response = await api.post<AbstractResponse<Questao>>('/questoes', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<Questao>): Promise<Questao> => {
    const response = await api.put<AbstractResponse<Questao>>(`/questoes/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete<AbstractResponse<void>>(`/questoes/${id}`);
  },

  getAlternative: async (id: number): Promise<Alternativa> => {
    const response = await api.get<AbstractResponse<Alternativa>>(`/alternativas/${id}`);
    return response.data.data;
  },
};

export default questionService;
