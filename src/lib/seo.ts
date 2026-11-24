import type { Metadata } from 'next';
import type { Lang } from '@/app/i18n/dictionaries';

export const SITE_URL = 'https://taza-ayim.kg';
export const LOCALES: readonly Lang[] = ['ky', 'ru'];
// Корень сайта редиректит на /ky (см. middleware.ts)
export const DEFAULT_LOCALE: Lang = 'ky';

/** Абсолютный URL страницы. path: '' — главная, '/prices' — цены. */
export const pageUrl = (lang: Lang, path = '') => `${SITE_URL}/${lang}${path}`;

/** hreflang-альтернативы страницы на всех языках + x-default. */
export const languageAlternates = (path = '') => ({
  ru: pageUrl('ru', path),
  ky: pageUrl('ky', path),
  'x-default': pageUrl(DEFAULT_LOCALE, path),
});

/**
 * canonical, hreflang и Open Graph для конкретной страницы.
 *
 * Важно задавать это на уровне страницы, а не layout: раньше canonical жил в
 * layout и наследовался, из-за чего /ru/prices объявляла себя копией /ru —
 * и Google её не индексировал.
 */
export function pageMetadata({
  lang,
  path = '',
  title,
  description,
  image,
}: {
  lang: Lang;
  path?: string;
  title: string;
  description: string;
  /** Своя картинка для превью в соцсетях (полный URL); по умолчанию og-image.jpg */
  image?: string | null;
}): Metadata {
  const url = pageUrl(lang, path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Таза Айым',
      images: image
        ? [{ url: image, alt: title }]
        : [
            {
              url: '/og-image.jpg',
              width: 1200,
              height: 630,
              alt: 'Таза Айым — клининговая компания в Бишкеке',
            },
          ],
      locale: lang === 'ru' ? 'ru_RU' : 'ky_KG',
      type: 'website',
    },
  };
}
