import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ProductModal from '../components/ProductModal';
import FiltersSidebar from '../components/FiltersSidebar';
import SortingControls from '../components/SortingControls';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import axios from 'axios';
import '../styles/CatalogPage.css';

const CatalogPage = ({ updateCartCount }) => {  //  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [cartItems, setCartItems] = useState([]);
  
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  
  const [sortBy, setSortBy] = useState('newest');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Загрузка корзины из localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartItems(cart);
      // Обновляем счетчик в Header
      if (updateCartCount) {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        updateCartCount(totalCount);
      }
    }
  }, [updateCartCount]);

  // Сохранение корзины в localStorage и обновление счетчика
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    // Обновляем счетчик в Header
    if (updateCartCount) {
      const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      updateCartCount(totalCount);
    }
  }, [cartItems, updateCartCount]);

  
  // Загрузка товаров с backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/goods');
        setProducts(response.data);
        
        const types = [...new Set(response.data.map(p => p.type).filter(Boolean))];
        setAvailableTypes(types);
        setSelectedTypes(types);
        
        const colors = [...new Set(response.data.map(p => p.color).filter(Boolean))];
        setAvailableColors(colors);
        setSelectedColors(colors);
        
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке товаров:', err);
        setError('Не удалось загрузить товары. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Применение фильтров при изменении зависимостей
  useEffect(() => {
    if (products.length > 0) {
      applyFiltersAndSorting();
    }
  }, [products, priceMin, priceMax, selectedTypes, selectedColors, sortBy]);

  // ✅ applyFiltersAndSorting тоже оборачиваем в useCallback
  // Добавляем все зависимости, которые используются внутри
  const applyFiltersAndSorting = useCallback(() => {
    let result = [...products];
    
    if (priceMin !== '') {
      result = result.filter(p => p.price >= Number(priceMin));
    }
    if (priceMax !== '') {
      result = result.filter(p => p.price <= Number(priceMax));
    }
    
    if (selectedTypes.length > 0) {
      result = result.filter(p => selectedTypes.includes(p.type));
    }
    
    if (selectedColors.length > 0) {
      result = result.filter(p => selectedColors.includes(p.color));
    }
    
    switch(sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        result.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return b.id - a.id;
        });
    }
    
    setFilteredProducts(result);
    setCurrentPage(1);
  }, [products, priceMin, priceMax, selectedTypes, selectedColors, sortBy]); // ✅ Все зависимости явно указаны

    const handleReset = useCallback(() => {
  setPriceMin('');
  setPriceMax('');
  setSelectedTypes([...availableTypes]);  // ← ВСЕ типы
  setSelectedColors([...availableColors]); // ← ВСЕ цвета
  setSortBy('newest');
  
  // setTimeout НЕ НУЖЕН! useEffect сам применит фильтры
}, [availableTypes, availableColors]); // applyFiltersAndSorting будет определена ниже и тоже должна быть useCallback
 // ✅ useCallback для функций, которые передаются в дочерние компоненты
  // Это предотвращает лишние ререндеры дочерних компонентов (ProductGrid, ProductModal и др.)

  const handleAddToCart = useCallback((product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []); // ✅ Зависимостей нет - функция стабильна между рендерами

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const getProductQuantity = useCallback((productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item?.quantity || 0;
  }, [cartItems]); // ⚠️ ЗАВИСИТ от cartItems! Без этого будет старое значение

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };


   // ✅ useMemo для вычисляемых значений (пагинация)
  // Это предотвращает перерасчет на каждом рендере
  const paginationData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
    return { currentItems, totalPages };
  }, [currentPage, itemsPerPage, filteredProducts]);
  
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  // const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="catalog-page">
      <div className="catalog-container">
        <FiltersSidebar
          priceMin={priceMin}
          priceMax={priceMax}
          onPriceMinChange={setPriceMin}
          onPriceMaxChange={setPriceMax}
          availableTypes={availableTypes}
          selectedTypes={selectedTypes}
          onTypeChange={setSelectedTypes}
          availableColors={availableColors}
          selectedColors={selectedColors}
          onColorChange={setSelectedColors}
          onShow={applyFiltersAndSorting}
          onReset={handleReset}
        />
        
        <div className="catalog-content">
          <div className="catalog-header">
            {/* <h1 className="catalog-title">Каталог товаров</h1> */}
            <SortingControls sortBy={sortBy} onSortChange={setSortBy} />
          </div>
          
          <ProductGrid
            products={paginationData.currentItems}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            getProductQuantity={getProductQuantity}
            onOpenModal={handleOpenModal}
          />
          
          <Pagination
            currentPage={currentPage}
            totalPages={paginationData.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        cartQuantity={selectedProduct ? getProductQuantity(selectedProduct.id) : 0}
      />
    </div>
  );
};

export default CatalogPage;