import Link from 'next/link';
import Image from 'next/image';
import { Globe, Phone } from 'lucide-react';
import { type Lang } from '../i18n/dictionaries';
import MobileMenu from './MobileMenu';

type HeaderProps = {
  lang: Lang;
  dict: any;
  /** Путь страницы без языка: '' для главной, '/prices' для цен. Нужен для переключателя языка. */
  path?: string;
};

const WHATSAPP_URL = 'https://wa.me/996709058182';

// Серверный компонент: на клиент уходит только JS кнопки мобильного меню (MobileMenu).
const Header = ({ lang, dict, path = '' }: HeaderProps) => {
  const targetLang = lang === 'ky' ? 'ru' : 'ky';
  const switchLangUrl = `/${targetLang}${path}`;
  const switchLangLabel = targetLang === 'ky' ? 'KG' : 'RU';

  // Якоря ведут на секции главной. С других страниц — на /{lang}#section.
  const anchorPrefix = path ? `/${lang}` : '';
  const navLinks = [
    { name: dict.nav.about, href: `${anchorPrefix}#about` },
    { name: dict.nav.services, href: `${anchorPrefix}#services` },
    { name: dict.nav.prices || 'Цены', href: `/${lang}/prices` },
    { name: dict.nav.advantages, href: `${anchorPrefix}#advantages` },
    { name: dict.nav.contacts, href: `${anchorPrefix}#contacts` },
  ];

  return (
    <header className='fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 transition-all'>
      <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
        {/* Логотип */}
        <Link
          href={`/${lang}`}
          prefetch={false}
          className='flex items-center gap-3 group'
        >
          {/* lazy (по умолчанию): eager-картинку React поднимает в <head> как preload,
              и она вставала в очередь раньше hero-изображения (LCP) */}
          <Image src='/logo.png' width={50} height={50} alt='Таза Айым' />
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
            <a
              key={link.href}
              href={link.href}
              className='text-gray-600 hover:text-primary font-medium transition-colors text-sm uppercase tracking-wide'
            >
              {link.name}
            </a>
          ))}

          {/* Смена языка (Desktop) */}
          <Link
            href={switchLangUrl}
            prefetch={false}
            hrefLang={targetLang}
            className='flex items-center gap-1.5 font-bold text-gray-600 hover:text-primary transition-colors border-2 border-transparent hover:border-gray-100 rounded-lg px-2 py-1'
          >
            <Globe size={20} aria-hidden='true' />
            <span className='uppercase'>{switchLangLabel}</span>
          </Link>

          <a
            href={WHATSAPP_URL}
            className='bg-primary hover:bg-green-700 text-white px-5 py-2.5 rounded-full font-bold transition duration-300 shadow-lg shadow-primary/20 flex items-center gap-2 transform hover:-translate-y-0.5'
          >
            <Phone size={18} aria-hidden='true' />
            <span>{dict.header.contact}</span>
          </a>
        </nav>

        {/* Мобильная часть */}
        <div className='flex items-center gap-4 md:hidden'>
          <Link
            href={switchLangUrl}
            prefetch={false}
            hrefLang={targetLang}
            className='flex items-center gap-1 font-bold text-primary border border-primary/20 rounded-lg px-2 py-1'
          >
            <span className='uppercase text-sm'>{switchLangLabel}</span>
          </Link>

          <MobileMenu
            links={navLinks}
            whatsappUrl={WHATSAPP_URL}
            whatsappLabel={dict.header.whatsapp}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
