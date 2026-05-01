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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/me');
      setIsAuthenticated(res.data.authenticated);
      if (res.data.user) setUser(res.data.user);
    } catch (error) {
      console.error('Ошибка проверки авторизации', error);
    }
  };

  const login = async (login, password) => {
    const res = await axios.post('/api/login', { login, password });
    if (res.data.success) {
      setIsAuthenticated(true);
      setUser(res.data.user);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await axios.post('/api/logout');
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('cart');
    setCartCount(0); // Сбрасываем счетчик корзины
  };

  return (
    <BrowserRouter>
      <Header 
        isAuthenticated={isAuthenticated} 
        user={user} 
        onLogout={logout}
        cartCount={cartCount}  // 👈 передаем счетчик
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <LoginPage onLogin={login} />
        } />
        <Route path="/catalog" element={
          isAuthenticated ? <CatalogPage updateCartCount={setCartCount} /> : <Navigate to="/login" />
        } />
        <Route path="/cart" element={
          isAuthenticated ? <CartPage setCartCount={setCartCount} /> : <Navigate to="/login" />
        } />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;