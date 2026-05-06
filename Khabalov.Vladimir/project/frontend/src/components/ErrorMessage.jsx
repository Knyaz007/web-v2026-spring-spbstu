// ErrorMessage.jsx - компонент ошибки
import React from 'react';
/**
 * Компонент ошибки с кнопкой повторной попытки
 * @param {string} message - Текст ошибки
 * @param {function} onRetry - Функция повторной попытки
 */
const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="catalog-error">
      <div className="error-container">
        <p>{message}</p>
        <button onClick={onRetry} className="retry-button">
          Попробовать снова
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;