import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, message }) => (
  <div className="emptyState">
    {icon || (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7m16 0v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5m16 0h-2.586a1 1 0 0 0-.707.293l-2.414 2.414a1 1 0 0 1-.707.293h-3.172a1 1 0 0 1-.707-.293l-2.414-2.414A1 1 0 0 0 6.586 13H4" />
      </svg>
    )}
    <p>{message}</p>
  </div>
);
