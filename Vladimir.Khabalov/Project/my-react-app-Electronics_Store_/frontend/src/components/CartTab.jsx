import React, { useState } from 'react';
import CartItem from './CartItem';
import OrderForm from './OrderForm';
import ConfirmModal from './ConfirmModal';
import { Link } from 'react-router-dom';

const CartTab = ({ cartItems, updateCart, clearCart }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [removeSelectedMode, setRemoveSelectedMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Обновление количества товара
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const newCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    updateCart(newCart);
  };

  // Удаление одного товара
  const handleRemoveItem = (id) => {
    setItemToRemove(id);
    setRemoveSelectedMode(false);
    setShowConfirmModal(true);
  };

  const confirmRemove = () => {
    if (removeSelectedMode) {
      const newCart = cartItems.filter(item => !selectedItems.includes(item.id));
      updateCart(newCart);
      setSelectedItems([]);
    } else if (itemToRemove) {
      const newCart = cartItems.filter(item => item.id !== itemToRemove);
      updateCart(newCart);
      setItemToRemove(null);
    }
    setShowConfirmModal(false);
  };

  // Удаление выбранных товаров
  const handleRemoveSelected = () => {
    if (selectedItems.length === 0) return;
    setRemoveSelectedMode(true);
    setShowConfirmModal(true);
  };

  // Выбор/отмена выбора товара
  const toggleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };

  // Подсчет общей стоимости
  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Успешное оформление заказа
  const handleOrderSuccess = () => {
    setOrderSuccess(true);
    clearCart();
    setTimeout(() => {
      setOrderSuccess(false);
    }, 3000);
  };

  // Пустая корзина
  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <p className="empty-cart-text">
          Ознакомьтесь с новинками и хитами на главной или найдите нужное в каталоге
        </p>
        <Link to="/catalog" className="empty-cart-link">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  // Успешное оформление
  if (orderSuccess) {
    return (
      <div className="order-success">
        <div className="success-icon">✓</div>
        <h2>Спасибо, ваш заказ успешно оформлен</h2>
        <p>Номер вашего заказа: #{Math.floor(Math.random() * 100000)}</p>
        <Link to="/catalog" className="continue-shopping-btn">
          Продолжить покупки
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-tab">
      {/* Шапка корзины с чекбоксами */}
      <div className="cart-header">
        <label className="select-all">
          <input 
            type="checkbox" 
            checked={selectedItems.length === cartItems.length && cartItems.length > 0}
            onChange={toggleSelectAll}
          />
          Выбрать все
        </label>
        {selectedItems.length > 0 && (
          <button className="remove-selected-btn" onClick={handleRemoveSelected}>
            Удалить выбранные ({selectedItems.length})
          </button>
        )}
      </div>

      {/* Список товаров */}
      <div className="cart-items-list">
        {cartItems.map(item => (
          <CartItem
            key={item.id}
            item={item}
            isSelected={selectedItems.includes(item.id)}
            onSelect={() => toggleSelectItem(item.id)}
            onUpdateQuantity={updateQuantity}
            onRemove={() => handleRemoveItem(item.id)}
          />
        ))}
      </div>

      {/* Итого */}
      <div className="cart-summary">
        <div className="total-price">
          <span>Общая стоимость:</span>
          <strong>{getTotalPrice().toLocaleString()} ₽</strong>
        </div>
      </div>

      {/* Форма оформления заказа */}
      <OrderForm 
        cartItems={cartItems}
        totalPrice={getTotalPrice()}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Модальное окно подтверждения */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmRemove}
        title="Подтверждение удаления"
        message="Вы уверены, что хотите удалить?"
      />
    </div>
  );
};

export default CartTab;