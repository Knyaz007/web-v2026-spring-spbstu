import React, { useState, useEffect, memo  } from 'react';
import './ProductCard.css';
/**
 * Карточка товара с отображением информации и управлением корзиной
 * @param {Object} product - Данные товара
 * @param {function} onAddToCart - Добавление в корзину
 * @param {function} onUpdateQuantity - Обновление количества
 * @param {function} onRemoveFromCart - Удаление из корзины
 * @param {number} initialQuantity - Начальное количество в корзине
 * @param {function} onOpenModal - Открытие модального окна
 */
const ProductCard = memo(({ 
  product, 
  onAddToCart, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  initialQuantity = 0,
  onOpenModal
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isInCart, setIsInCart] = useState(initialQuantity > 0);
  const [imageError, setImageError] = useState(false);

  // Синхронизация с внешними изменениями корзины
  useEffect(() => {
    setQuantity(initialQuantity);
    setIsInCart(initialQuantity > 0);
  }, [initialQuantity]);

  // Функция для получения пути к изображению
  const getImagePath = () => {
    // Если есть готовый путь и он не вызвал ошибку
    if (product.image && !imageError) {
      return product.image;
    }    
   
    // Формируем путь по id
     return "/images/goods/image_" + product.id + ".png";
  };

  // Обработчик ошибки загрузки изображения
  const handleImageError = () => {
    setImageError(true);
  };

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

  const handleCardClick = (e) => {
    if (e.target.closest('.product-card__button-wrapper')) {
      return;
    }
    onOpenModal?.(product);
  };

  const renderRating = () => {
    const rating = product.rating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="product-card__rating">
        {[...Array(5)].map((_, index) => (
          <span 
            key={index} 
            className={`product-card__star ${index < fullStars ? 'product-card__star--filled' : ''} ${index === fullStars && hasHalfStar ? 'product-card__star--half' : ''}`}
          >
            {index < fullStars ? '★' : (index === fullStars && hasHalfStar ? '½' : '☆')}
          </span>
        ))}
        <span className="product-card__rating-value">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div 
      className={`product-card ${isInCart ? 'product-card--in-cart' : ''}`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="product-card__inner">
        <div className="product-card__content">
          {/* Фото товара */}
          <div className="product-card__image-container">
            <img 
              src={getImagePath()}
              alt={product.name} 
              className="product-card__image"
              onError={handleImageError}
            />
          </div>
          
          <div className="product-card__price">
            {product.price.toLocaleString()} ₽
          </div>
          
          <div className="product-card__title">
            {product.name}
          </div>
          
          {renderRating()}
          
          <div className="product-card__button-wrapper">
            {!isInCart ? (
              <button 
                onClick={handleAddToCart}
                className="product-card__button product-card__button--add"
              >
                <img 
                  src="/images/icons/card.svg" 
                  alt="cart" 
                  width="24" 
                  height="24" 
                  style={{ filter: 'brightness(0) invert(1)' }} 
                />
                <span>В корзину</span>
              </button>
            ) : (
              <div className="product-card__quantity-controls">
                <button 
                  onClick={handleDecrement}
                  className="product-card__quantity-btn product-card__quantity-btn--decr"
                >
                  −
                </button>
                <span className="product-card__quantity">{quantity}</span>
                <button 
                  onClick={handleIncrement}
                  className="product-card__quantity-btn product-card__quantity-btn--incr"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="product-card__badges">
        {product.isNew && (
          <div className="product-card__badge product-card__badge--new">
            <span>Новинка</span>
          </div>
        )}
        {product.isHit && (
          <div className="product-card__badge product-card__badge--hit">
            <span>Хит</span>
          </div>
        )}
      </div>
    </div>
  );
});

export default ProductCard;
// Почему: ProductCard перерисовывается каждый раз при изменении любого товара
// Мемоизация предотвращает лишние перерисовки