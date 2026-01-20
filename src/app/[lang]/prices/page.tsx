import { getDictionaryFromApi } from '@/lib/dictionary-api';
import { Lang } from '../../i18n/dictionaries';
import Header from '@/app/components/Header';
import Subscription from '@/app/components/Subscription';
import Calculator from '@/app/components/Calculator';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const t = await getDictionaryFromApi(lang);

  // Берем SEO из нового ключа seoPrices, либо дефолтное
  const seo = t.seoPrices || t.seo;

  return {
    title: seo.title,
    description: seo.description,
  };
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
      <Header lang={lang} dict={t} />

      {/* Заголовок страницы */}
      <div className='bg-light py-12 text-center'>
        <div className='container mx-auto px-4'>
          <h1 className='text-3xl md:text-5xl font-bold text-primary mb-4'>
            {t.nav.prices || 'Наши цены'}
          </h1>
          <p className='text-gray-500 max-w-2xl mx-auto'>
            Прозрачное ценообразование. Рассчитайте точную стоимость или
            выберите удобный абонемент.
          </p>
        </div>
      </div>

      {/* Компоненты переехали сюда */}
      <Subscription dict={t} />
      <Calculator dict={t} />

      {/* Здесь можно добавить Footer или упрощенный блок контактов */}
    </main>
  );
}
