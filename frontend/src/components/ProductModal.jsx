import React, { useState, useEffect } from 'react';
import '../styles/ProductModal.css';
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

const ProductModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  cartQuantity = 0 
}) => {
  const [quantity, setQuantity] = useState(cartQuantity);
  const [isInCart, setIsInCart] = useState(cartQuantity > 0);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  // Синхронизация с внешними изменениями корзины
  useEffect(() => {
    setQuantity(cartQuantity);
    setIsInCart(cartQuantity > 0);
  }, [cartQuantity]);

  // ✅ Функция для получения пути к изображению с сервера
  const getImageUrl = () => {
    if (!product) return '';
    
    // Если есть прямой путь к изображению
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

  // ✅ Эффект для обновления изображения при изменении продукта
  useEffect(() => {
    if (product) {
      setImageError(false);
      setImageSrc(getImageUrl());
    }
  }, [product, product?.id, product?.image]);

  // Обработчик ошибки загрузки изображения
  const handleImageError = () => {
    console.error('Ошибка загрузки изображения:', imageSrc);
    setImageError(true);
    // Показываем заглушку
    setImageSrc('http://localhost:8080/uploads/goods/placeholder.png');
  };

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

  // Форматирование рейтинга - ИСПРАВЛЕНО (было [...Array(1)], нужно 5)
  const renderRating = () => {
    const rating = product?.rating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="product-modal__rating">
        {[...Array(1)].map((_, index) => (  // ✅ ИСПРАВЛЕНО: 5 звезд
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

  // Функция для получения цвета в русском названии
  const getColorName = (color) => {
    const colors = {
      'черный': '#000000',
      'белый': '#FFFFFF',
      'серый': '#808080',
      'красный': '#FF0000',
      'синий': '#0000FF',
      'зеленый': '#008000',
      'желтый': '#FFFF00',
      'розовый': '#FFC0CB',
      'фиолетовый': '#800080',
      'оранжевый': '#FFA500',
      'голубой': '#87CEEB',
      'бежевый': '#F5F5DC',
      'золотой': '#FFD700',
      'серебряный': '#C0C0C0'
    };
    return colors[color?.toLowerCase()] || '#CCCCCC';
  };

  // ✅ Список всех характеристик для отображения
  const renderSpecifications = () => {
    const specs = [];
    
    // Тип товара
    if (product.type) {
      specs.push({ key: 'Тип', value: product.type });
    }
    
    // Цвет
    if (product.color) {
      specs.push({ 
        key: 'Цвет', 
        value: (
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: getColorName(product.color),
              border: '1px solid #ddd',
              display: 'inline-block'
            }}></span>
            {product.color}
          </span>
        )
      });
    }
    
    // Если есть дополнительные характеристики
    // Можно добавить другие поля по мере необходимости
    
    if (specs.length === 0) return null;
    
    return (
      <div className="product-modal__section">
        <h3 className="product-modal__section-title">Характеристики</h3>
        <div className="product-modal__specs-list">
          {specs.map((spec, index) => (
            <div className="product-modal__spec-item" style={{ display: 'flex' }} key={index}>
              <span className="product-modal__spec-key"> {spec.key}:</span>
              <span className="product-modal__spec-value"> {spec.value}</span>
            </div>
          ))}
        </div>
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
          {/* Фото товара с сервера */}
          <div className="product-modal__image-container">
            <img 
              src={imageSrc}
              alt={product.name} 
              className="product-modal__image"
              onError={handleImageError}
              loading="lazy"
            />
          </div>

          {/* Информация о товаре */}
          <div className="product-modal__info">
            {/* Название */}
            <h2 className="product-modal__title">{product.name}</h2>

            {/* Рейтинг */}
            {renderRating()}

            {/* Цена */}
            
            {/* Описание */}
            {product.description && (
              <div className="product-modal__section">
                <h3 className="product-modal__section-title">Описание</h3>
                <p className="product-modal__description">{product.description}</p>
              </div>
            )}

            {/* Характеристики - каждая отдельно */}
            {renderSpecifications()}
    <div className="product-modal__price">
              {product.price.toLocaleString()} ₽
            </div>

            {/* Кнопка корзины или контролы количества */}
            <div className="product-modal__cart-section">
              {!isInCart ? (
                <button 
                  onClick={handleAddToCart}
                  className="product-modal__button product-modal__button--add"
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
                 
                <div style={{ alignItems: 'center',  display: 'flex', gap: '16px',  flexDirection: 'row-reverse'}}>
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
      </div>
    </div>
  );
};

export default ProductModal;