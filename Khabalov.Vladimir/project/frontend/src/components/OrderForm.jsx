import React, { useState } from 'react';
import axios from 'axios';

const OrderForm = ({ cartItems, totalPrice, onOrderSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    deliveryType: 'pickup',
    address: '',
    payment: 'card',
    needPackaging: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone.trim()) {
      newErrors.phone = 'Обязательное поле';
    } else if (!/^[\d\s\+\(\)-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Введите корректный номер телефона';
    }

    if (formData.deliveryType === 'delivery' && !formData.address.trim()) {
      newErrors.address = 'Адрес обязателен для доставки';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 👇 Формируем данные в том формате, который ожидает бекенд
      const orderData = {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: totalPrice,  // 👈 ВАЖНО: total, а не totalPrice
        formData: {         // 👈 ВАЖНО: все данные формы внутри formData
          email: formData.email,
          phone: formData.phone,
          deliveryType: formData.deliveryType,
          address: formData.address,
          payment: formData.payment,
          needPackaging: formData.needPackaging
        }
      };

      console.log('Отправляем заказ:', orderData); // Для отладки

      const response = await axios.post('http://localhost:8080/api/orders', orderData, {
        withCredentials: true
      });
      
      if (response.status === 200 || response.status === 201) {
        onOrderSuccess();
      }
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      if (error.response?.status === 401) {
        alert('Сессия истекла. Пожалуйста, войдите снова.');
        window.location.href = '/login';
      } else {
        alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте снова.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-form-container">
      
      <h3 className="order-form-title">Оформление заказа</h3>
      
      <form onSubmit={handleSubmit} className="order-form">
        <div style={{ display: 'flex' }}> 
        <div className="form-group">
          <label htmlFor="email">Почта</label>
          <input style={{background: '#E4E7EB'}}
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="example@mail.com"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group required">
          <label htmlFor="phone">Номер телефона *</label>
          <input style={{background: '#E4E7EB'}}
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+7 (999) 123-45-67"
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>
</div>
        <div className="form-group">
          <label>Способ получения</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="deliveryType"
                value="pickup"
                checked={formData.deliveryType === 'pickup'}
                onChange={() => handleChange('deliveryType', 'pickup')}
              />
              Самовывоз
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="deliveryType"
                value="delivery"
                checked={formData.deliveryType === 'delivery'}
                onChange={() => handleChange('deliveryType', 'delivery')}
              />
              Доставка
            </label>
          </div>
        </div>

        {formData.deliveryType === 'delivery' && (
          <div className="form-group required">
            <label htmlFor="address">Адрес *</label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="г. Москва, ул. Примерная, д. 1"
              className={errors.address ? 'error' : ''}
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="payment">Оплата</label>
          <select style={{background: '#E4E7EB'}}
            id="payment"
            value={formData.payment}
            onChange={(e) => handleChange('payment', e.target.value)}
          >
            <option value="card">По карте</option>
            <option value="cash">Наличными</option>
          </select>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.needPackaging}
              onChange={(e) => handleChange('needPackaging', e.target.checked)}
            />
            Нужна ли упаковка
          </label>
        </div>

        <button 
          type="submit" 
          className="submit-order-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;