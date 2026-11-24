import { cache } from 'react';
import type { Lang } from '@/app/i18n/dictionaries';
import type { CaseView } from './site-content';
import { API_ORIGIN, API_TIMEOUT_MS, CONTENT_TAG } from './api';

/*
 * Страницы услуг (/ru/uslugi/<slug>), которые заказчица создаёт в админке
 * («Страницы услуг»). Берутся одним запросом GET /api/content/pages/ — там
 * только опубликованные. Кэш общий с остальным контентом: после правки в
 * админке бэкенд сбрасывает тег CONTENT_TAG, и страницы обновляются.
 */

type ApiFaq = {
  question_ru: string;
  answer_ru: string;
  question_ky: string;
  answer_ky: string;
};

type ApiBeforeAfter = {
  id: number;
  title_ru: string;
  title_ky: string;
  description_ru: string;
  description_ky: string;
  before: string;
  after: string;
};

type ApiServicePage = {
  id: number;
  slug: string;
  name_ru: string;
  name_ky: string;
  title_ru: string;
  title_ky: string;
  lead_ru: string;
  lead_ky: string;
  price_ru: string;
  price_ky: string;
  duration_ru: string;
  duration_ky: string;
  includes_ru: string;
  includes_ky: string;
  body_ru: string;
  body_ky: string;
  image: string | null;
  seo_title_ru: string;
  seo_title_ky: string;
  seo_description_ru: string;
  seo_description_ky: string;
  faq: ApiFaq[];
  beforeAfter: ApiBeforeAfter[];
  updated: string;
};

export type ServicePageView = {
  slug: string;
  path: string;
  name: string;
  title: string;
  lead: string;
  price: string;
  duration: string;
  includes: string[];
  paragraphs: string[];
  image: string | null;
  seoTitle: string;
  seoDescription: string;
  faq: { question: string; answer: string }[];
  cases: CaseView[];
};

/** Путь страницы без языка, например /uslugi/uborka-posle-stroyki */
export const servicePagePath = (slug: string) => `/uslugi/${slug}`;

/** Текст на нужном языке; если кыргызского нет, показываем русский. */
const pick = (lang: Lang, ru: string, ky: string) =>
  (lang === 'ky' && ky.trim() ? ky : ru).trim();

const lines = (text: string) =>
  text
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-•*–—\s]+/, '').trim())
    .filter(Boolean);

const paragraphs = (text: string) =>
  text
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.replace(/\s*\r?\n\s*/g, ' ').trim())
    .filter(Boolean);

// Один запрос на рендер, даже если страницу, метаданные и список
// «Другие услуги» собирают разные функции
const fetchPages = cache(async (): Promise<ApiServicePage[] | null> => {
  try {
    const res = await fetch(`${API_ORIGIN}/api/content/pages/`, {
      next: { revalidate: 60, tags: [CONTENT_TAG] },
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`API returned status ${res.status}`);
    return (await res.json()) as ApiServicePage[];
  } catch (error) {
    console.error('Страницы услуг недоступны:', error);
    return null;
  }
});

function toView(p: ApiServicePage, lang: Lang): ServicePageView {
  const title = pick(lang, p.title_ru, p.title_ky);
  const lead = pick(lang, p.lead_ru, p.lead_ky);
  return {
    slug: p.slug,
    path: servicePagePath(p.slug),
    name: pick(lang, p.name_ru, p.name_ky),
    title,
    lead,
    price: pick(lang, p.price_ru, p.price_ky),
    duration: pick(lang, p.duration_ru, p.duration_ky),
    includes: lines(pick(lang, p.includes_ru, p.includes_ky)),
    paragraphs: paragraphs(pick(lang, p.body_ru, p.body_ky)),
    image: p.image,
    seoTitle: pick(lang, p.seo_title_ru, p.seo_title_ky) || `${title} | Таза Айым`,
    seoDescription: pick(lang, p.seo_description_ru, p.seo_description_ky) || lead,
    faq: p.faq
      .map((f) => ({
        question: pick(lang, f.question_ru, f.question_ky),
        answer: pick(lang, f.answer_ru, f.answer_ky),
      }))
      .filter((f) => f.question && f.answer),
    cases: p.beforeAfter.map((c) => ({
      id: String(c.id),
      title: pick(lang, c.title_ru, c.title_ky),
      desc: pick(lang, c.description_ru, c.description_ky),
      before: c.before,
      after: c.after,
    })),
  };
}

/** Все опубликованные страницы услуг. null — если API недоступен. */
export async function getServicePages(lang: Lang): Promise<ServicePageView[] | null> {
  const pages = await fetchPages();
  return pages ? pages.map((p) => toView(p, lang)) : null;
}

/** Адреса всех опубликованных страниц (для sitemap и generateStaticParams). */
export async function getServicePageSlugs(): Promise<string[]> {
  const pages = await fetchPages();
  return pages ? pages.map((p) => p.slug) : [];
}
