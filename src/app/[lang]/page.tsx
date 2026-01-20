import Link from 'next/link';
import Image from 'next/image';
import {
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
} from 'lucide-react';

import PortfolioGallery from '../components/PortfolioGallery';
import Partners from '../components/Partners';
import Header from '../components/Header';
import { getDictionaryFromApi } from '@/lib/dictionary-api';
import { Lang } from '../i18n/dictionaries';
import Reviews from '../components/Reviews';

type Props = {
  params: Promise<{ lang: Lang }>;
};

// 1. Генерация метаданных (SEO)
export async function generateMetadata({ params }: Props) {
  const { lang } = await params; // Обязательно ждем параметры
  const t = await getDictionaryFromApi(lang);
  return {
    title: t.seo.title,
    description: t.seo.description,
  };
}

// 2. Компонент Footer (оставляем здесь как часть серверной страницы)
const Footer = ({ dict }: { dict: any }) => {
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
              {dict.footer.aboutText}
            </p>
          </div>

          {/* Контакты */}
          <div>
            <h3 className='text-xl font-bold mb-6 border-b border-white/20 pb-2 inline-block'>
              {dict.footer.contacts}
            </h3>
            <ul className='space-y-4'>
              <li className='flex items-center gap-3'>
                <Phone className='text-white' />
                <a
                  href='tel:+996555000000'
                  className='hover:text-secondary transition'
                >
                  +996 555 00 00 00
                </a>
              </li>
              <li className='flex items-center gap-3'>
                <MapPin className='text-white' />
                <span>{dict.footer.address}</span>
              </li>
              <li className='flex items-center gap-3'>
                <Instagram className='text-white' />
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
              {dict.footer.menu}
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link href='#about' className='hover:text-secondary transition'>
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href='#services'
                  className='hover:text-secondary transition'
                >
                  {dict.nav.services}
                </Link>
              </li>
              <li>
                <Link
                  href='#advantages'
                  className='hover:text-secondary transition'
                >
                  {dict.nav.advantages}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-white/10 pt-8 text-center text-sm text-white/60'>
          <p>
            &copy; {new Date().getFullYear()} Таза Айым Клининг.{' '}
            {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};

// 3. ГЛАВНАЯ СТРАНИЦА (Серверный компонент)
export default async function Home({ params }: Props) {
  const whatsappLink = 'https://wa.me/996555000000';

  // Ждем параметры (await) — это исправит ошибку undefined
  const { lang } = await params;
  const t = await getDictionaryFromApi(lang);

  const services = [
    {
      id: 1,
      // Используем ?. (опциональную цепочку), чтобы не упало, если ключей еще нет в базе
      title: t?.services?.items?.[1]?.title || 'БАЗОВАЯ УБОРКА',
      time: t?.services?.items?.[1]?.time || '1.5-2 часа',
      desc: t?.services?.items?.[1]?.desc || 'Утренняя или вечерняя...',
    },
    {
      id: 2,
      title: t?.services?.items?.[2]?.title || 'ПОДДЕРЖИВАЮЩАЯ',
      time: t?.services?.items?.[2]?.time || '6-8 часов',
      desc: t?.services?.items?.[2]?.desc || 'Специалисты в течение...',
    },
    {
      id: 3,
      title: t?.services?.items?.[3]?.title || 'ГЕНЕРАЛЬНАЯ УБОРКА',
      time: t?.services?.items?.[3]?.time || '12-24 часов',
      desc: t?.services?.items?.[3]?.desc || 'Тщательная чистка...',
    },
    {
      id: 4,
      title: t?.services?.items?.[4]?.title || 'ПОСЛЕСТРОИТЕЛЬНАЯ',
      time: t?.services?.items?.[4]?.time || '12-24 часов',
      desc: t?.services?.items?.[4]?.desc || 'Удаление пятен...',
    },
  ];

  return (
    <main className='min-h-screen pt-18.5'>
      {/* Передаем словарь в Header */}
      <Header lang={lang} dict={t} />

      {/* Hero Section */}
      <section className='relative bg-light min-h-150 flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <div className='absolute inset-0 bg-linear-to-r from-white via-white/80 to-transparent z-10'></div>
          {/* Используем img, чтобы не мучиться с настройкой доменов в next.config.ts для демо */}
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
            <h1 className='text-4xl bg-gray-200/40 lg:bg-transparent md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-[1.15]'>
              {t.hero.title}
            </h1>
            <p className='text-lg bg-gray-200/40 lg:bg-transparent md:text-xl text-gray-600 mb-10 border-l-4 border-secondary pl-6 leading-relaxed'>
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

      {/* О компании */}
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

      {/* Партнеры */}
      <Partners dict={t} />

      <PortfolioGallery dict={t} />

      <Reviews />

      {/* Услуги */}
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
                {(Object.values(t.extra.items) as string[]).map(
                  (item: string, idx: number) => (
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
                  ),
                )}
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

      {/* Footer (дубль для передачи пропсов, но лучше использовать тот компонент выше) */}
      <Footer dict={t} />

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
