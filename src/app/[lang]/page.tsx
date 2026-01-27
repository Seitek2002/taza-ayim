import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  MapPin,
  Instagram,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

import PortfolioGallery from '../components/PortfolioGallery';
import Partners from '../components/Partners';
import Header from '../components/Header';
import { getDictionaryFromApi } from '@/lib/dictionary-api';
import { Lang } from '../i18n/dictionaries';
import Reviews from '../components/Reviews';
import Chemicals from '../components/Chemicals';
import Services from '../components/Services';
import DopServices from '../components/DopServices';
import Advantages from '../components/Advantages';
import VideoShowcase from '../components/VideoShowcase';
import SocialWidget from '../components/SocialWidget';

type Props = {
  params: Promise<{ lang: Lang }>;
};

// 1. Генерация метаданных (SEO)
export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const t = await getDictionaryFromApi(lang);
  return {
    title: t.seo.title,
    description: t.seo.description,
  };
}

// 2. Компонент Footer
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
                  href='tel:+996559554225'
                  className='hover:text-secondary transition'
                >
                  +996559554225
                </a>
              </li>
              <li className='flex items-center gap-3'>
                <Phone className='text-white' />
                <a
                  href='tel:+996509554225'
                  className='hover:text-secondary transition'
                >
                  +996509554225
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

// 3. ГЛАВНАЯ СТРАНИЦА
export default async function Home({ params }: Props) {
  // const whatsappLink = 'https://wa.me/996559554225';

  const { lang } = await params;
  const t = await getDictionaryFromApi(lang);

  return (
    <main className='min-h-screen pt-18.5'>
      <Header lang={lang} dict={t} />

      {/* 1. HERO - Первый экран */}
      <section className='relative bg-light min-h-150 flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <div className='absolute inset-0 bg-linear-to-r from-white via-white/80 to-transparent z-10'></div>
          <Image
            src='https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop'
            alt='Чистый офис'
            fill
            className='object-cover'
            priority
          />
        </div>

        <div className='container mx-auto px-4 relative z-20'>
          <div className='max-w-2xl'>
            <div className='inline-block py-1 px-4 rounded-full bg-secondary/10 text-secondary font-bold text-sm mb-6 border border-secondary/20'>
              {t.hero.region}
            </div>
            <h1 className='text-4xl bg-gray-200/40 lg:bg-transparent md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-[1.15] backdrop-blur-sm lg:backdrop-blur-none rounded-xl p-2 lg:p-0'>
              {t.hero.title}
            </h1>
            <p className='text-lg bg-gray-200/40 lg:bg-transparent md:text-xl text-gray-600 mb-10 border-l-4 border-secondary pl-6 leading-relaxed backdrop-blur-sm lg:backdrop-blur-none rounded-r-xl py-2 lg:py-0'>
              {t.hero.desc}
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <a
                href={`/${lang}/prices`} // Ведем на страницу цен
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

      {/* 2. ABOUT - О нас (Кратко) */}
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

      <VideoShowcase dict={t} />

      {/* 3. PARTNERS - Доверие (Поднимаем выше) */}
      <Partners dict={t} />

      {/* 4. SERVICES - Основные услуги */}
      <Services t={t} />

      {/* 5. DOP SERVICES - Дополнительные услуги */}
      <DopServices t={t} />

      {/* 6. PORTFOLIO - Доказательство (До/После) */}
      <PortfolioGallery dict={t} />

      {/* 7. ADVANTAGES - Преимущества (Техника) */}
      <Advantages t={t} />

      {/* 8. CHEMICALS - Безопасность (Химия) */}
      <Chemicals dict={t} />

      {/* 9. REVIEWS - Отзывы (Социальное доказательство перед покупкой) */}
      <Reviews dict={t} />

      {/* 10. CTA PRICES - Финальный призыв узнать цену (Раз уж калькулятор убрали) */}
      <section className='py-16 bg-primary text-white text-center'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl md:text-4xl font-bold mb-6'>
            {t.home?.cta_price_heading ||
              'Хотите узнать точную стоимость уборки?'}
          </h2>
          <p className='text-white/80 text-lg mb-8 max-w-2xl mx-auto'>
            {t.home?.cta_price_desc ||
              'Воспользуйтесь нашим онлайн-калькулятором или выберите готовый пакет услуг.'}
          </p>
          <a
            href={`/${lang}/prices`}
            className='inline-block bg-white text-primary font-bold py-4 px-10 rounded-full hover:bg-secondary hover:text-white transition shadow-xl'
          >
            {t.home?.cta_price_button || 'Рассчитать стоимость'}
          </a>
        </div>
      </section>

      {/* 11. FOOTER */}
      <Footer dict={t} />

      <SocialWidget />
    </main>
  );
}
