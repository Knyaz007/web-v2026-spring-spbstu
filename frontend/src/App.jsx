import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

// Добавляем интерсептор для обработки ошибок авторизации
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Если получаем 401, можно очистить состояние авторизации
      console.log('Сессия истекла или пользователь не авторизован');
    }
    return Promise.reject(error);
  }
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true); // Добавляем состояние загрузки

useEffect(() => {
  const initializeApp = async () => {
    setLoading(true);
    
    // 1. Проверяем авторизацию
    await checkAuth();  // Дожидаемся проверки
    
    // 2. Загружаем корзину с учетом авторизации
    await loadCartFromStorage();
    
    setLoading(false);
  };
  
  initializeApp();
}, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/me');
      setIsAuthenticated(res.data.authenticated);
      if (res.data.user) setUser(res.data.user);
    } catch (error) {
      console.error('Ошибка проверки авторизации', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false); // Завершаем загрузку
    }
  };

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalCount);
      } catch (error) {
        console.error('Ошибка загрузки корзины', error);
      }
    }
  };

  const login = async (login, password) => {
    try {
      // Добавляем валидацию
      if (!login || !password) {
        return false;
      }

      const res = await axios.post('/api/login', { login, password });
      
      if (res.data.success) {
        setIsAuthenticated(true);
        setUser(res.data.user);
        
        // После успешного входа обновляем корзину с сервера
        await updateCartFromServer();
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Ошибка входа:', error);
      
      // Обрабатываем разные статусы ошибок
      if (error.response) {
        switch (error.response.status) {
          case 401:
            console.log('Неверный логин или пароль');
            break;
          case 404:
            console.log('Сервер не найден');
            break;
          default:
            console.log('Ошибка сервера');
        }
      }
      return false;
    }
  };

  const updateCartFromServer = async () => {
    try {
      const res = await axios.get('/api/cart');
      if (res.data && res.data.items) {
        const totalCount = res.data.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalCount);
        // Сохраняем в localStorage
        localStorage.setItem('cart', JSON.stringify(res.data.items));
      }
    } catch (error) {
      console.error('Ошибка загрузки корзины с сервера', error);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/logout');
    } catch (error) {
      console.error('Ошибка выхода', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      // Очищаем корзину при выходе
      localStorage.removeItem('cart');
      setCartCount(0);
    }
  };

  // Показываем загрузку, пока проверяем авторизацию
  if (loading) {
    return <div className="loading-screen">Загрузка...</div>;
  }

  return (
    <BrowserRouter>
      <Header 
        isAuthenticated={isAuthenticated} 
        user={user} 
        onLogout={logout}
        cartCount={cartCount}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/" /> : <LoginPage onLogin={login} />
          } 
        />
        <Route 
          path="/catalog" 
          element={
            isAuthenticated ? (
              <CatalogPage updateCartCount={setCartCount} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/cart" 
          element={
            isAuthenticated ? (
              <CartPage setCartCount={setCartCount} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;