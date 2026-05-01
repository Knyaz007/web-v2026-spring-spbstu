import { useState } from 'react';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!login.trim()) {
      setError('Пожалуйста, введите логин');
      return false;
    }
    
    if (!password.trim()) {
      setError('Пожалуйста, введите пароль');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await onLogin(login, password);
      if (!success) {
        setError('Неверный логин или пароль');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError('Ошибка соединения с сервером. Проверьте подключение.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="welcome-title">Добро пожаловать!</h1>
      
      <div className="login-form-wrapper">
        <form onSubmit={handleSubmit} noValidate>
          <div className="text-field">
            <label className="field-label">Логин</label>
            <div className="field-frame">
              <input
                type="text"
                name="username"
                placeholder="Введите логин"
                value={login}
                onChange={(e) => {
                  setLogin(e.target.value);
                  if (error) setError('');
                }}
                className="field-input"
                autoComplete="username"
                disabled={isLoading}
                required
              />
            </div>
         
          </div>

          <div className="text-field">
            <label className="field-label">Пароль</label>
            <div className="field-frame">
              <input
                type="password"
                name="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="field-input"
                autoComplete="current-password"
                disabled={isLoading}
                required
              />
            </div>
       
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            <span className="button-text">
              {isLoading ? 'Вход...' : 'Войти'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;