'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  Phone,
  CheckCircle2,
  Clock,
  MapPin,
  Instagram,
  ArrowRight,
  Truck,
  ShieldCheck,
  Building2,
  MessageCircle,
  Globe,
} from 'lucide-react';
import Image from 'next/image';
import Calculator from './components/Calculator';
import PortfolioGallery from './components/PortfolioGallery';
import Partners from './components/Partners';
import { dictionaries, type Lang } from './i18n/dictionaries';
import { useCurrentLang } from './i18n/useLang';

const services = [
  {
    id: 1,
    title: 'БАЗОВАЯ УБОРКА',
    time: '1.5-2 часа',
    desc: 'Утренняя или вечерняя комплексная уборка помещения («до» или «после» прихода сотрудников). Актуальна для небольших офисов.',
  },
  {
    id: 2,
    title: 'ПОДДЕРЖИВАЮЩАЯ',
    time: '6-8 часов',
    desc: 'Специалисты в течение рабочего дня убирают помещение. Идеально для ТЦ, супермаркетов и мест с высокой проходимостью.',
  },
  {
    id: 3,
    title: 'ГЕНЕРАЛЬНАЯ УБОРКА',
    time: '12-24 часов',
    desc: 'Тщательная чистка всех труднодоступных мест. Рекомендуется проводить раз в несколько месяцев для любого помещения.',
  },
  {
    id: 4,
    title: 'ПОСЛЕСТРОИТЕЛЬНАЯ',
    time: '12-24 часов',
    desc: 'Удаление пятен краски, клея, строительных растворов и пыли. Используем спец. оборудование и химию.',
  },
];

// Список дополнительных услуг берём из словаря (t.extra.items)

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Инициализация языка из localStorage, по умолчанию 'ky'
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lang') as Lang | null;
      if (saved === 'ru' || saved === 'ky') return saved;
    }
    return 'ky';
  });

  // Поддерживаем атрибут <html lang="..."> актуальным
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  // Словарь текущего языка мемоизируем
  const t = useMemo(() => dictionaries[lang], [lang]);

  const navLinks = [
    { name: t.nav.about, href: '#about' },
    { name: t.nav.services, href: '#services' },
    { name: t.nav.advantages, href: '#advantages' },
    { name: t.nav.contacts, href: '#contacts' },
  ];

  // Функция переключения языка с сохранением
  const toggleLanguage = () => {
    const nextLang: Lang = lang === 'ky' ? 'ru' : 'ky';
    setLang(nextLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', nextLang);
      // уведомим остальные компоненты, чтобы обновились в этой же вкладке
      window.dispatchEvent(
        new CustomEvent('lang-changed', { detail: nextLang }),
      );
    }
  };

  return (
    <header className='fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 transition-all'>
      <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
        {/* Логотип */}
        <Link href='/' className='flex items-center gap-3 group'>
          <Image src={'/logo.svg'} width={50} height={50} alt={'logo'} />
          <div className='flex flex-col'>
            <span className='text-xl md:text-2xl font-bold text-primary leading-none group-hover:text-secondary transition-colors'>
              Таза Айым
            </span>
            <span className='text-xs md:text-sm text-secondary font-bold uppercase'>
              {t.brand.subtitle}
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
          <button
            onClick={toggleLanguage}
            className='flex items-center gap-1.5 font-bold text-gray-600 hover:text-primary transition-colors border-2 border-transparent hover:border-gray-100 rounded-lg px-2 py-1'
          >
            <Globe size={20} />
            <span className='uppercase'>{lang === 'ky' ? 'KG' : 'RU'}</span>
          </button>

          <a
            href='https://wa.me/996555000000' // ЗАМЕНИТЬ НОМЕР
            className='bg-primary hover:bg-green-700 text-white px-5 py-2.5 rounded-full font-bold transition duration-300 shadow-lg shadow-primary/20 flex items-center gap-2 transform hover:-translate-y-0.5'
          >
            <Phone size={18} />
            <span>{t.header.contact}</span>
          </a>
        </nav>

        {/* Кнопка мобильного меню и Язык (Mobile) */}
        <div className='flex items-center gap-4 md:hidden'>
          {/* Язык для мобилки (вынес сюда, чтобы был доступен до открытия меню, но можно убрать внутрь isOpen) */}
          <button
            onClick={toggleLanguage}
            className='flex items-center gap-1 font-bold text-primary border border-primary/20 rounded-lg px-2 py-1'
          >
            <span className='uppercase text-sm'>
              {lang === 'ky' ? 'KG' : 'RU'}
            </span>
          </button>

          <button
            className='text-primary p-2'
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Выпадающее мобильное меню */}
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
              href='https://wa.me/996555000000' // ЗАМЕНИТЬ НОМЕР
              className='bg-primary text-white py-4 rounded-xl text-center font-bold flex justify-center items-center gap-2 mt-4'
            >
              <Phone size={20} />
              {t.header.whatsapp}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

// 3. Подвал (Footer)
const Footer = () => {
  const lang = useCurrentLang();
  const t = useMemo(() => dictionaries[lang], [lang]);
  return (
    <footer id='contacts' className='bg-primary text-white pt-16 pb-8'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 mb-12'>
          {/* Инфо */}
          <div>
            <div className='flex items-center gap-3 mb-6'>
              <div className='bg-white p-1 rounded-full'>
                <Image src={'/logo.svg'} width={50} height={50} alt={'logo'} />
              </div>
              <span className='text-2xl font-bold'>Таза Айым</span>
            </div>
            <p className='text-white/80 mb-6 leading-relaxed'>
              {t.footer.aboutText}
            </p>
          </div>

          {/* Контакты */}
          <div>
            <h3 className='text-xl font-bold mb-6 border-b border-white/20 pb-2 inline-block'>
              {t.footer.contacts}
            </h3>
            <ul className='space-y-4'>
              <li className='flex items-center gap-3'>
                <Phone className='text-secondary' />
                <a
                  href='tel:+996555000000'
                  className='hover:text-secondary transition'
                >
                  +996 555 00 00 00
                </a>
              </li>
              <li className='flex items-center gap-3'>
                <MapPin className='text-secondary' />
                <span>{t.footer.address}</span>
              </li>
              <li className='flex items-center gap-3'>
                <Instagram className='text-secondary' />
                <a
                  href='https://www.instagram.com/taza_aiym'
                  target='_blank'
                  className='hover:text-secondary transition'
                >
                  @taza_aiym
                </a>
              </li>
            </ul>
          </div>

          {/* Навигация */}
          <div>
            <h3 className='text-xl font-bold mb-6 border-b border-white/20 pb-2 inline-block'>
              {t.footer.menu}
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link href='#about' className='hover:text-secondary transition'>
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href='#services'
                  className='hover:text-secondary transition'
                >
                  {t.nav.services}
                </Link>
              </li>
              <li>
                <Link
                  href='#advantages'
                  className='hover:text-secondary transition'
                >
                  {t.nav.advantages}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-white/10 pt-8 text-center text-sm text-white/60'>
          <p>
            &copy; {new Date().getFullYear()} Таза Айым Клининг.{' '}
            {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};

// --- ГЛАВНАЯ СТРАНИЦА (Сборка) ---

export default function Home() {
  const whatsappLink = 'https://wa.me/996555000000';
  const lang = useCurrentLang();
  const t = useMemo(() => dictionaries[lang], [lang]);

  return (
    <main className='min-h-screen pt-18.5'>
      {' '}
      {/* Отступ для фиксированного хедера */}
      <Header />
      {/* Hero Section (Первый экран) */}
      <section className='relative bg-light min-h-150 flex items-center justify-center overflow-hidden'>
        {/* Фоновое изображение */}
        <div className='absolute inset-0 z-0'>
          <div className='absolute inset-0 bg-linear-to-r from-white via-white/80 to-transparent z-10'></div>
          {/* Используем обычный img для простоты, в продакшене лучше next/image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src='https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop'
            alt='Чистый офис'
            className='w-full h-full object-cover'
          />
        </div>

        <div className='container mx-auto px-4 relative z-20'>
          <div className='max-w-2xl'>
            <div className='inline-block py-1 px-4 rounded-full bg-secondary/10 text-secondary font-bold text-sm mb-6 border border-secondary/20'>
              {t.hero.region}
            </div>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-[1.15]'>
              {t.hero.title}
            </h1>
            <p className='text-lg md:text-xl text-gray-600 mb-10 border-l-4 border-secondary pl-6 leading-relaxed'>
              {t.hero.desc}
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <a
                href={whatsappLink}
                className='bg-primary hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full transition shadow-xl shadow-primary/30 flex items-center justify-center gap-2 transform hover:-translate-y-1'
              >
                <span>{t.hero.ctaCalculate}</span>
                <ArrowRight size={20} />
              </a>
              <Link
                href='#services'
                className='bg-white hover:bg-gray-50 text-primary border-2 border-primary font-bold py-4 px-8 rounded-full transition flex items-center justify-center'
              >
                {t.hero.ctaViewServices}
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Кратко о компании */}
      <section id='about' className='py-20 bg-white text-center'>
        <div className='container mx-auto px-4 max-w-4xl'>
          <h2 className='text-3xl font-bold text-gray-800 mb-6'>
            {t.about.heading}
          </h2>
          <p className='text-xl text-gray-600 leading-relaxed'>
            {t.about.desc}
          </p>
        </div>
      </section>
      <Partners />
      <PortfolioGallery />
      <Calculator />
      {/* <BeforeAfter /> */}
      {/* Карточки услуг */}
      <section id='services' className='py-20 bg-light'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-primary font-bold tracking-widest uppercase mb-2'>
              {t.services.sectionTag}
            </h2>
            <h3 className='text-3xl md:text-4xl font-bold text-gray-900'>
              {t.services.sectionTitle}
            </h3>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {services.map((service) => (
              <div
                key={service.id}
                className='bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col border border-gray-100 group'
              >
                <div className='mb-6'>
                  <span className='inline-flex items-center gap-1.5 text-xs font-bold text-secondary bg-secondary/10 px-3 py-1.5 rounded-full'>
                    <Clock size={14} /> {service.time}
                  </span>
                </div>
                <h4 className='text-xl font-extrabold text-primary mb-3 group-hover:text-secondary transition-colors uppercase'>
                  {service.title}
                </h4>
                <p className='text-gray-600 text-sm mb-8 grow leading-relaxed'>
                  {service.desc}
                </p>
                <a
                  href={whatsappLink}
                  className='w-full py-3 rounded-xl border-2 border-primary text-primary font-bold text-center hover:bg-primary hover:text-white transition-all mt-auto block'
                >
                  {t.services.order}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Дополнительные услуги */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='bg-primary rounded-4xl p-8 md:p-16 text-white relative overflow-hidden shadow-2xl'>
            {/* Декоративный круг */}
            <div className='absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl'></div>

            <div className='grid md:grid-cols-2 gap-12 relative z-10 items-center'>
              <div>
                <h3 className='text-3xl md:text-4xl font-bold mb-6'>
                  {t.extra.heading}
                </h3>
                <p className='text-white/90 text-lg mb-8 leading-relaxed'>
                  {t.extra.desc}
                </p>
                <a
                  href={whatsappLink}
                  className='inline-flex items-center gap-2 bg-white text-primary font-bold py-4 px-8 rounded-full hover:bg-secondary hover:text-white transition shadow-lg'
                >
                  {t.extra.cta}
                </a>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {t.extra.items.map((item, idx) => (
                  <div
                    key={idx}
                    className='flex items-center gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition cursor-default'
                  >
                    <CheckCircle2
                      className='text-secondary shrink-0'
                      size={20}
                    />
                    <span className='font-medium'>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Преимущества */}
      <section id='advantages' className='py-20 bg-light'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16'>
            {t.advantages.heading}
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition'>
              <div className='w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6 text-primary'>
                <Truck size={40} />
              </div>
              <h3 className='text-xl font-bold mb-3 text-gray-900'>
                {t.advantages.cards[0].title}
              </h3>
              <p className='text-gray-600'>{t.advantages.cards[0].desc}</p>
            </div>

            <div className='flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition'>
              <div className='w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6 text-primary'>
                <Building2 size={40} />
              </div>
              <h3 className='text-xl font-bold mb-3 text-gray-900'>
                {t.advantages.cards[1].title}
              </h3>
              <p className='text-gray-600'>{t.advantages.cards[1].desc}</p>
            </div>

            <div className='flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition'>
              <div className='w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6 text-primary'>
                <ShieldCheck size={40} />
              </div>
              <h3 className='text-xl font-bold mb-3 text-gray-900'>
                {t.advantages.cards[2].title}
              </h3>
              <p className='text-gray-600'>{t.advantages.cards[2].desc}</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      {/* Плавающая кнопка WhatsApp (всегда видна) */}
      <a
        href={whatsappLink}
        target='_blank'
        rel='noopener noreferrer'
        className='fixed bottom-6 right-6 z-60 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform animate-bounce hover:animate-none flex items-center justify-center'
        aria-label='Чат в WhatsApp'
      >
        <MessageCircle size={32} fill='white' className='text-white' />
      </a>
    </main>
  );
}
