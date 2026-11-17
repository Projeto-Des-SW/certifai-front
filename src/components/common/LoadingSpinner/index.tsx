import React from 'react';
import './styles.css';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = 'Carregando...',
  fullScreen = false,
}) => {
  const containerClass = `loading-spinner-container ${fullScreen ? 'fullscreen' : ''}`;
  const spinnerClass = `spinner ${size}`;

  return (
    <div className={containerClass} role="status" aria-live="polite" aria-busy="true">
      <div className={spinnerClass} aria-hidden="true" />
      {message && <span className="spinner-message">{message}</span>}
      <span className="sr-only">{message}</span>
    </div>
  );
};

export default LoadingSpinner;
