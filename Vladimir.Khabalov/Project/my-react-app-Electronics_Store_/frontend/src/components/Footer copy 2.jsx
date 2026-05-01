import React from 'react';
// Картинка в: src/assets/images/telegram.png
import telegramIcon from "../assets/images/social_icons/vk.png";

function Footer() {
  return (
    <footer style={{ padding: '20px', background: '#0C368A', display: 'flex', gap: '10px' }}>
      <img src="/images/social_icons/vk.png" alt="VK" width="24" height="24" />
      <img src="./vk.png" alt="VK" width="24" height="24" />
      <img src="/vk.png" alt="VK2" width="24" height="24" />
      <img src="/whatsapp.png" alt="WhatsApp" width="24" height="24" />
      <img src="/telegram.png" alt="Telegram" width="24" height="24" />
      <img src={telegramIcon} alt="Telegram" />
    </footer>
  );
}

export default Footer;