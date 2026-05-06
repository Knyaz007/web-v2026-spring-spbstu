import React from 'react';
import '../styles/OrderHistoryTab.css';
const OrderHistoryTab = ({ orders, loading }) => {
  if (loading) {
    return (
      <div className="empty-history">
        <div className="loading-spinner"></div>
        <p>Загрузка истории заказов...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="empty-history">
        <div className="empty-history-icon">📋</div>
        <p>У вас пока нет заказов</p>
        <p className="empty-history-subtext">
          Перейдите в каталог, чтобы сделать первый заказ
        </p>
      </div>
    );
  }

  const getProductNames = (items) => {
    if (!items || items.length === 0) return '';
    if (items.length === 1) return items[0].name;
    return `${items[0].name} и еще ${items.length - 1} товар(а)`;
  };

  const calculateTotalPrice = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTotalQuantity = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Форматирование даты в нужный формат
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  };

  return (
    <div className="order-history-tab">
      <div className="orders-list-container">
        {orders.map((order) => {
          const totalQuantity = calculateTotalQuantity(order.items);
          const totalPrice = calculateTotalPrice(order.items);
          const productNames = getProductNames(order.items);
          const orderNumber = order.id;
          const orderDate = formatDate(order.date);
          
          return (
            <div key={order.id} className="order-item-wrapper">
              <div className="order-card">
                <div className="order-header-line"></div>
                
                <div className="order-info">
                  <div className="order-number-date">
                    № {orderNumber} от {orderDate}
                  </div>
                  <div className="order-details">
                  <div className="order-products-count">
                    {totalQuantity} {getQuantityText(totalQuantity)}
                  </div>
                 
                </div>
                  <div className="order-total-price">
                    {totalPrice.toLocaleString()} ₽
                  </div>
                </div>
                
                
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Функция для правильного склонения слова "товар"
const getQuantityText = (count) => {
  if (count % 10 === 1 && count % 100 !== 11) return 'товар';
  if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'товара';
  return 'товаров';
};

export default OrderHistoryTab;