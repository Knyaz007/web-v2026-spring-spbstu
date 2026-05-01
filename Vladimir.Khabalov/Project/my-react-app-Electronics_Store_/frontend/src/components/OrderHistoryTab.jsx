import React from 'react';
import './OrderHistoryTab.css'; // История заказов

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

  return (
    <div className="order-history-tab">
      <h3 className="history-title">История заказов</h3>
      
      <div className="orders-table-wrapper">
        <div className="orders-table">
          <div className="orders-header">
            <div className="col-order-number">№ заказа</div>
            <div className="col-date">Дата оформления</div>
            <div className="col-products">Товары</div>
            <div className="col-quantity">Кол-во</div>
            <div className="col-total">Сумма</div>
          </div>
          
          <div className="orders-list">
            {orders.map((order) => {
              const totalQuantity = calculateTotalQuantity(order.items);
              const totalPrice = calculateTotalPrice(order.items);
              const productNames = getProductNames(order.items);
              
              return (
                <div key={order.id} className="order-row">
                  <div className="col-order-number">{order.id}</div>
                  <div className="col-date">
                    {new Date(order.date).toLocaleDateString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="col-products">
                    <span className="product-text" title={productNames}>
                      {productNames}
                    </span>
                  </div>
                  <div className="col-quantity">{totalQuantity}</div>
                  <div className="col-total">
                    {totalPrice.toLocaleString()} ₽
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryTab;