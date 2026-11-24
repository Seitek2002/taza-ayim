import { getDictionaryFromApi } from '@/lib/dictionary-api';
import { pageMetadata } from '@/lib/seo';
import { Lang } from '../../i18n/dictionaries';
import Header from '@/app/components/Header';
import Subscription from '@/app/components/Subscription';
import Calculator from '@/app/components/Calculator';
import { Footer } from '@/app/components/Footer';

// Только /ky/prices и /ru/prices (см. такой же комментарий на главной)
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const t = await getDictionaryFromApi(lang);

  // Своё SEO страницы цен (seoPrices в словаре), а не главной
  const seo = t.seoPrices || t.seo;

  // Свой canonical (/ru/prices), а не унаследованный от layout /ru
  return pageMetadata({
    lang,
    path: '/prices',
    title: seo.title,
    description: seo.description,
  });
}

export default async function PricesPage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const t = await getDictionaryFromApi(lang);

  return (
    <main className='min-h-screen pt-18.5'>
      <Header lang={lang} dict={t} path='/prices' />

      {/* Заголовок страницы */}
      <div className='bg-light py-12 text-center'>
        <div className='container mx-auto px-4'>
          <h1 className='text-3xl md:text-5xl font-bold text-primary mb-4'>
            {t.prices?.heading || t.nav.prices || 'Наши цены'}
          </h1>
          {/* Раньше текст был захардкожен по-русски и показывался и на /ky */}
          <p className='text-gray-500 max-w-2xl mx-auto'>{t.prices?.desc}</p>
        </div>
      </div>

      <Subscription dict={t} />
      <Calculator dict={t} />

      {/* Контакты и адрес на каждой странице — плюс для локального SEO */}
      <Footer dict={t} />
    </main>
  );
}
