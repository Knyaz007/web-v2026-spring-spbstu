// ProductGrid.jsx - компонент сетки товаров
import React,  { memo }  from 'react';
import ProductCard from './ProductCard';
/**
 * Компонент сетки товаров
 * @param {Array} products - Массив товаров для отображения
 * @param {function} onAddToCart - Добавление товара в корзину
 * @param {function} onUpdateQuantity - Обновление количества товара
 * @param {function} onRemoveFromCart - Удаление товара из корзины
 * @param {function} getProductQuantity - Получение количества товара в корзине
 * @param {function} onOpenModal - Открытие модального окна с деталями
 */
const ProductGrid =  memo(({ 
  products, 
  onAddToCart, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  getProductQuantity,
  onOpenModal 
}) => {
  if (products.length === 0) {
    return (
      <div className="catalog-empty">
        <p className="empty-message">
          Товары по вашему запросу не найдены
        </p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={onAddToCart}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveFromCart={onRemoveFromCart}
          initialQuantity={getProductQuantity(product.id)}
          onOpenModal={onOpenModal}
        />
      ))}
    </div>
  );
});
// ❌ Без memo: кнопка меняет count → перерисовка Catalog → 
//    перерисовка ProductGrid → перерисовка всех 100 ProductCard → 
//    лаги и тормоза

// ✅ С memo: кнопка меняет count → перерисовка Catalog → 
//    ProductGrid НЕ перерисовывается (products не изменились)

export default ProductGrid;