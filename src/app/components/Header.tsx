'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Globe, Phone, X, Menu } from 'lucide-react';
import { type Lang } from '../i18n/dictionaries';

type HeaderProps = {
  lang: Lang;
  dict: any;
};

const Header = ({ lang, dict }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: dict.nav.about, href: '#about' },
    { name: dict.nav.services, href: '#services' },
    { name: dict.nav.advantages, href: '#advantages' },
    { name: dict.nav.contacts, href: '#contacts' },
  ];

  // Функция для создания ссылки с другим языком
  // Берет текущий путь /ky/services и меняет на /ru/services
  const getSwitchLangUrl = () => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = lang === 'ky' ? 'ru' : 'ky';
    return segments.join('/');
  };

  const targetLang = lang === 'ky' ? 'ru' : 'ky';

  return (
    <header className='fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 transition-all'>
      <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
        {/* Логотип */}
        <Link href={`/${lang}`} className='flex items-center gap-3 group'>
          <Image src={'/logo.svg'} width={50} height={50} alt={'logo'} />
          <div className='flex flex-col'>
            <span className='text-xl md:text-2xl font-bold text-primary leading-none group-hover:text-secondary transition-colors'>
              Таза Айым
            </span>
            <span className='text-xs md:text-sm text-secondary font-bold uppercase'>
              {dict.brand.subtitle}
            </span>
          </div>
        </Link>

        {/* Десктопное меню */}
        <nav className='hidden md:flex items-center gap-8'>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className='text-gray-600 hover:text-primary font-medium transition-colors text-sm uppercase tracking-wide'
            >
              {link.name}
            </Link>
          ))}

          {/* Кнопка смены языка (Desktop) */}
          <Link
            href={getSwitchLangUrl()}
            className='flex items-center gap-1.5 font-bold text-gray-600 hover:text-primary transition-colors border-2 border-transparent hover:border-gray-100 rounded-lg px-2 py-1'
          >
            <Globe size={20} />
            <span className='uppercase'>
              {targetLang === 'ky' ? 'KG' : 'RU'}
            </span>
          </Link>

          <a
            href='https://wa.me/996555000000'
            className='bg-primary hover:bg-green-700 text-white px-5 py-2.5 rounded-full font-bold transition duration-300 shadow-lg shadow-primary/20 flex items-center gap-2 transform hover:-translate-y-0.5'
          >
            <Phone size={18} />
            <span>{dict.header.contact}</span>
          </a>
        </nav>

        {/* Мобильная часть */}
        <div className='flex items-center gap-4 md:hidden'>
          {/* Язык для мобилки */}
          <Link
            href={getSwitchLangUrl()}
            className='flex items-center gap-1 font-bold text-primary border border-primary/20 rounded-lg px-2 py-1'
          >
            <span className='uppercase text-sm'>
              {targetLang === 'ky' ? 'KG' : 'RU'}
            </span>
          </Link>

          <button
            className='text-primary p-2'
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {isOpen && (
        <div className='md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 h-screen pb-24 overflow-y-auto z-40'>
          <div className='flex flex-col p-6 gap-6'>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className='text-xl font-bold text-gray-800 border-b border-gray-100 pb-4'
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <a
              href='https://wa.me/996555000000'
              className='bg-primary text-white py-4 rounded-xl text-center font-bold flex justify-center items-center gap-2 mt-4'
            >
              <Phone size={20} />
              {dict.header.whatsapp}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
