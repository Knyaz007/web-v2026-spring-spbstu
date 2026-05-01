import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  // Данные для слайдера новинок
  const newProducts = [
    {
      id: 1,
      name: "Умная лампа",
      price: 3990,
      image: "/images/goods/image_29.png",
      isNew: true,
      isHit: false,
      rating: 4.7
    },
    {
      id: 2,
      name: "Датчик температуры и влажности",
      price: 2499,
      image: "/images/goods/image_5.png",
      isNew: true,
      isHit: false,
      rating: 4.5
    },
    {
      id: 3,
      name: "Фитнес-браслет ASK-B19",
      price: 3490,
      image: "/images/goods/image_16.png",
      isNew: true,
      isHit: true,
      rating: 4.2
    },
    {
      id: 4,
      name: "Беспроводная акустика",
      price: 5490,
      image: "/images/goods/image_27.png",
      isNew: true,
      isHit: false,
      rating: 4.5
    }
  ];

  // Данные для слайдера хитов
  const hitProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: 99990,
      image: "/images/goods/image_1.png",
      isNew: false,
      isHit: true,
      rating: 4.8
    },
    {
      id: 2,
      name: "Samsung Galaxy Watch 6",
      price: 29990,
      image: "/images/goods/image_3.png",
      isNew: false,
      isHit: true,
      rating: 4.6
    },
    {
      id: 3,
      name: "MacBook Pro 14",
      price: 199990,
      image: "/images/goods/image_4.png",
      isNew: true,
      isHit: true,
      rating: 4.9
    },
    {
      id: 4,
      name: "Беспроводная акустика",
      price: 4990,
      image: "/images/goods/image_9.png",
      isNew: false,
      isHit: true,
      rating: 4.4
    }
  ];

  // Преимущества
  const advantages = [
    {
      icon: "/images/dog.png",
      title: "Утром заказали, вечером получили",
      bgColor: "#F5F5F5"
    },
    {
      icon: "/images/rub.png",
      title: "С товаром что-то не так? Вернем деньги",
      bgColor: "#F5F5F5"
    },
    {
      icon: "/images/roc.png",
      title: "Только оригинальные товары",
      bgColor: "#F5F5F5"
    }
  ];
  // const sliderRef = useRef(null); // создаём ссылку на контейнер
  const hitsSliderRef = useRef(null);
  const newSliderRef = useRef(null);
  // Функция прокрутки
  // ✅ ПРАВИЛЬНО - две функции
  const scrollHits = (direction) => {
    if (hitsSliderRef.current) {
      const scrollAmount = 318; // 286 + 32
      const newScrollLeft = hitsSliderRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      hitsSliderRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const scrollNew = (direction) => {
    if (newSliderRef.current) {
      const scrollAmount = 310; // 286 + 24
      const newScrollLeft = newSliderRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      newSliderRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page">
      {/* Баннер */}
      <section className="banner-section">
        <div className="banner-container">
          <div className="banner-content">

            <div className="banner-image">
              {/* <img src="/images/social_icons/vk.png" alt="VK" width="24" height="24" /> */}
              <img src="/images/HomePage.png" alt="Умный робот-друг" />
            </div>
          </div>
        </div>
      </section>

      {/* Хиты продаж */}
      <section className="hits-section">
        <div className="container">
          <div className="section-header">
            <div className="section-icon">
              <svg width="35" height="41" viewBox="0 0 35 41" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M4.06165 10.4149C4.78814 10.3882 6.18905 10.3367 9.26477 17.5134C10.3488 15.5424 12.9111 10.2207 11.9256 2.9281C11.892 2.70968 11.8527 2.50273 11.8154 2.30674C11.6342 1.35313 11.5023 0.659212 12.3198 0.168725C13.2813 -0.408208 14.5244 0.609799 15.5911 1.48346C15.6177 1.50521 15.6441 1.52687 15.6705 1.54841C15.7273 1.59492 15.7958 1.65009 15.875 1.71391C17.3066 2.8672 22.2415 6.84272 25.2297 13.4728C25.9196 12.4873 26.5109 11.0092 26.5109 10.4178C26.5109 10.2675 26.4726 9.97052 26.4253 9.60316C26.2866 8.52593 26.0699 6.84329 26.5109 6.47585C27.1022 5.9831 28.0876 5.68746 28.6789 6.27875C28.6979 6.29775 28.7212 6.32063 28.7485 6.34744C29.5704 7.15498 34.0323 11.5388 34.9861 21.5539C35.0846 24.5103 34.789 31.6059 29.763 36.2377C29.5897 36.3637 29.4187 36.4888 29.2492 36.6129C26.2366 38.8177 23.6954 40.6776 17.4443 40.7709C10.8416 40.8695 2.95763 38.1101 0.888103 31.2117C-0.195936 28.1566 -0.590133 24.2147 1.4794 19.2872C1.97214 17.5134 2.46489 15.6409 2.76054 13.4728C2.77151 13.2863 2.78004 13.1084 2.78817 12.9388C2.85302 11.5854 2.89219 10.7682 3.94312 10.4178C3.98054 10.4178 4.01999 10.4164 4.06165 10.4149ZM12.6155 24.2147C13.2067 24.806 13.3053 25.1016 13.4038 25.4958C13.5024 25.89 14.685 30.2262 16.4589 30.0291C17.2473 29.9305 19.711 28.4523 19.9081 22.7365C19.9081 21.5539 20.2037 20.6669 20.795 20.5684C21.3863 20.4698 22.0762 20.4698 22.5689 21.1597C23.0617 21.8495 24.8355 24.5104 24.737 27.861C24.737 28.6494 24.6384 34.3653 21.1892 36.6319C20.6965 37.0261 19.4153 38.0116 17.6415 38.0116C15.8676 38.0116 11.4329 36.7305 10.3488 30.6204C10.1517 29.5364 10.0532 25.8901 10.6445 24.9046C10.8416 24.5104 11.4329 23.8205 12.6155 24.2147Z" fill="#FF60C3"/>
</svg>

            </div>
            <h2 className="section-title">Хиты продаж</h2>
            <p className="section-description">
              Тысячи покупателей уже одобрили эти товары. Самые популярные, проверенные и надежные гаджеты!
            </p>

          </div>

          <div className="products-slider" >
            {/* Кнопка "назад" */}
            <button className="slider-arrow prev" onClick={() => scrollHits('left')}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            </button>

            <div className="products-grid" ref={hitsSliderRef}>
              {hitProducts.map((product, index) => (
                <div className="product-card" key={index}>
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="product-image" />
                    {product.isHit && (
                      <div className="product-badge hit-badge">Хит</div>
                    )}
                  </div>
                  <div className="product-info">
                    <div className="product-price">{product.price.toLocaleString()} ₽</div>
                    <div className="product-name">{product.name}</div>
                    <div className="product-rating">
                      <span className="stars">★</span>
                      <span className="rating-value">{product.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="slider-arrow next" onClick={() => scrollHits('right')}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg></button>
            {/* <button className="slider-arrow next">
              <svg width="14" height="24" viewBox="0 0 14 24" fill="none">
                <rect x="4.1" y="0.7" width="16.81" height="16.81" rx="2" fill="#115EFB" transform="rotate(45 4.1 0.7)"/>
                <rect x="4.1" y="16.81" width="16.81" height="16.81" rx="2" fill="#115EFB" transform="rotate(-45 4.1 16.81)"/>
              </svg>
            </button> */}
          </div>
        </div>
      </section>

      {/* Новинки */}
      <section className="new-section">
        <div className="container">
          <div className="section-header">
            <div className="section-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.6271 46.7524C20.4179 46.7525 20.2153 46.6797 20.0539 46.5466C19.8926 46.4135 19.7827 46.2283 19.743 46.023C17.1839 32.6827 15.3617 30.8604 2.02061 28.2984C1.81517 28.259 1.62987 28.1493 1.49659 27.9881C1.36332 27.8269 1.29041 27.6242 1.29041 27.4151C1.29041 27.2059 1.36332 27.0033 1.49659 26.8421C1.62987 26.6808 1.81517 26.5711 2.02061 26.5318C15.3617 23.9712 17.184 22.1504 19.743 8.80858C19.7827 8.60324 19.8927 8.41813 20.054 8.28502C20.2153 8.15191 20.4179 8.0791 20.6271 8.0791C20.8362 8.0791 21.0388 8.15191 21.2001 8.28502C21.3614 8.41813 21.4714 8.60324 21.5111 8.80858C24.0709 22.1504 25.8932 23.9712 39.2342 26.5317C39.4397 26.5711 39.625 26.6808 39.7583 26.842C39.8915 27.0032 39.9644 27.2059 39.9644 27.415C39.9644 27.6242 39.8915 27.8268 39.7583 27.9881C39.625 28.1493 39.4397 28.259 39.2342 28.2983C25.8932 30.8603 24.0709 32.6826 21.5111 46.0229C21.4714 46.2283 21.3615 46.4134 21.2002 46.5466C21.0389 46.6797 20.8362 46.7525 20.6271 46.7524Z" fill="#00E398"/>
<path d="M45.2438 8.09521C40.5431 7.19287 40.0289 6.6787 39.1266 1.97801C39.0869 1.77268 38.977 1.58756 38.8156 1.45445C38.6543 1.32134 38.4517 1.24854 38.2426 1.24854C38.0334 1.24854 37.8308 1.32134 37.6695 1.45445C37.5082 1.58756 37.3982 1.77268 37.3585 1.97801C36.4569 6.6787 35.9428 7.19287 31.2421 8.09521C31.0366 8.13454 30.8513 8.24426 30.718 8.40548C30.5848 8.5667 30.5118 8.76933 30.5118 8.97851C30.5118 9.18768 30.5848 9.39032 30.718 9.55154C30.8513 9.71275 31.0366 9.82247 31.2421 9.8618C35.942 10.7642 36.4569 11.2783 37.3585 15.979C37.3982 16.1843 37.5082 16.3695 37.6695 16.5026C37.8308 16.6357 38.0334 16.7085 38.2426 16.7085C38.4517 16.7085 38.6543 16.6357 38.8156 16.5026C38.977 16.3695 39.0869 16.1843 39.1266 15.979C40.0289 11.2783 40.5438 10.7642 45.2438 9.8618C45.4492 9.82247 45.6345 9.71275 45.7678 9.55154C45.9011 9.39032 45.974 9.18768 45.974 8.97851C45.974 8.76933 45.9011 8.5667 45.7678 8.40548C45.6345 8.24426 45.4492 8.13454 45.2438 8.09521Z" fill="#00E398"/>
<path d="M12.5277 13.4287C9.48761 12.845 9.15508 12.5124 8.5715 9.47185C8.54583 9.33903 8.47472 9.21929 8.37039 9.13319C8.26607 9.04709 8.13502 9 7.99976 9C7.8645 9 7.73346 9.04709 7.62913 9.13319C7.52481 9.21929 7.4537 9.33903 7.42802 9.47185C6.84492 12.5124 6.51239 12.845 3.47227 13.4287C3.3394 13.4541 3.21955 13.5251 3.13336 13.6293C3.04716 13.7336 3 13.8647 3 14C3 14.1353 3.04716 14.2664 3.13336 14.3707C3.21955 14.4749 3.3394 14.5459 3.47227 14.5713C6.51192 15.155 6.84492 15.4876 7.42802 18.5281C7.4537 18.661 7.52481 18.7807 7.62913 18.8668C7.73346 18.9529 7.8645 19 7.99976 19C8.13502 19 8.26607 18.9529 8.37039 18.8668C8.47472 18.7807 8.54583 18.661 8.5715 18.5281C9.15508 15.4876 9.48809 15.155 12.5277 14.5713C12.6606 14.5459 12.7804 14.4749 12.8666 14.3707C12.9528 14.2664 13 14.1353 13 14C13 13.8647 12.9528 13.7336 12.8666 13.6293C12.7804 13.5251 12.6606 13.4541 12.5277 13.4287Z" fill="#00E398"/>
</svg>

            </div>
            <h2 className="section-title">Новинки</h2>
            <p className="section-description">
              Их только произвели - они уже у нас! Все самое новое и свежее на рынке электроники
            </p>
          </div>


          <div className="products-slider">
            {/* Кнопка "назад" */}
            <button className="slider-arrow prev" onClick={() => scrollNew('left')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {/* <button className="slider-arrow prev">
              <svg width="14" height="24" viewBox="0 0 14 24" fill="none">
                <rect x="9.9" y="0.7" width="16.81" height="16.81" rx="2" fill="#115EFB" transform="rotate(45 9.9 0.7)"/>
                <rect x="9.9" y="16.81" width="16.81" height="16.81" rx="2" fill="#115EFB" transform="rotate(-45 9.9 16.81)"/>
              </svg>
            </button> */}

            <div className="products-grid" ref={newSliderRef}>
              {newProducts.map((product, index) => (
                <div className="product-card" key={index}>
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="product-image" />
                    {product.isNew && (
                      <div className="product-badge new-badge">Новинка</div>
                    )}
                  </div>
                  <div className="product-info">
                    <div className="product-price">{product.price.toLocaleString()} ₽</div>
                    <div className="product-name">{product.name}</div>
                    {product.rating && (
                      <div className="product-rating">
                        <span className="stars">★</span>
                        <span className="rating-value">{product.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Кнопка "вперед" */}
            <button className="slider-arrow next" onClick={() => scrollNew('right')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

            </button>
            {/* <button className="slider-arrow next">
              <svg width="14" height="24" viewBox="0 0 14 24" fill="none">
                <rect x="4.1" y="0.7" width="16.81" height="16.81" rx="2" fill="#115EFB" transform="rotate(45 4.1 0.7)"/>
                <rect x="4.1" y="16.81" width="16.81" height="16.81" rx="2" fill="#115EFB" transform="rotate(-45 4.1 16.81)"/>
              </svg>
            </button> */}
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="advantages-section">


        <div className="advantages-grid">
          <h2 className="advantages-title">Преимущества</h2>
          <div className="advantages-list">
            {advantages.map((adv, index) => (
              <div className="advantage-card" key={index}>
                <div className="advantage-icon">
                  <img src={adv.icon} alt={adv.title} />
                </div>
                <div className="advantage-title">{adv.title}</div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Контакты */}
      <section className="contacts-section">
        <h2 className="contacts-title">Работаем 24/7</h2>
        <div className="contacts-info">

          <div className="contact-item">
            <div className="contact-icon"> <svg width="27" height="40" viewBox="0 0 27 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M26.6667 6.66667C26.6667 3 23.6667 0 20 0H6.66667C3 0 0 3 0 6.66667V33.3333C0 37 3 40 6.66667 40H20C23.6667 40 26.6667 37 26.6667 33.3333V6.66667ZM15 36.6667H11.6667C10.6667 36.6667 10 36 10 35C10 34 10.6667 33.3333 11.6667 33.3333H15C16 33.3333 16.6667 34 16.6667 35C16.6667 36 16 36.6667 15 36.6667ZM23.3333 28.3333C23.3333 29.3333 22.6667 30 21.6667 30H5C4 30 3.33333 29.3333 3.33333 28.3333V8.33333C3.33333 7.33333 4 6.66667 5 6.66667H21.6667C22.6667 6.66667 23.3333 7.33333 23.3333 8.33333V28.3333Z" fill="black" />
            </svg>
            </div>
            <div className="contact-text">8 (800) 678-34-24</div>
          </div>
          <div className="contact-item">
            <div className="contact-icon"><svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 22.5C18.7086 22.5 17.4172 22.0764 16.3156 21.218L0 8.53125V26.25C0 28.3203 1.67891 30 3.75 30H36.25C38.3211 30 40 28.3211 40 26.25V8.53125L23.6875 21.2266C22.5859 22.0781 21.2891 22.5 20 22.5ZM1.27266 6.35156L17.8508 19.25C19.1156 20.2344 20.8875 20.2344 22.1523 19.25L38.7305 6.35156C39.4609 5.72656 40 4.76562 40 3.75C40 1.67891 38.3203 0 36.25 0H3.75C1.67891 0 0 1.67891 0 3.75C0 4.76562 0.469531 5.72656 1.27266 6.35156Z" fill="black" />
            </svg>
            </div>
            <div className="contact-text">gadget@hub.ru</div>
          </div>
          <div className="contact-item">
            <div className="contact-icon"><svg width="28" height="35" viewBox="0 0 28 35" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.75 0C10.1045 0.00413552 6.60958 1.45412 4.03185 4.03185C1.45412 6.60958 0.00413552 10.1045 0 13.75C0 25.5156 12.5 34.4062 13.0312 34.7812C13.2442 34.923 13.4942 34.9986 13.75 34.9986C14.0058 34.9986 14.2558 34.923 14.4688 34.7812C15 34.4062 27.5 25.5156 27.5 13.75C27.4959 10.1045 26.0459 6.60958 23.4682 4.03185C20.8904 1.45412 17.3955 0.00413552 13.75 0ZM13.75 8.75C14.7389 8.75 15.7056 9.04324 16.5279 9.59265C17.3501 10.1421 17.991 10.923 18.3694 11.8366C18.7478 12.7502 18.8469 13.7555 18.6539 14.7255C18.461 15.6954 17.9848 16.5863 17.2855 17.2855C16.5863 17.9848 15.6954 18.461 14.7255 18.6539C13.7555 18.8469 12.7502 18.7478 11.8366 18.3694C10.923 17.991 10.1421 17.3501 9.59265 16.5278C9.04325 15.7056 8.75 14.7389 8.75 13.75C8.75 12.4239 9.27678 11.1521 10.2145 10.2145C11.1521 9.27678 12.4239 8.75 13.75 8.75Z" fill="black" />
            </svg>
            </div>
            <div className="contact-text">Санкт-Петербург, ул. Барочная, д.7, корпус 2</div>
          </div>
        </div>

      </section>
    </div>
  );
};

export default HomePage;