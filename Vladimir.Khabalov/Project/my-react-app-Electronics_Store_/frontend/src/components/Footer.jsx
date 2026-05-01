// import React from 'react';
import React, { useEffect, useState } from 'react';
import './Footer.css';
// const Footer = lazy(() => import('./components/Footer')); что за метод такой
const Footer = React.memo(() => {
  const [cachedData, setCachedData] = useState(null);
  useEffect(() => {
    // Загружаем из кэша
    const saved = localStorage.getItem('footerData');
    if (saved) {
      setCachedData(JSON.parse(saved));
    }
  }, []);


  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-logo">Gadget Hub</div>
          <div className="footer-tagline">Магазин надежных гаджетов</div>
          
        </div>
           
        <div className="footer-center">
         <div className="footer-phone-icon">
  <img src="/images/icons/mobile.svg" alt="Phone" width="24" height="24" />
  <div className="footer-phone">8 (800) 678-34-24</div>
</div>
        </div>      
        <div className="footer-right">
           <div className="footer-icon-vk">   
                <img src="/images/social_icons/vk.png" alt="VK" width="24" height="24" />
           </div>
            <div  className="footer-icon-whatsapp">
                <img src="/whatsapp.png" alt="WhatsApp" width="24" height="24" />
            </div>
          <div className="footer-logo-telegram"> 
              <img src="../telegram.png" alt="Telegram" width="24" height="24" /> 
          </div>     
               
        </div>
          
      </div>
       <div className="footer-copyright"> © 2024 ООО “Гаджет Хаб”. Все права защищены </div>
    </footer>
  );
}
)
export default Footer;