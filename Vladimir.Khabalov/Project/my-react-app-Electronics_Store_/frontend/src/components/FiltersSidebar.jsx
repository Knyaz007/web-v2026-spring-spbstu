// FiltersSidebar.jsx
import React, { useState, useEffect, useRef } from 'react';
import './FiltersSidebar.css';

const FiltersSidebar = ({ 
  priceMin, 
  priceMax, 
  onPriceMinChange, 
  onPriceMaxChange,
  availableTypes,
  selectedTypes,
  onTypeChange,
  availableColors,
  selectedColors,
  onColorChange,
  onShow,
  onReset
}) => {
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [localPriceMin, setLocalPriceMin] = useState(priceMin || 0);
  const [localPriceMax, setLocalPriceMax] = useState(priceMax || 10000);
  const [isDragging, setIsDragging] = useState(null);
  
  const typeDropdownRef = useRef(null);
  const colorDropdownRef = useRef(null);
  const sliderRef = useRef(null);
  
  const minPriceLimit = 0;
  const maxPriceLimit = 1000000;

  // Синхронизация локальных значений с пропсами
  useEffect(() => {
    setLocalPriceMin(priceMin || 0);
    setLocalPriceMax(priceMax || 1000000);
  }, [priceMin, priceMax]);

  // Закрытие dropdown при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setIsTypeOpen(false);
      }
      if (colorDropdownRef.current && !colorDropdownRef.current.contains(event.target)) {
        setIsColorOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Обработка ползунков
  const handleMinPriceChange = (value) => {
    let newMin = Math.min(Number(value), localPriceMax - 1);
    newMin = Math.max(minPriceLimit, newMin);
    setLocalPriceMin(newMin);
    onPriceMinChange(newMin);
    onShow();
  };

  const handleMaxPriceChange = (value) => {
    let newMax = Math.max(Number(value), localPriceMin + 1);
    newMax = Math.min(maxPriceLimit, newMax);
    setLocalPriceMax(newMax);
    onPriceMaxChange(newMax);
    onShow();
  };

  const handleMouseDown = (type) => {
    setIsDragging(type);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const percent = x / rect.width;
    const value = Math.round(minPriceLimit + percent * (maxPriceLimit - minPriceLimit));
    
    if (isDragging === 'min') {
      const newMin = Math.min(value, localPriceMax - 1);
      if (newMin >= minPriceLimit && newMin < localPriceMax) {
        setLocalPriceMin(newMin);
        onPriceMinChange(newMin);
        onShow();
      }
    } else if (isDragging === 'max') {
      const newMax = Math.max(value, localPriceMin + 1);
      if (newMax <= maxPriceLimit && newMax > localPriceMin) {
        setLocalPriceMax(newMax);
        onPriceMaxChange(newMax);
        onShow();
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, localPriceMin, localPriceMax]);

  const getMinPercent = () => {
    return ((localPriceMin - minPriceLimit) / (maxPriceLimit - minPriceLimit)) * 100;
  };

  const getMaxPercent = () => {
    return ((localPriceMax - minPriceLimit) / (maxPriceLimit - minPriceLimit)) * 100;
  };

  // Обработка типов товара
  const handleTypeSelect = (type) => {
    let newSelectedTypes;
    if (selectedTypes.includes(type)) {
      newSelectedTypes = selectedTypes.filter(t => t !== type);
    } else {
      newSelectedTypes = [...selectedTypes, type];
    }
    onTypeChange(newSelectedTypes);
    onShow();
  };

  // Обработка цветов
  const handleColorSelect = (color) => {
    let newSelectedColors;
    if (selectedColors.includes(color)) {
      newSelectedColors = selectedColors.filter(c => c !== color);
    } else {
      newSelectedColors = [...selectedColors, color];
    }
    onColorChange(newSelectedColors);
    onShow();
  };

  const clearTypes = () => {
    onTypeChange([]);
    onShow();
  };

  const clearColors = () => {
    onColorChange([]);
    onShow();
  };

  const selectAllTypes = () => {
    onTypeChange([...availableTypes]);
    onShow();
  };

  const selectAllColors = () => {
    onColorChange([...availableColors]);
    onShow();
  };

  const handleFullReset = () => {
    setLocalPriceMin(minPriceLimit);
    setLocalPriceMax(maxPriceLimit);
    onPriceMinChange(minPriceLimit);
    onPriceMaxChange(maxPriceLimit);
    onTypeChange([]);
    onColorChange([]);
    onReset();
  };

  const getTypeButtonText = () => {
    if (selectedTypes.length === 0) return "Все типы";
    if (selectedTypes.length === availableTypes.length) return "Все типы";
    return `Выбрано: ${selectedTypes.length}`;
  };

  const getColorButtonText = () => {
    if (selectedColors.length === 0) return "Все цвета";
    if (selectedColors.length === availableColors.length) return "Все цвета";
    return `Выбрано: ${selectedColors.length}`;
  };

  return (
    <div className="filters-sidebar">
      <h3 className="filters-title">Фильтры</h3>
      
      {/* Блок цены с ползунком */}
      <div className="filter-group">
        <h4 className="filter-subtitle">Цена, ₽</h4>
        
        <div className="price-inputs">
          <div className="price-field">
            <label className="price-label">от</label>
            <input
              type="number"
              value={localPriceMin}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              className="price-input"
            />
          </div>
          <div className="price-field">
            <label className="price-label">до</label>
            <input
              type="number"
              value={localPriceMax}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              className="price-input"
            />
          </div>
        </div>

        <div className="price-slider-container">
          <div className="slider-track" ref={sliderRef}>
            <div 
              className="slider-range" 
              style={{ 
                left: `${getMinPercent()}%`, 
                right: `${100 - getMaxPercent()}%` 
              }}
            />
          </div>
          
          <input
            type="range"
            min={minPriceLimit}
            max={maxPriceLimit}
            value={localPriceMin}
            onChange={(e) => handleMinPriceChange(Number(e.target.value))}
            className="slider-input slider-min"
            onMouseDown={() => handleMouseDown('min')}
            style={{ zIndex: localPriceMin > maxPriceLimit - 100 ? 5 : 10 }}
          />
          
          <input
            type="range"
            min={minPriceLimit}
            max={maxPriceLimit}
            value={localPriceMax}
            onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
            className="slider-input slider-max"
            onMouseDown={() => handleMouseDown('max')}
          />
        </div>
      </div>
      
      {/* Блок типа товара */}
      <div className="filter-group">
        <h4 className="filter-subtitle">Тип товара</h4>
        <div className="dropdown" ref={typeDropdownRef}>
          <button 
            className="dropdown-toggle"
            onClick={() => setIsTypeOpen(!isTypeOpen)}
            type="button"
          >
            <span>{getTypeButtonText()}</span>
            <span className={`dropdown-arrow ${isTypeOpen ? 'open' : ''}`}>▼</span>
          </button>
          
          {isTypeOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-actions">
                <button onClick={selectAllTypes} className="dropdown-action-btn" type="button">
                  Выбрать все
                </button>
                <button onClick={clearTypes} className="dropdown-action-btn" type="button">
                  Сбросить
                </button>
              </div>
              <div className="dropdown-items">
                {availableTypes.map(type => (
                  <label key={type} className="dropdown-item">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeSelect(type)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Блок цвета */}
      <div className="filter-group">
        <h4 className="filter-subtitle">Цвет</h4>
        <div className="dropdown" ref={colorDropdownRef}>
          <button 
            className="dropdown-toggle"
            onClick={() => setIsColorOpen(!isColorOpen)}
            type="button"
          >
            <span>{getColorButtonText()}</span>
            <span className={`dropdown-arrow ${isColorOpen ? 'open' : ''}`}>▼</span>
          </button>
          
          {isColorOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-actions">
                <button onClick={selectAllColors} className="dropdown-action-btn" type="button">
                  Выбрать все
                </button>
                <button onClick={clearColors} className="dropdown-action-btn" type="button">
                  Сбросить
                </button>
              </div>
              <div className="dropdown-items">
                {availableColors.map(color => (
                  <label key={color} className="dropdown-item">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={() => handleColorSelect(color)}
                    />
                    <span>{color}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Кнопки действий */}
      <div className="filter-actions">
        <button onClick={onShow} className="btn-show" type="button">
          Показать
        </button>
        <button onClick={handleFullReset} className="btn-reset" type="button">
          Сбросить фильтры
        </button>
      </div>
    </div>
  );
};

export default FiltersSidebar;