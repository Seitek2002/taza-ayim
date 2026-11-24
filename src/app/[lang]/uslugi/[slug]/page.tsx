import Image from 'next/image';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

import Header from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import Advantages from '@/app/components/Advantages';
import type { Lang } from '@/app/i18n/dictionaries';
import { getDictionaryFromApi } from '@/lib/dictionary-api';
import { LOCALES, pageMetadata, pageUrl, SITE_URL } from '@/lib/seo';
import { getSiteSections } from '@/lib/site-content';
import { getServicePages, getServicePageSlugs } from '@/lib/service-pages';

/*
 * Страница одной услуги: /ru/uslugi/<slug>. Всё содержимое — из админки
 * («Страницы услуг»), подписи шаблона — из словаря (servicePage).
 * Пустые разделы (что входит, фото, вопросы) просто не выводятся.
 */

// Клиентские секции — отдельными чанками, как на главной
const PortfolioGallery = dynamic(
  () => import('@/app/components/PortfolioGallery'),
);
const Reviews = dynamic(() => import('@/app/components/Reviews'));
const SocialWidget = dynamic(() => import('@/app/components/SocialWidget'));

const WHATSAPP = '996709058182';
const PHONE = '+996559554225';

// Страницы, созданные в админке после сборки, открываются без пересборки сайта
export const dynamicParams = true;

type Props = { params: Promise<{ lang: Lang; slug: string }> };

export async function generateStaticParams() {
  const slugs = await getServicePageSlugs();
  return slugs.map((slug) => ({ slug }));
}

async function loadPage(lang: Lang, slug: string) {
  // Язык проверяем сами: здесь dynamicParams = true, и Next пропустит любой
  // первый сегмент (middleware отсекает почти всё, кроме адресов с точкой)
  if (!LOCALES.includes(lang)) notFound();
  const pages = await getServicePages(lang);
  // API недоступен: ошибка, а не 404. Тогда Next продолжит отдавать прежнюю
  // версию страницы из кэша, и Google не решит, что страница удалена.
  if (pages === null) throw new Error('Страницы услуг недоступны');
  const page = pages.find((p) => p.slug === slug);
  if (!page) notFound();
  return { page, others: pages.filter((p) => p.slug !== slug) };
}

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  const { page } = await loadPage(lang, slug);
  return pageMetadata({
    lang,
    path: page.path,
    title: page.seoTitle,
    description: page.seoDescription,
    image: page.image,
  });
}

function Fact({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className='flex gap-4'>
      <div className='w-11 h-11 rounded-full bg-primary/10 text-primary grid place-items-center shrink-0'>
        <Icon size={20} aria-hidden='true' />
      </div>
      <div className='min-w-0'>
        <dt className='text-sm text-gray-500'>{label}</dt>
        <dd className='text-lg font-bold text-gray-900 leading-snug'>{value}</dd>
        {note && <dd className='text-xs text-gray-500 mt-1'>{note}</dd>}
      </div>
    </div>
  );
}

export default async function ServicePage({ params }: Props) {
  const { lang, slug } = await params;
  const [t, { page, others }] = await Promise.all([
    getDictionaryFromApi(lang),
    loadPage(lang, slug),
  ]);
  // Отзывы — общие для всего сайта (раздел «Отзывы» в админке)
  const sections = await getSiteSections(lang, t);
  const s = t.servicePage;

  const url = pageUrl(lang, page.path);
  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    s.whatsappText + page.name,
  )}`;

  // Разметка для Google: услуга, «хлебные крошки», вопросы и ответы
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: page.name,
        serviceType: page.name,
        description: page.seoDescription,
        url,
        ...(page.image ? { image: page.image } : {}),
        areaServed: [
          { '@type': 'City', name: 'Бишкек' },
          {
            '@type': 'AdministrativeArea',
            name: lang === 'ky' ? 'Чүй облусу' : 'Чуйская область',
          },
        ],
        provider: {
          '@type': 'LocalBusiness',
          name: 'Таза Айым',
          url: SITE_URL,
          telephone: PHONE,
          image: `${SITE_URL}/logo.png`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Бишкек',
            addressCountry: 'KG',
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: s.home, item: pageUrl(lang) },
          { '@type': 'ListItem', position: 2, name: page.name, item: url },
        ],
      },
      ...(page.faq.length
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: page.faq.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <main className='min-h-screen pt-18.5'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <Header lang={lang} dict={t} path={page.path} />

      {/* 1. Первый экран: заголовок, кнопки и главное о цене и сроках.
          Без большой картинки: LCP здесь — заголовок, он рисуется сразу. */}
      <section className='bg-light'>
        <div className='container mx-auto px-4 pt-6 pb-14 md:pt-8 md:pb-20'>
          <nav aria-label='breadcrumb' className='text-sm text-gray-500 mb-8'>
            <ol className='flex flex-wrap items-center gap-2'>
              <li>
                <a href={`/${lang}`} className='hover:text-primary transition-colors'>
                  {s.home}
                </a>
              </li>
              <li aria-hidden='true'>/</li>
              <li aria-current='page' className='text-gray-700 font-medium'>
                {page.name}
              </li>
            </ol>
          </nav>

          <div className='grid lg:grid-cols-[minmax(0,1fr)_380px] gap-10 lg:gap-14 items-center'>
            <div>
              <h1 className='text-3xl md:text-5xl font-bold text-primary leading-[1.15] mb-6'>
                {page.title}
              </h1>
              {page.lead && (
                <p className='text-lg md:text-xl text-gray-600 leading-relaxed border-l-4 border-secondary pl-5 mb-10 max-w-2xl'>
                  {page.lead}
                </p>
              )}
              <div className='flex flex-col sm:flex-row gap-3'>
                <a
                  href={waLink}
                  target='_blank'
                  rel='noopener'
                  className='bg-primary hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full transition shadow-xl shadow-primary/30 inline-flex items-center justify-center gap-2'
                >
                  <MessageCircle size={20} aria-hidden='true' />
                  {s.ctaWhatsapp}
                </a>
                <a
                  href={`tel:${PHONE}`}
                  className='bg-white hover:bg-gray-50 text-primary border-2 border-primary font-bold py-4 px-8 rounded-full transition inline-flex items-center justify-center gap-2'
                >
                  <Phone size={20} aria-hidden='true' />
                  {s.ctaCall}
                </a>
              </div>
            </div>

            <aside className='bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8'>
              <dl className='flex flex-col gap-5'>
                {page.price && (
                  <Fact icon={Wallet} label={s.price} value={page.price} note={s.priceNote} />
                )}
                {page.duration && (
                  <Fact icon={Clock} label={s.duration} value={page.duration} />
                )}
                <Fact icon={MapPin} label={s.area} value={s.areaValue} />
                <Fact icon={Sparkles} label={s.chemicals} value={s.chemicalsValue} />
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* 2. Что входит */}
      {page.includes.length > 0 && (
        <section className='py-16 md:py-20 bg-white'>
          <div className='container mx-auto px-4 max-w-5xl'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10 md:mb-12'>
              {s.includesTitle}
            </h2>
            <ul className='grid sm:grid-cols-2 gap-4'>
              {page.includes.map((item, i) => (
                <li key={i} className='flex gap-3 items-start bg-light rounded-2xl p-5'>
                  <CheckCircle2
                    size={22}
                    className='text-primary shrink-0 mt-0.5'
                    aria-hidden='true'
                  />
                  <span className='text-gray-700 leading-relaxed'>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 3. Примеры «до и после», отмеченные для этой страницы */}
      <PortfolioGallery dict={t} cases={page.cases} />

      {/* 4. Подробный текст и фото */}
      {/* Фон чередуется: после серого блока «до и после» — белый, иначе серый */}
      {(page.paragraphs.length > 0 || page.image) && (
        <section
          className={`py-16 md:py-20 ${page.cases.length ? 'bg-white' : 'bg-light'}`}
        >
          <div
            className={`container mx-auto px-4 grid gap-10 lg:gap-14 items-start ${
              page.image ? 'lg:grid-cols-2' : 'max-w-3xl'
            }`}
          >
            <div>
              <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-8'>
                {s.aboutTitle}
              </h2>
              <div className='flex flex-col gap-5 text-gray-700 text-lg leading-relaxed'>
                {page.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            {page.image && (
              <div className='relative aspect-4/3 rounded-3xl overflow-hidden shadow-lg bg-light lg:sticky lg:top-28'>
                <Image
                  src={page.image}
                  alt={page.title}
                  fill
                  sizes='(max-width: 1024px) 100vw, 50vw'
                  className='object-cover'
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. Как мы работаем */}
      <section className='py-16 md:py-20 bg-white'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10 md:mb-12'>
            {s.stepsTitle}
          </h2>
          <ol className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {s.steps.map((step: { title: string; desc: string }, i: number) => (
              // На телефоне номер слева от текста, с sm — над ним
              <li key={i} className='bg-light rounded-2xl p-5 sm:p-6 flex gap-4 items-start sm:block'>
                <span className='w-11 h-11 rounded-full bg-primary text-white font-bold grid place-items-center shrink-0 sm:mb-4'>
                  {i + 1}
                </span>
                <div>
                  <h3 className='text-lg font-bold text-gray-900 mb-1 sm:mb-2'>{step.title}</h3>
                  <p className='text-gray-600 leading-relaxed'>{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Advantages t={t} />
      <Reviews dict={t} items={sections.reviews} />

      {/* 6. Вопросы и ответы */}
      {page.faq.length > 0 && (
        <section className='py-16 md:py-20 bg-light' id='faq'>
          <div className='container mx-auto px-4 max-w-3xl'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10 md:mb-12'>
              {s.faqTitle}
            </h2>
            <div className='flex flex-col gap-3'>
              {page.faq.map((f, i) => (
                <details
                  key={i}
                  className='group bg-white rounded-2xl border border-gray-100 shadow-sm'
                >
                  <summary className='flex items-center justify-between gap-4 cursor-pointer list-none p-5 md:p-6 font-bold text-gray-900 [&::-webkit-details-marker]:hidden'>
                    {f.question}
                    <ChevronDown
                      size={22}
                      className='shrink-0 text-primary transition-transform group-open:rotate-180'
                      aria-hidden='true'
                    />
                  </summary>
                  <p className='px-5 md:px-6 pb-6 text-gray-600 leading-relaxed'>
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Призыв */}
      <section className='py-16 bg-primary text-white text-center'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>{s.ctaTitle}</h2>
          <p className='text-white/80 text-lg mb-8 max-w-2xl mx-auto'>{s.ctaDesc}</p>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <a
              href={waLink}
              target='_blank'
              rel='noopener'
              className='bg-white text-primary font-bold py-4 px-10 rounded-full hover:bg-secondary hover:text-white transition shadow-xl inline-flex items-center justify-center gap-2'
            >
              <MessageCircle size={20} aria-hidden='true' />
              {s.ctaWhatsapp}
            </a>
            <a
              href={`/${lang}/prices`}
              className='border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white hover:text-primary transition inline-flex items-center justify-center gap-2'
            >
              {s.ctaCalculator}
              <ArrowRight size={20} aria-hidden='true' />
            </a>
          </div>
        </div>
      </section>

      {/* 8. Другие страницы услуг — перелинковка для Google */}
      {others.length > 0 && (
        <section className='py-16 bg-white'>
          <div className='container mx-auto px-4'>
            <h2 className='text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10'>
              {s.otherTitle}
            </h2>
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {others.map((o) => (
                <a
                  key={o.slug}
                  href={`/${lang}${o.path}`}
                  className='group flex items-center justify-between gap-4 bg-light rounded-2xl p-6 hover:shadow-md transition'
                >
                  <span>
                    <span className='block font-bold text-primary text-lg'>{o.name}</span>
                    {o.price && (
                      <span className='block text-sm text-gray-500 mt-1'>{o.price}</span>
                    )}
                  </span>
                  <ArrowRight
                    size={22}
                    className='text-primary shrink-0 transition-transform group-hover:translate-x-1'
                    aria-hidden='true'
                  />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer dict={t} />
      <SocialWidget />
    </main>
  );
}
