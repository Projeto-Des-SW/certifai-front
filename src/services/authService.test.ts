import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api';
import { authService } from './authService';

vi.mock('../api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

vi.mock('../apiSemHeader', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully log in and return login data', async () => {
    const mockLoginResponse = {
      data: {
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          token: 'mock-jwt-token',
          usuario: {
            id: 1,
            nome: 'Test User',
            email: 'test@example.com',
            role: 'USER',
            ativo: true,
          },
        },
      },
    };

    vi.mocked(api.post).mockResolvedValueOnce(mockLoginResponse);

    const result = await authService.login('test@example.com', 'password123');

    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.token).toBe('mock-jwt-token');
    expect(result.usuario.email).toBe('test@example.com');
  });

  it('should call getCurrentUser with authenticated client', async () => {
    const mockUserResponse = {
      data: {
        success: true,
        message: 'OK',
        data: {
          id: 42,
          nome: 'Dev Engineer',
          email: 'dev@certifai.io',
          role: 'ADMIN',
          ativo: true,
        },
      },
    };

    vi.mocked(api.get).mockResolvedValueOnce(mockUserResponse);

    const user = await authService.getCurrentUser(true);

    expect(api.get).toHaveBeenCalledWith('/auth/me');
    expect(user.id).toBe(42);
    expect(user.role).toBe('ADMIN');
  });

  it('should call logout API endpoint', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: { success: true } });

    await authService.logout();

    expect(api.post).toHaveBeenCalledWith('/auth/logout');
  });
});
