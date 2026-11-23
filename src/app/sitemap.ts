import type { MetadataRoute } from 'next';
import { LOCALES, languageAlternates, pageUrl } from '@/lib/seo';

// Пути страниц без языка. Новую страницу добавляйте сюда.
const PATHS = ['', '/prices'];

// Все страницы на всех языках + hreflang-альтернативы.
// lastModified не указываем: new Date() на каждый запрос Google считает
// недостоверным и всё равно игнорирует.
export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    LOCALES.map((lang) => ({
      url: pageUrl(lang, path),
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
