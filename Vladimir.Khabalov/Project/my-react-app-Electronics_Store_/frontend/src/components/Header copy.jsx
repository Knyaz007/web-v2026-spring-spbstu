import React from 'react'; // 👈 Добавьте эту строку
import { Link } from 'react-router-dom';
import './Header.css';

const Header = React.memo(({ isAuthenticated, user, onLogout, cartCount }) => {
  return (
    <header className="header">
      <div className="gadget-hub">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}> 
        Gadget Hub
         </Link>
        </div>
      
      <div className="button-catalog">
        <Link to="/catalog" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <div className="icon-catalog">
            <div className="rect-1197"></div>
            <div className="rect-1198"></div>
            <div className="rect-1199"></div>
            <div className="rect-1200"></div>
          </div>
          <span className="catalog-text">Каталог</span>
        </Link>
      </div>

      {/* Показываем кнопку "Войти" или "Выйти" в зависимости от авторизации */}
    {!isAuthenticated ? (
      <div className="button-login">
        <Link to="/login" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <div className="icon-profile">
            <img src="/images/icons/profile.svg" alt="Profile" width="24" height="24" />
          </div>
          <span className="login-text">Войти</span>
          <div className="icon-circle" style={{ display: 'none' }}></div>
        </Link>
      </div>
    ) : (   
           <div className="button-login">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <div className="icon-profile">
            <img src="/images/icons/profile.svg" alt="Profile" width="24" height="24" />
          </div>
          <span  onClick={onLogout} className="login-text">выйти</span>
          {/* <button onClick={onLogout} className="login-text">Выйти</button> */}
          <div className="icon-circle" style={{ display: 'none' }}></div>
        </Link>
      </div>

      
    )}
     

      {/* Показываем кнопку "Профиль" только если пользователь авторизован */}
      {isAuthenticated && (
        <div className="button-profile">
          <div className="icon-profile">
            <img src="/images/icons/profile.svg" alt="Profile" width="24" height="24" />
          </div>
          <span className="profile-text">{user?.name || 'Профиль'}</span>
          
          <div className="icon-circle" style={{ display: 'none' }}></div>
        </div>
      )}

      {/* Опционально: отображаем корзину */}
      {isAuthenticated && cartCount > 0 && (
        <Link to="/cart" className="cart-link">
          🛒 Корзина ({cartCount})
        </Link>
      )}
    </header>
  );
});

export default Header;