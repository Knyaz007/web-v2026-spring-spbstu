import React from 'react';

const CartItem = ({ item, isSelected, onSelect, onUpdateQuantity, onRemove }) => {
  const totalPrice = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-checkbox">
        <input type="checkbox" checked={isSelected} onChange={onSelect} />
      </div>
      
      <div className="cart-item-image">
        <img src={item.image || '/images/placeholder.png'} alt={item.name} />
      </div>
      
      <div className="cart-item-info">
        <h3 className="cart-item-name">{item.name}</h3>
        <div className="cart-item-price">{item.price.toLocaleString()} ₽</div>
      </div>
      
      <div className="cart-item-quantity">
        <button 
          className="quantity-btn"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
        >
          -
        </button>
        <span className="quantity-value">{item.quantity}</span>
        <button 
          className="quantity-btn"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          +
        </button>
      </div>
      
      <div className="cart-item-total">
        {totalPrice.toLocaleString()} ₽
      </div>
      
      <button className="cart-item-remove" onClick={onRemove}>
        ✕
      </button>
    </div>
  );
};

export default CartItem;