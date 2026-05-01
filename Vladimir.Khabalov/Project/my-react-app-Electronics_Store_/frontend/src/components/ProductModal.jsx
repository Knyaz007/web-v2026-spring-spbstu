import React, { useState, useEffect } from 'react';
import './ProductModal.css';
/**
 * Модальное окно с детальной информацией о товаре
 * @param {Object} product - Данные товара
 * @param {boolean} isOpen - Состояние открытия модалки
 * @param {function} onClose - Закрытие модального окна
 * @param {function} onAddToCart - Добавление в корзину
 * @param {function} onUpdateQuantity - Обновление количества
 * @param {function} onRemoveFromCart - Удаление из корзины
 * @param {number} cartQuantity - Количество товара в корзине
 */

const ProductModal = ({ product, isOpen, onClose, onAddToCart, onUpdateQuantity, onRemoveFromCart, cartQuantity = 0 }) => {
  const [quantity, setQuantity] = useState(cartQuantity);
  const [isInCart, setIsInCart] = useState(cartQuantity > 0);

  // Синхронизация с внешними изменениями корзины
  useEffect(() => {
    setQuantity(cartQuantity);
    setIsInCart(cartQuantity > 0);
  }, [cartQuantity]);

  // Закрытие по Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Блокировка скролла body при открытом модальном окне
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onUpdateQuantity?.(product.id, newQuantity);
    } else if (quantity === 1) {
      setQuantity(0);
      setIsInCart(false);
      onRemoveFromCart?.(product.id);
    }
  };

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onUpdateQuantity?.(product.id, newQuantity);
    setIsInCart(true);
  };

  const handleAddToCart = () => {
    setQuantity(1);
    setIsInCart(true);
    onAddToCart({ ...product, quantity: 1 });
  };

  // Форматирование рейтинга
  const renderRating = () => {
    const rating = product?.rating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="product-modal__rating">
        {[...Array(5)].map((_, index) => (
          <span 
            key={index} 
            className={`product-modal__star ${index < fullStars ? 'product-modal__star--filled' : ''}`}
          >
            {index < fullStars ? '★' : (index === fullStars && hasHalfStar ? '½' : '☆')}
          </span>
        ))}
        <span className="product-modal__rating-value">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (!isOpen || !product) return null;

  return (
    <div className="product-modal__overlay" onClick={onClose}>
      <div className="product-modal__container" onClick={(e) => e.stopPropagation()}>
        {/* Кнопка закрытия */}
        <button className="product-modal__close" onClick={onClose}>
          ×
        </button>

        {/* Лейблы новинка/хит */}
        <div className="product-modal__badges">
          {product.isNew && (
            <div className="product-modal__badge product-modal__badge--new">
              Новинка
            </div>
          )}
          {product.isHit && (
            <div className="product-modal__badge product-modal__badge--hit">
              Хит
            </div>
          )}
        </div>

        <div className="product-modal__content">
          {/* Фото товара */}
          <div className="product-modal__image-container">
            <img 
              src={product.image || `/images/goods/placeholder.jpg`} 
              alt={product.name} 
              className="product-modal__image"
            />
          </div>

          {/* Информация о товаре */}
          <div className="product-modal__info">
            {/* Название */}
            <h2 className="product-modal__title">{product.name}</h2>

            {/* Рейтинг */}
            {renderRating()}

            {/* Цена */}
            <div className="product-modal__price">
              {product.price.toLocaleString()} ₽
            </div>

            {/* Описание */}
            {product.description && (
              <div className="product-modal__section">
                <h3 className="product-modal__section-title">Описание</h3>
                <p className="product-modal__description">{product.description}</p>
              </div>
            )}

            {/* Характеристики */}
            {(product.specs || product.type || product.color) && (
              <div className="product-modal__section">
                <h3 className="product-modal__section-title">Характеристики</h3>
                <table className="product-modal__specs">
                  <tbody>
                    {product.type && (
                      <tr>
                        <td className="product-modal__specs-key">Тип</td>
                        <td className="product-modal__specs-value">{product.type}</td>
                      </tr>
                    )}
                    {product.color && (
                      <tr>
                        <td className="product-modal__specs-key">Цвет</td>
                        <td className="product-modal__specs-value">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              backgroundColor: product.color,
                              border: '1px solid #ddd'
                            }}></span>
                            {product.color}
                          </span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Кнопка корзины или контролы количества */}
            <div className="product-modal__cart-section">
              {!isInCart ? (
                <button 
                  onClick={handleAddToCart}
                  className="product-modal__button product-modal__button--add"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7H4C3.44772 7 3 7.44772 3 8V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V8C21 7.44772 20.5523 7 20 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 11V17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M9 14H15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>В корзину</span>
                </button>
              ) : (
                <div className="product-modal__quantity-controls">
                  <button 
                    onClick={handleDecrement}
                    className="product-modal__quantity-btn product-modal__quantity-btn--decr"
                  >
                    −
                  </button>
                  <span className="product-modal__quantity">{quantity}</span>
                  <button 
                    onClick={handleIncrement}
                    className="product-modal__quantity-btn product-modal__quantity-btn--incr"
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            {/* Индикатор, что товар уже в корзине */}
            {isInCart && (
              <div className="product-modal__cart-status">
                Товар в корзине: {quantity} шт.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;