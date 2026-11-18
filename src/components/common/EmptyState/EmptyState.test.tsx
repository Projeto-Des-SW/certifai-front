import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmptyState from './index';

describe('EmptyState Component', () => {
  it('renders title and description properly', () => {
    render(
      <EmptyState
        title="Nenhuma certificação cadastrada"
        description="Comece criando sua primeira certificação para vincular simulados."
      />
    );

    expect(screen.getByRole('region', { name: 'Nenhuma certificação cadastrada' })).toBeInTheDocument();
    expect(screen.getByText('Nenhuma certificação cadastrada')).toBeInTheDocument();
    expect(screen.getByText('Comece criando sua primeira certificação para vincular simulados.')).toBeInTheDocument();
  });

  it('renders action button and triggers callback on click', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="Nenhum item"
        actionText="Cadastrar Prova"
        onAction={handleAction}
      />
    );

    const button = screen.getByRole('button', { name: 'Cadastrar Prova' });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
