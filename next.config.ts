import type { NextConfig } from 'next';

// Файлы из public/ не хэшируются, поэтому не immutable, а 30 дней + SWR.
// Если меняете картинку или видео — кладите под новым именем.
const PUBLIC_ASSET_CACHE = 'public, max-age=2592000, stale-while-revalidate=86400';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: true,
  // experimental.inlineCss проверяли — хуже: Next кладёт CSS в HTML дважды
  // (<style> + RSC-payload), HTML растёт 25 → 44 КБ gzip, мобильный FCP/SI хуже.
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      // Фото в блоке «Услуги» пока берутся с чужих сайтов — лучше заменить своими.
      {
        protocol: 'https',
        hostname: 'service-cleaning.ru',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cleaning54.ru',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'expert-cleaning.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:all*(jpg|jpeg|png|webp|avif|svg|ico|mp4|webm)',
        headers: [{ key: 'Cache-Control', value: PUBLIC_ASSET_CACHE }],
      },
    ];
  },
};

export default nextConfig;
