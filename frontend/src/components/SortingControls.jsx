// SortingControls.jsx - компонент сортировки
import React from 'react';
import '../styles/SortingControls.css';
/**
 * Компонент управления сортировкой товаров
 * @param {string} sortBy - Текущий тип сортировки
 * @param {function} onSortChange - Функция изменения сортировки
 */
const SortingControls = ({ sortBy, onSortChange }) => {
  return (
    <div className="sorting-container">
      <div className="catalog-title">Каталог товаров</div>
      <div className="sort-buttons">
        <button 
          className={`sort-btn ${sortBy === 'newest' ? 'active' : ''}`}
          onClick={() => onSortChange('newest')}
        >
          Новые
        </button>
        <button 
          className={`sort-btn ${sortBy === 'popularity' ? 'active' : ''}`}
          onClick={() => onSortChange('popularity')}
        >
          Популярные
        </button>
        <button 
          className={`sort-btn ${sortBy === 'price-asc' ? 'active' : ''}`}
          onClick={() => onSortChange('price-asc')}
        >
          Подешевле
        </button>
        <button 
          className={`sort-btn ${sortBy === 'price-desc' ? 'active' : ''}`}
          onClick={() => onSortChange('price-desc')}
        >
          Подороже
        </button>
      </div>
    </div>
  );
};

export default SortingControls;