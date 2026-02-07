import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import dynamic from 'next/dynamic';
import Header from '../components/Header';
import { Footer } from '../components/Footer'; // Убедись что путь верный
import { getDictionaryFromApi } from '@/lib/dictionary-api';
import { Lang } from '../i18n/dictionaries';

// --- ДИНАМИЧЕСКИЕ ИМПОРТЫ ---
// Мы не грузим эти компоненты сразу. Они подгрузятся, когда пользователь начнет скроллить.
// loading: () => ... показывает легкую заглушку (скелетон), пока компонент грузится.

const VideoShowcase = dynamic(() => import('../components/VideoShowcase'), {
  loading: () => <div className='h-96 bg-gray-50 animate-pulse' />,
});

const Partners = dynamic(() => import('../components/Partners'), {
  loading: () => <div className='h-40 bg-white animate-pulse' />,
});

const Services = dynamic(() => import('../components/Services'));

const DopServices = dynamic(() => import('../components/DopServices'));

const PortfolioGallery = dynamic(
  () => import('../components/PortfolioGallery'),
  {
    ssr: true, // Галерею можно не рендерить на сервере, если там сложная логика слайдера
    loading: () => <div className='h-96 bg-gray-100 animate-pulse' />,
  },
);

const Advantages = dynamic(() => import('../components/Advantages'));

const Chemicals = dynamic(() => import('../components/Chemicals'));

const Reviews = dynamic(() => import('../components/Reviews'), {
  loading: () => <div className='h-96 bg-white animate-pulse' />,
});

const SocialWidget = dynamic(() => import('../components/SocialWidget'), {
  ssr: true, // Виджет нужен только на клиенте
});

type Props = {
  params: Promise<{ lang: Lang }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const t = await getDictionaryFromApi(lang);
  return {
    title: t.seo.title,
    description: t.seo.description,
  };
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  const t = await getDictionaryFromApi(lang);

  return (
    <main className='min-h-screen pt-18.5'>
      {/* Header нужен сразу, его оставляем обычным */}
      <Header lang={lang} dict={t} />
      {/* 1. HERO - Самый важный экран (LCP) */}
      <section className='relative bg-light min-h-150 flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <div className='absolute inset-0 bg-linear-to-r from-white via-white/80 to-transparent z-10'></div>
          <Image
            src='https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop'
            alt='Чистый офис'
            fill
            className='object-cover'
            priority // Обязательно priority для первого экрана
            // ВАЖНО: sizes говорит браузеру, какую версию картинки качать для разных экранов
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw'
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
                href={`/${lang}/prices`}
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
      {/* 2. ABOUT - Текстовый блок, можно оставить или тоже сделать dynamic, но текст легкий */}
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
      {/* Дальше идут тяжелые компоненты, которые загрузятся только при скролле */}
      <VideoShowcase dict={t} />
      <Partners dict={t} />
      <Services t={t} />{' '}
      {/* Поменял t={t} на dict={t}, чтобы везде было одинаково */}
      <DopServices t={t} />
      <PortfolioGallery dict={t} />
      <Advantages t={t} />
      <Chemicals dict={t} />
      <Reviews dict={t} />
      {/* CTA PRICES - Легкий блок, можно оставить так */}
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
      {/* Footer нужен для SEO, можно оставить или сделать dynamic */}
      <Footer dict={t} />
      <SocialWidget />
    </main>
  );
}
