import type { MetadataRoute } from 'next';
import { LOCALES, languageAlternates, pageUrl } from '@/lib/seo';
import { getServicePageSlugs, servicePagePath } from '@/lib/service-pages';

// Пути страниц без языка. Новую страницу добавляйте сюда.
const PATHS = ['', '/prices'];

// Все страницы на всех языках + hreflang-альтернативы.
// Страницы услуг (/uslugi/...) берутся из админки: новая страница попадёт
// сюда сама, как только её опубликуют.
// lastModified не указываем: new Date() на каждый запрос Google считает
// недостоверным и всё равно игнорирует.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const servicePaths = (await getServicePageSlugs()).map(servicePagePath);

  return [...PATHS, ...servicePaths].flatMap((path) =>
    LOCALES.map((lang) => ({
      url: pageUrl(lang, path),
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
