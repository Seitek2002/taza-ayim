import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import dynamic from 'next/dynamic';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import Partners from '../components/Partners';
import Services from '../components/Services';
import DopServices from '../components/DopServices';
import Advantages from '../components/Advantages';
import Chemicals from '../components/Chemicals';
import { getDictionaryFromApi } from '@/lib/dictionary-api';
import { pageMetadata } from '@/lib/seo';
import { getSiteSections } from '@/lib/site-content';
import { Lang } from '../i18n/dictionaries';
import heroImage from '@/assets/hero.jpg';

// Серверные секции выше импортируются обычным образом: JS на клиент они не шлют,
// а dynamic() для них ничего не даёт.
// Клиентские секции ниже — через dynamic(): их JS уходит в отдельные чанки,
// и каждая гидрируется своим Suspense-блоком, не блокируя остальную страницу.
// Всё по-прежнему рендерится на сервере (SSR), это важно для SEO.
const VideoShowcase = dynamic(() => import('../components/VideoShowcase'));
const PortfolioGallery = dynamic(
  () => import('../components/PortfolioGallery'),
);
const Reviews = dynamic(() => import('../components/Reviews'));
const SocialWidget = dynamic(() => import('../components/SocialWidget'));

type Props = {
  params: Promise<{ lang: Lang }>;
};

// Только /ky и /ru. Всё остальное (например /robots.txt, /og-image.jpg,
// если файла нет) раньше попадало в [lang] и падало с 500 — теперь 404.
export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const t = await getDictionaryFromApi(lang);
  return pageMetadata({
    lang,
    title: t.seo.title,
    description: t.seo.description,
  });
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  const t = await getDictionaryFromApi(lang);
  // Отзывы, до/после, услуги, партнёры, бренды — из админки
  const sections = await getSiteSections(lang, t);

  return (
    <main className='min-h-screen pt-18.5'>
      <Header lang={lang} dict={t} />
      {/* 1. HERO — эта картинка и есть LCP-элемент на мобилке и десктопе */}
      <section className='relative bg-light min-h-150 flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <div className='absolute inset-0 bg-linear-to-r from-white via-white/80 to-transparent z-10'></div>
          <Image
            src={heroImage}
            alt='Чистый офис'
            fill
            className='object-cover'
            // Локальный файл + preload + fetchPriority=high: браузер узнаёт о картинке
            // из <head> и качает её раньше всего остального.
            preload
            fetchPriority='high'
            // Без placeholder='blur': под белым градиентом его почти не видно,
            // а это лишний base64 в HTML и SVG-фильтр на весь первый экран.
            // Картинка растянута на всю ширину секции на любом экране
            sizes='100vw'
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
              <a
                href='#services'
                className='bg-white hover:bg-gray-50 text-primary border-2 border-primary font-bold py-4 px-8 rounded-full transition flex items-center justify-center'
              >
                {t.hero.ctaViewServices}
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* 2. ABOUT */}
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
      <Partners dict={t} partners={sections.partners} />
      <Services t={t} services={sections.services} />
      <DopServices t={t} />
      <PortfolioGallery dict={t} cases={sections.cases} />
      <Advantages t={t} />
      <Chemicals dict={t} brands={sections.brands} />
      <Reviews dict={t} items={sections.reviews} />
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
      <Footer dict={t} />
      <SocialWidget />
    </main>
  );
}
