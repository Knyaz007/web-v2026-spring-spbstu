import React, { useState, useEffect } from 'react';

const CartItem = ({ item, isSelected, onSelect, onUpdateQuantity, onRemove }) => {
  const totalPrice = item.price * item.quantity;
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  // ✅ Функция для получения пути к изображению с сервера
  const getImageUrl = () => {
    if (!item) return '';
    
    // Если есть прямой путь к изображению
    if (item.image && !imageError) {
      // Если путь начинается с http, используем как есть
      if (item.image.startsWith('http')) {
        return item.image;
      }
      // Если относительный путь, добавляем baseURL сервера
      return `http://localhost:8080${item.image}`;
    }
    
    // Формируем путь по id (стандартный путь на сервере)
    return `http://localhost:8080/uploads/goods/image_${item.id}.png`;
  };

  // ✅ Эффект для обновления изображения при изменении товара
  useEffect(() => {
    if (item) {
      setImageError(false);
      setImageSrc(getImageUrl());
    }
  }, [item, item?.id, item?.image]);

  // Обработчик ошибки загрузки изображения
  const handleImageError = () => {
    console.error('Ошибка загрузки изображения:', imageSrc);
    setImageError(true);
    // Показываем заглушку
    setImageSrc('http://localhost:8080/uploads/goods/placeholder.png');
  };

  return (
    <div className="cart-item">
      <div className="cart-item-checkbox">
        <input 
          type="checkbox" 
          checked={isSelected} 
          onChange={onSelect}
          aria-label="Выбрать товар"
        />
      </div>
      
      <div className="cart-item-image">
        <img 
          src={imageSrc}
          alt={item.name} 
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      
      <div className="cart-item-info">
        <h3 className="cart-item-name">{item.name}</h3>
        <div className="cart-item-price">{item.price.toLocaleString()} ₽</div>
      </div>
      
      <div className="cart-item-quantity">
        <button 
          className="quantity-btn"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          aria-label="Уменьшить количество"
        >
          -
        </button>
        <span className="quantity-value">{item.quantity}</span>
        <button 
          className="quantity-btn"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          aria-label="Увеличить количество"
        >
          +
        </button>
      </div>
      
      <div className="cart-item-total">
        {totalPrice.toLocaleString()} ₽
      </div>
      
      <button 
        className="cart-item-remove" 
        onClick={onRemove}
        aria-label="Удалить товар"
      >
        ✕
      </button>
    </div>
  );
};

export default CartItem;