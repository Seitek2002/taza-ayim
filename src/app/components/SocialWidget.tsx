'use client';

import { useState } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Instagram,
  Facebook,
  Phone,
} from 'lucide-react';

const SocialWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const links = [
    {
      id: 'whatsapp',
      icon: <Phone size={24} />,
      href: 'https://wa.me/996555000000',
      color: 'bg-[#25D366]',
      label: 'WhatsApp',
    },
    {
      id: 'telegram',
      icon: <Send size={24} />, // Иконка самолетика для ТГ
      href: 'https://t.me/Maia_0505',
      color: 'bg-[#0088cc]',
      label: 'Telegram',
    },
    {
      id: 'instagram',
      icon: <Instagram size={24} />,
      href: 'https://www.instagram.com/taza_aiym?igsh=MTNteWJiOTJ4c3B3eg%3D%3D&utm_source=qr',
      color: 'bg-linear-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]', // Градиент Инсты
      label: 'Instagram',
    },
    {
      id: 'facebook',
      icon: <Facebook size={24} />,
      href: '#', // Пока пусто
      color: 'bg-[#1877F2]',
      label: 'Facebook',
    },
  ];

  return (
    <div className='fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3'>
      {/* Выпадающие кнопки */}
      <div
        className={`flex flex-col gap-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target='_blank'
            rel='noopener noreferrer'
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110 ${link.color}`}
            title={link.label}
          >
            {link.icon}
          </a>
        ))}
      </div>

      {/* Главная кнопка-триггер */}
      <button
        onClick={toggleMenu}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 bg-primary ${isOpen ? 'rotate-45 bg-gray-700' : 'hover:scale-105 animate-bounce hover:animate-none'}`}
        aria-label='Открыть контакты'
      >
        {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
      </button>
    </div>
  );
};

export default SocialWidget;
