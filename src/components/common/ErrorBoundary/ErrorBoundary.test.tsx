import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './index';

const ProblemChild = () => {
  throw new Error('Simulated crash in component');
};

const SafeChild = () => <div>Componente renderizado com sucesso</div>;

describe('ErrorBoundary Component', () => {
  const originalConsoleWarn = console.warn;

  beforeAll(() => {
    console.warn = vi.fn();
  });

  afterAll(() => {
    console.warn = originalConsoleWarn;
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <SafeChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Componente renderizado com sucesso')).toBeInTheDocument();
  });

  it('catches render error and displays friendly fallback screen', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Ops! Algo deu errado')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Recarregar página' })).toBeInTheDocument();
  });
});
