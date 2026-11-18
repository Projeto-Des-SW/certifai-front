import React from 'react';
import './styles.css';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
}) => {
  return (
    <div className="empty-state-card" role="region" aria-label={title}>
      {icon && <div className="empty-state-icon" aria-hidden="true">{icon}</div>}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {actionText && onAction && (
        <button
          type="button"
          className="empty-state-btn"
          onClick={onAction}
          aria-label={actionText}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

