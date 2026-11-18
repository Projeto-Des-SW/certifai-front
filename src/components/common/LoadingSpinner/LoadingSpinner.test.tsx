import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './index';

describe('LoadingSpinner Component', () => {
  it('renders with default message and status role', () => {
    render(<LoadingSpinner />);

    const statusElement = screen.getByRole('status');
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveAttribute('aria-live', 'polite');
    expect(statusElement).toHaveAttribute('aria-busy', 'true');
    expect(screen.getAllByText('Carregando...')[0]).toBeInTheDocument();
  });

  it('renders custom message', () => {
    render(<LoadingSpinner message="Sincronizando simulados..." />);

    expect(screen.getAllByText('Sincronizando simulados...')[0]).toBeInTheDocument();
  });

  it('applies fullscreen class when fullScreen prop is true', () => {
    const { container } = render(<LoadingSpinner fullScreen />);

    const spinnerContainer = container.querySelector('.loading-spinner-container');
    expect(spinnerContainer).toHaveClass('fullscreen');
  });
});
