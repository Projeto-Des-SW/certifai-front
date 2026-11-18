import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import { ENV } from './config/environment';

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[] | string>;
  status?: number;
}

/**
 * Extracts a human-readable error message from an API error response.
 */
export const getErrorMessage = (error: unknown, fallbackMessage = 'Ocorreu um erro inesperado.'): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (error.message === 'Network Error') {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'Tempo limite de resposta excedido. O servidor demorou para responder.';
    }
  } else if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
};

// Main authenticated axios instance
const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Inject Bearer token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Track if session expiration toast has been displayed to avoid spam
let hasShownSessionExpiredToast = false;

// Response interceptor: Global error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const { status, data } = error.response;
      const currentPath = window.location.pathname;
      const isAuthRoute = ['/login', '/register', '/forgot-password', '/reset-password', '/auth/verify'].includes(currentPath);

      switch (status) {
        case 401:
          // Unauthorized: Clear stored session
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.removeItem('token');

          if (!isAuthRoute && !hasShownSessionExpiredToast) {
            hasShownSessionExpiredToast = true;
            toast.error('Sua sessão expirou. Por favor, realize o login novamente.');
            setTimeout(() => {
              hasShownSessionExpiredToast = false;
              window.location.href = '/login';
            }, 1200);
          }
          break;

        case 403:
          toast.error('Acesso negado: você não possui permissão para executar esta ação.');
          break;

        case 404:
          // Optional notification for general 404s
          if (data?.message) {
            toast.warn(data.message);
          }
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          toast.error('Erro de comunicação com o servidor CertifAI. Tente novamente mais tarde.');
          break;

        default:
          break;
      }
    } else if (error.request) {
      // Network error or offline
      toast.error('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
    }

    return Promise.reject(error);
  }
);

export default api;
