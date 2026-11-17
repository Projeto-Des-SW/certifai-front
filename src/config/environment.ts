/**
 * Centralized application environment configuration
 */
export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'https://certifai-backend.onrender.com/certifai',
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'seu-google-client-id-aqui',
} as const;
