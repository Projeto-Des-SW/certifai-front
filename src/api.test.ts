import { describe, it, expect } from 'vitest';
import { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getErrorMessage } from './api';

describe('getErrorMessage helper', () => {
  it('extracts error message from AxiosError with response data', () => {
    const error = new AxiosError('Request failed with status code 400');
    error.response = {
      data: { message: 'Credenciais inválidas. Verifique seu e-mail e senha.' },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };

    const message = getErrorMessage(error);
    expect(message).toBe('Credenciais inválidas. Verifique seu e-mail e senha.');
  });

  it('handles Network Error specifically', () => {
    const error = new AxiosError('Network Error');

    const message = getErrorMessage(error);
    expect(message).toBe('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
  });

  it('extracts message from standard Error instance', () => {
    const error = new Error('Falha local na validação');

    const message = getErrorMessage(error);
    expect(message).toBe('Falha local na validação');
  });

  it('returns fallback message for unknown error types', () => {
    const message = getErrorMessage(null, 'Erro genérico');
    expect(message).toBe('Erro genérico');
  });
});
