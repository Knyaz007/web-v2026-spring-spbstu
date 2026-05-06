// npm install express express-session cors
// node server.js
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();

// ✅ РАЗДАЧА СТАТИЧЕСКИХ ФАЙЛОВ
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'gadget-hub-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Пути к файлам
const dataPath = path.join(__dirname, 'data');
const usersFile = path.join(dataPath, 'users.json');
const goodsFile = path.join(dataPath, 'goods.json');
const ordersFile = path.join(dataPath, 'orders.json');

// ✅ Функция для проверки и создания папки uploads
async function initUploadsFolder() {
  const uploadsPath = path.join(__dirname, 'uploads', 'goods');
  try {
    await fs.mkdir(uploadsPath, { recursive: true });
    console.log('✅ Папка создана:', uploadsPath);
    
    // Проверяем, есть ли файлы в папке
    const files = await fs.readdir(uploadsPath);
    console.log(`📁 В папке ${files.length} файлов:`, files);
    
    if (files.length === 0) {
      console.log('⚠️ ВНИМАНИЕ: Папка uploads/goods пуста! Добавьте изображения.');
    }
  } catch (error) {
    console.error('❌ Ошибка создания папки:', error);
  }
}

// 📥 GET ЭНДПОИНТ ДЛЯ ПОЛУЧЕНИЯ ИЗОБРАЖЕНИЯ
app.get('/api/goods/image/:id', async (req, res) => {
  const imageId = req.params.id;
  const imagePath = path.join(__dirname, 'uploads', 'goods', `image_${imageId}.png`);
  
  try {
    await fs.access(imagePath);
    res.sendFile(imagePath);
  } catch (error) {
    console.log(`❌ Изображение не найдено: ${imagePath}`);
    res.status(404).json({ error: 'Изображение не найдено' });
  }
});

// Маршрут для получения товаров с правильными путями
app.get('/api/goods', async (req, res) => {
  const goods = JSON.parse(await fs.readFile(goodsFile));
  
  // Добавляем правильные пути к изображениям
  const goodsWithImages = goods.map(item => ({
    ...item,
    // Формируем правильный путь к изображению на сервере
    image: `/uploads/goods/image_${item.id}.png`
  }));
  
  res.json(goodsWithImages);
});

// Инициализация файлов с данными
async function initDataFiles() {
  await fs.mkdir(dataPath, { recursive: true });
  await initUploadsFolder(); // СОЗДАНИЕ ПАПКИ
  
  // Проверяем и создаем users.json
  try {
    await fs.access(usersFile);
    console.log('✅ users.json уже существует');
  } catch (error) {
    console.log('📝 Создаем users.json');
    await fs.writeFile(usersFile, JSON.stringify([
      { id: 1, login: 'user@example.com', password: '12345', name: 'Тестовый пользователь' },
      { id: 2, login: 'admin', password: 'admin123', name: 'Администратор' }
    ], null, 2));
  }
  
 
  try {
    await fs.access(goodsFile);
    console.log('✅ goods.json уже существует');
  } catch (error) {
    console.log('📝 Создаем goods.json');
    await fs.writeFile(goodsFile, JSON.stringify([
      { id: 1, name: 'iPhone 15 Pro', price: 99990, type: 'смартфон', color: 'черный', rating: 4.8, isNew: true, isHit: true, description: 'Флагманский смартфон Apple' },
      { id: 2, name: 'AirPods Pro 2', price: 24990, type: 'наушники', color: 'белый', rating: 4.7, isNew: true, isHit: false, description: 'Беспроводные наушники' },
      { id: 3, name: 'Samsung Galaxy Watch 6', price: 29990, type: 'часы', color: 'черный', rating: 4.6, isNew: false, isHit: true, description: 'Умные часы Samsung' },
      { id: 4, name: 'MacBook Pro 14', price: 199990, type: 'ноутбук', color: 'серый', rating: 4.9, isNew: true, isHit: true, description: 'Мощный ноутбук для работы' }
    ], null, 2));
  }
  
  // Проверяем и создаем orders.json
  try {
    await fs.access(ordersFile);
    console.log('✅ orders.json уже существует');
  } catch (error) {
    console.log('📝 Создаем orders.json');
    await fs.writeFile(ordersFile, JSON.stringify([], null, 2));
  }
  
  console.log('✅ Все файлы данных готовы');
}

// Маршруты
app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  const users = JSON.parse(await fs.readFile(usersFile));
  const user = users.find(u => u.login === login && u.password === password);
  
  if (user) {
    req.session.userId = user.id;
    req.session.userLogin = user.login;
    res.json({ success: true, user: { login: user.login } });
  } else {
    res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get('/api/me', (req, res) => {
  if (req.session.userId) {
    res.json({ authenticated: true, user: { login: req.session.userLogin } });
  } else {
    res.json({ authenticated: false });
  }
});

app.get('/api/orders', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Не авторизован' });
  }
  const orders = JSON.parse(await fs.readFile(ordersFile));
  const userOrders = orders.filter(o => o.userId === req.session.userId);
  res.json(userOrders);
});

app.post('/api/orders', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Не авторизован' });
  }
  
  const { items, total, formData } = req.body;
  const orders = JSON.parse(await fs.readFile(ordersFile));
  
  const newOrder = {
    id: orders.length + 1,
    userId: req.session.userId,
    date: new Date().toISOString(),
    items: items,
    total: total,
    customerInfo: formData
  };
  
  orders.push(newOrder);
  await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2));
  
  res.json({ success: true, orderId: newOrder.id });
});

// Запуск
initDataFiles().then(() => {
  app.listen(8080, () => {
    console.log('✅ Бекенд запущен на http://localhost:8080');
    console.log('✅ Статика доступна по http://localhost:8080/uploads/goods/');
  });
});