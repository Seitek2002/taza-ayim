import type { StaticImageData } from 'next/image';
import type { Lang } from '@/app/i18n/dictionaries';
import { API_ORIGIN, API_TIMEOUT_MS, CONTENT_TAG } from './api';

import poolBefore from '@/assets/portfolio/pool-before.jpg';
import poolAfter from '@/assets/portfolio/pool-after.jpg';
import officeBefore from '@/assets/portfolio/office-before.jpg';
import officeAfter from '@/assets/portfolio/office-after.jpg';
import flatBefore from '@/assets/portfolio/flat-before.jpg';
import flatAfter from '@/assets/portfolio/flat-after.jpg';
import poster1 from '@/assets/posters/review-1.jpg';
import poster2 from '@/assets/posters/review-2.jpg';
import poster3 from '@/assets/posters/review-3.jpg';
import maintenanceImage from '@/assets/services/maintenance.jpg';

/*
 * Контент, который заказчица редактирует в админке (отзывы, до/после,
 * услуги, партнёры, бренды). Берётся с бэкенда одним запросом
 * GET /api/content/. Если бэкенд недоступен, показывается встроенный
 * контент ниже (тот, что был на сайте до админки), и сайт не ломается.
 * Если раздел в админке пуст или всё скрыто, раздел на сайте не выводится.
 */

// ---------- Ответ API ----------

type ApiReview = {
  id: number;
  kind: 'photo' | 'video';
  file: string;
  poster: string | null;
  caption_ru: string;
  caption_ky: string;
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
type ApiService = {
  id: number;
  title_ru: string;
  title_ky: string;
  duration_ru: string;
  duration_ky: string;
  description_ru: string;
  description_ky: string;
  image: string | null;
  /** Адрес страницы услуги (/uslugi/<page>), если она есть и опубликована */
  page?: string | null;
};
type ApiPartner = { id: number; name: string; logo: string; link: string };
type ApiBrand = {
  id: number;
  name: string;
  country: string;
  country_ru: string;
  country_ky: string;
  logo: string;
  description_ru: string;
  description_ky: string;
};
type ApiContent = {
  reviews: ApiReview[];
  beforeAfter: ApiBeforeAfter[];
  services: ApiService[];
  partners: ApiPartner[];
  brands: ApiBrand[];
};

// ---------- То, что получают компоненты (уже на нужном языке) ----------

type Img = string | StaticImageData;

export type ReviewView = {
  key: string;
  kind: 'photo' | 'video';
  src: string;
  poster: Img | null;
  alt: string;
};
export type CaseView = {
  id: string;
  title: string;
  desc: string;
  before: Img;
  after: Img;
};
export type ServiceView = {
  id: string;
  title: string;
  time: string;
  desc: string;
  image: Img | null;
  /** Ссылка на отдельную страницу услуги (кнопка «Подробнее») */
  href: string | null;
};
export type PartnerView = { id: string; name: string; logo: string; link: string };
export type BrandView = {
  id: string;
  name: string;
  country: string;
  countryLabel: string;
  logo: string;
  desc: string;
};

export type SiteSections = {
  reviews: ReviewView[];
  cases: CaseView[];
  services: ServiceView[];
  partners: PartnerView[];
  brands: BrandView[];
};

// Временные картинки услуг, пока в админке нет своих фото (по порядку)
// TODO: три из них — с чужих сайтов; заменить своими фото в админке.
const SERVICE_PLACEHOLDERS: Img[] = [
  'https://service-cleaning.ru/wp-content/uploads/2021/01/general-ub-600.jpg',
  maintenanceImage,
  'https://cleaning54.ru/wp-content/uploads/2021/12/myte-okon-akciya-cleaning54.jpg',
  'https://expert-cleaning.com/wp-content/uploads/2023/04/posle-remonta.jpg',
];

async function fetchContent(): Promise<ApiContent | null> {
  try {
    const res = await fetch(`${API_ORIGIN}/api/content/`, {
      next: { revalidate: 60, tags: [CONTENT_TAG] },
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`API returned status ${res.status}`);
    return (await res.json()) as ApiContent;
  } catch (error) {
    console.error('Контент из админки недоступен, показываю встроенный:', error);
    return null;
  }
}

/** Текст на нужном языке; если кыргызского нет, показываем русский. */
const pick = (lang: Lang, ru: string, ky: string) => (lang === 'ky' && ky ? ky : ru);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getSiteSections(lang: Lang, t: any): Promise<SiteSections> {
  const api = await fetchContent();
  if (!api) return fallbackSections(lang, t);

  const reviewWord = lang === 'ky' ? 'Кардардын пикири' : 'Отзыв клиента';
  return {
    reviews: api.reviews.map((r, i) => ({
      key: String(r.id),
      kind: r.kind,
      src: r.file,
      poster: r.poster,
      alt: pick(lang, r.caption_ru, r.caption_ky) || `${reviewWord} ${i + 1}`,
    })),
    cases: api.beforeAfter.map((c) => ({
      id: String(c.id),
      title: pick(lang, c.title_ru, c.title_ky),
      desc: pick(lang, c.description_ru, c.description_ky),
      before: c.before,
      after: c.after,
    })),
    services: api.services.map((s, i) => ({
      id: String(s.id),
      title: pick(lang, s.title_ru, s.title_ky),
      time: pick(lang, s.duration_ru, s.duration_ky),
      desc: pick(lang, s.description_ru, s.description_ky),
      image: s.image ?? SERVICE_PLACEHOLDERS[i] ?? null,
      href: s.page ? `/${lang}/uslugi/${s.page}` : null,
    })),
    partners: api.partners.map((p) => ({
      id: String(p.id),
      name: p.name,
      logo: p.logo,
      link: p.link,
    })),
    brands: api.brands.map((b) => ({
      id: String(b.id),
      name: b.name,
      country: b.country,
      countryLabel: pick(lang, b.country_ru, b.country_ky),
      logo: b.logo,
      desc: pick(lang, b.description_ru, b.description_ky),
    })),
  };
}

// ---------- Встроенный контент (если API недоступен) ----------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fallbackSections(lang: Lang, t: any): SiteSections {
  const reviewWord = lang === 'ky' ? 'Кардардын пикири' : 'Отзыв клиента';
  const reviewFiles: [string, string, StaticImageData | null][] = [
    ['photo', '/reviews/item-1.jpg', null],
    ['photo', '/reviews/item-2.jpg', null],
    ['video', '/reviews/review-1.mp4', poster1],
    ['video', '/reviews/review-2.mp4', poster2],
    ['video', '/reviews/review-3.mp4', poster3],
    ['photo', '/reviews/item-3.jpg', null],
    ['photo', '/reviews/item-4.jpg', null],
  ];
  const cases: [string, StaticImageData, StaticImageData][] = [
    ['1', poolBefore, poolAfter],
    ['2', officeBefore, officeAfter],
    ['3', flatBefore, flatAfter],
  ];
  const brands: [string, string, string, string][] = [
    ['buzil', 'Buzil', 'Germany', '/brands/buzil.png'],
    ['kiehl', 'Johannes KIEHL', 'Germany', '/brands/kiehl.png'],
    ['grass', 'GRASS', 'Russia', '/brands/grass.jpg'],
  ];

  return {
    reviews: reviewFiles.map(([kind, src, poster], i) => ({
      key: src,
      kind: kind as 'photo' | 'video',
      src,
      poster,
      alt: `${reviewWord} ${i + 1}`,
    })),
    cases: cases.map(([n, before, after]) => ({
      id: n,
      title: t?.portfolio?.cases?.[n]?.title ?? '',
      desc: t?.portfolio?.cases?.[n]?.desc ?? '',
      before,
      after,
    })),
    services: ['1', '2', '3', '4'].map((n, i) => ({
      id: n,
      title: t?.services?.items?.[n]?.title ?? '',
      time: t?.services?.items?.[n]?.time ?? '',
      desc: t?.services?.items?.[n]?.desc ?? '',
      image: SERVICE_PLACEHOLDERS[i],
      href: null,
    })),
    partners: [
      ['Sun Planet Organic', '/partners/sun-planet-organic.png', 'https://sunplanetorganic.com/'],
      ['Вавилон', '/partners/vavilon.jpg', 'https://www.instagram.com/vavilon_eventhall'],
      ['Алтын Булак', '/partners/алтын-булак-пансионат.jpg', 'https://www.instagram.com/altyn.bulak.kg'],
      ['Монарх Чайхана', '/partners/Монарх-Чайхана.jpg', 'https://www.instagram.com/monarch_resto'],
      ['Armada', '/partners/armada.jpg', 'https://www.instagram.com/armada.kg312'],
    ].map(([name, logo, link]) => ({ id: name, name, logo, link })),
    brands: brands.map(([key, name, country, logo]) => ({
      id: key,
      name,
      country,
      countryLabel: t?.chemicals?.countries?.[country] ?? country,
      logo,
      desc: t?.chemicals?.[key]?.desc ?? '',
    })),
  };
}
