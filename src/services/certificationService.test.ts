import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api';
import { certificationService } from './certificationService';

vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('certificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch list of certifications', async () => {
    const mockCertifications = [
      {
        id: 1,
        nome: 'AWS Certified Solutions Architect',
        descricao: 'Associate exam preparation',
        dificuldade: 'INTERMEDIARIO' as const,
        imagemUrl: 'https://example.com/aws.png',
        tags: ['Cloud', 'AWS'],
        ativo: true,
      },
    ];

    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Success',
        data: mockCertifications,
      },
    });

    const result = await certificationService.getAll();

    expect(api.get).toHaveBeenCalledWith('/certificacoes');
    expect(result).toHaveLength(1);
    expect(result[0].nome).toBe('AWS Certified Solutions Architect');
  });

  it('should create a new certification', async () => {
    const newCert = {
      nome: 'CKA - Certified Kubernetes Administrator',
      descricao: 'Hands-on Kubernetes cert',
      dificuldade: 'AVANCADO' as const,
      imagemUrl: '',
      tags: ['DevOps', 'Kubernetes'],
    };

    const mockResponse = {
      data: {
        success: true,
        message: 'Criado com sucesso',
        data: { id: 2, ...newCert, ativo: true },
      },
    };

    vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

    const result = await certificationService.create(newCert);

    expect(api.post).toHaveBeenCalledWith('/certificacoes', newCert);
    expect(result.id).toBe(2);
    expect(result.nome).toBe('CKA - Certified Kubernetes Administrator');
  });

  it('should delete a certification by id', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({
      data: { success: true, message: 'Deletado' },
    });

    await certificationService.delete(1);

    expect(api.delete).toHaveBeenCalledWith('/certificacoes/1');
  });
});
