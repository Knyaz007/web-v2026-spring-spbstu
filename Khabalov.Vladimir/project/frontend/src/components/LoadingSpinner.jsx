// LoadingSpinner.jsx - компонент загрузки
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="catalog-loading">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Загрузка товаров...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;