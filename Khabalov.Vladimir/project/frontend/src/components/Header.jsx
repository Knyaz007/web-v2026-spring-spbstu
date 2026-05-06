import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';
const Header = React.memo(({ isAuthenticated, user, onLogout, cartCount }) => {
  const location = useLocation(); // Получаем текущий URL
  const isCatalogActive = location.pathname === '/catalog';
  const isCartActive = location.pathname === '/cart';
  const isLoginActive = location.pathname === '/login';
  
  return (
    <header className="header">
      <div className="gadget-hub">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}> 
          Gadget Hub
        </Link>
      </div>
      
      <div className={`button-catalog ${isCatalogActive ? 'active' : ''}`}>
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

      {/* Корзина - после каталога, перед входом/выходом */}
      {isAuthenticated && (
         <div className={`button-cart ${isCartActive ? 'active' : ''}`}>
          <Link to="/cart" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <div className="icon-cart">
              <img src="/images/icons/profile.svg" alt="Profile" width="24" height="24" />
            </div>
            <span className="cart-text">Корзина</span>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>
        </div>
      )}

      {/* Показываем кнопку "Войти" или "Выйти" в зависимости от авторизации */}
      {!isAuthenticated ? (
       
        <div className={`button-login ${isLoginActive ? 'active' : ''}`}> 
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
          <div style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={onLogout}>
            <div className="icon-profile">
              <img src="/images/icons/profile.svg" alt="Profile" width="24" height="24" />
            </div>
            <span className="login-text">Выйти</span>
            <div className="icon-circle" style={{ display: 'none' }}></div>
          </div>
        </div>
      )}
     
      {/* Показываем кнопку "Профиль" только если пользователь авторизован */}
      {/* {isAuthenticated && (
        <div className="button-profile">
          <div className="icon-profile">
            <img src="/images/icons/profile.svg" alt="Profile" width="24" height="24" />
          </div>
          <span className="profile-text">{user?.name || 'Профиль'}</span>
          <div className="icon-circle" style={{ display: 'none' }}></div>
        </div>
      )} */}
    </header>
  );
});

export default Header;