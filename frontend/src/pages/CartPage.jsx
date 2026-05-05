//  CartPage.jsx (для истории заказов)
import React, { useState, useEffect } from 'react';
import CartTab from '../components/CartTab';
import OrderHistoryTab from '../components/OrderHistoryTab';
import '../styles/CartPage.css';

const CartPage = ({ setCartCount }) => {
  const [activeTab, setActiveTab] = useState('cart');
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Загрузка корзины из localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Загрузка истории заказов с бекенда
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.status === 401) {
        console.log('Не авторизован');
        setOrders([]);
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        console.log('Загружены заказы:', data); // Для отладки
        setOrders(data);
      } else {
        console.error('Ошибка загрузки заказов:', response.status);
        setOrders([]);
      }
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем историю при монтировании и при переключении на вкладку истории
  useEffect(() => {
    if (activeTab === 'history') {
      fetchOrders();
    }
  }, [activeTab]);

  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    const totalCount = newCart.reduce((sum, item) => sum + item.quantity, 0);
    if (setCartCount) setCartCount(totalCount);
  };

  const clearCart = () => {
    updateCart([]);
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-tabs">
          <button 
            className={`tab-btn ${activeTab === 'cart' ? 'active' : ''}`}
            onClick={() => setActiveTab('cart')}
          >
            Корзина
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            История заказов
          </button>
        </div>
</div>
        {activeTab === 'cart' ? (
          <CartTab 
            cartItems={cartItems}
            updateCart={updateCart}
            clearCart={clearCart}
          />
       
        ) : (
          
          <OrderHistoryTab orders={orders} loading={loading} />
        )}
      
    </div>
  );
};

export default CartPage;