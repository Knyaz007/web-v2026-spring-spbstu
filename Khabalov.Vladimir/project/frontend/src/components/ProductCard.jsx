import React, { useState, useEffect, memo } from 'react';
import '../styles/ProductCard.css';
/**
 * Карточка товара с отображением информации и управлением корзиной
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
  const [imageSrc, setImageSrc] = useState('');

  // Синхронизация с внешними изменениями корзины
  useEffect(() => {
    setQuantity(initialQuantity);
    setIsInCart(initialQuantity > 0);
  }, [initialQuantity]);

  // ✅ Функция для получения пути к изображению с сервера
  const getImagePath = () => {
    // Если в данных товара есть прямой путь к изображению
    if (product.image && !imageError) {
      // Если путь начинается с http, используем как есть
      if (product.image.startsWith('http')) {
        return product.image;
      }
      // Если относительный путь, добавляем baseURL сервера
      return `http://localhost:8080${product.image}`;
    }
    
    // Формируем путь по id (стандартный путь на сервере)
    return `http://localhost:8080/uploads/goods/image_${product.id}.png`;
  };

  // ✅ Эффект для обновления изображения при изменении product
  useEffect(() => {
    // Сбрасываем ошибку при смене товара
    setImageError(false);
    // Устанавливаем новый источник изображения
    setImageSrc(getImagePath());
  }, [product.id, product.image, imageError]);

  // Обработчик ошибки загрузки изображения
  const handleImageError = () => {
    console.error('Ошибка загрузки изображения:', imageSrc);
    setImageError(true);
    // Показываем заглушку
    setImageSrc('http://localhost:8080/uploads/goods/placeholder.png');
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
        {[...Array(1)].map((_, index) => (
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
          {/* Фото товара с сервера */}
          <div className="product-card__image-container">
            <img 
              src={imageSrc}
              alt={product.name} 
              className="product-card__image"
              onError={handleImageError}
              loading="lazy" // Ленивая загрузка для производительности
            />
          </div>
          
          <div className="product-card__price">
            {product.price.toLocaleString()} ₽
          </div>
          
          <div className="product-card__title">
            {product.name}
          </div>
          
          {renderRating()}
          
          <div className={`product-card__button-wrapper ${isInCart ? 'in-cart' : ''}`}>
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
              <div style={{ alignItems: 'center' }}>
              {/* <div className={`product-card__button-wrapper ${isInCart ? 'in-cart' : ''}`}> */}
              {/* <div className={`product-card__quantity-controls ${isInCart ? 'in-cart' : ''}`  }> */}
                <div className={`product-card__quantity-controls-in-cart`  }>
                {/* <div className="product-card__quantity-controls"> */}
                <img 
                  src="/images/icons/card.svg" 
                  alt="cart" 
                  width="24" 
                  height="24" 
                />
                <span>
                  <span className="product-card__quantity">{quantity}</span>шт.
                </span>
                 </div>
                 <div className='plusMinus'>
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