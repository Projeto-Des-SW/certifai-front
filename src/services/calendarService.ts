import api from '../api';
import type { AbstractResponse } from '../interfaces/AbstractInterfaces';
import type { Event } from '../pages/calendar/indexModel';

export interface EventPayload {
  titulo: string;
  descricao?: string;
  inicio: string;
  fim: string;
  usuarioId?: number;
}

export const calendarService = {
  getAll: async (): Promise<Event[]> => {
    const response = await api.get<AbstractResponse<Event[]>>('/eventos');
    return response.data.data || [];
  },

  create: async (data: EventPayload): Promise<Event> => {
    const response = await api.post<AbstractResponse<Event>>('/eventos', data);
    return response.data.data;
  },

  update: async (id: number, data: EventPayload): Promise<Event> => {
    const response = await api.put<AbstractResponse<Event>>(`/eventos/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete<AbstractResponse<void>>(`/eventos/${id}`);
  },
};

export default calendarService;

