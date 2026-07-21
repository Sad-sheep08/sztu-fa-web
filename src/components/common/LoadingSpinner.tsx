import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = '加载中...' }) => (
  <div className="loadingContainer">
    <div className="loadingSpinner" />
    <p>{message}</p>
  </div>
);
