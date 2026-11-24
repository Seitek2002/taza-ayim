import type { Metadata } from 'next';
import './globals.css';
import { Montserrat } from 'next/font/google';
import { SITE_URL } from '@/lib/seo';

const seoDict = {
  ru: {
    title: 'Клининговая компания в Бишкеке - Таза Айым | Уборка и Химчистка',
    description:
      'Профессиональная уборка квартир, офисов и домов в Бишкеке. Химчистка мебели, мойка окон, уборка после ремонта. ⚡ Быстро, качественно, эко-средства.',
    keywords: [
      'клининг бишкек',
      'уборка квартир бишкек',
      'таза айым',
      'химчистка мебели',
      'уборка после ремонта',
      'клининговая компания',
    ],
  },
  ky: {
    title: 'Бишкектеги клининг кызматы — Таза Айым | Үй тазалоо',
    description:
      'Бишкек шаарында үйлөрдү, кеңселерди кесипкөй тазалоо. Эмеректерди химиялык тазалоо, терезе жуу, ремонттон кийинки тазалоо. ⚡ Тез жана сапаттуу.',
    keywords: [
      'клининг бишкек',
      'үй тазалоо',
      'таза айым',
      'килем жуу',
      'ремонттон кийин тазалоо',
      'клининг кызматы',
    ],
  },
};

const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

// dynamicParams = false (только /ky и /ru) задан в самих страницах (главная,
// цены), а не здесь: Next применяет его ко всем вложенным маршрутам, и тогда
// страницы услуг, созданные в админке после сборки, отдавали бы 404.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: 'ru' | 'ky' }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = seoDict[lang] || seoDict.ru;

  return {
    // Без metadataBase относительный og:image резолвится в localhost
    metadataBase: new URL(SITE_URL),
    title: dict.title,
    description: dict.description,
    keywords: dict.keywords,
    // Важно для роботов: говорим, кто автор и где мы находимся
    authors: [{ name: 'Taza Ayim Cleaning' }],
    creator: 'Taza Ayim',
    publisher: 'Taza Ayim',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    // Иконки — файлы src/app/icon.png (96px) и src/app/apple-icon.png (180px).
    // Раньше тут был /logo.png на 235 КБ, и браузер качал его дважды.
    //
    // canonical, hreflang и Open Graph здесь НЕ задаём: layout общий для всех
    // страниц, и его canonical наследовался страницей цен (/ru/prices → /ru),
    // из-за чего Google считал её копией главной. Теперь их задаёт каждая
    // страница сама через pageMetadata() из src/lib/seo.ts.
    verification: {
      google: 'EAilMGYlrmojAe2QBC-Oo__XPDxOWnu9sFBGGa-bRlM',
      // Не весь тег <meta...>, а только набор букв и цифр из атрибута content
    },
  };
}

export async function generateStaticParams() {
  return [{ lang: 'ky' }, { lang: 'ru' }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang} className='scroll-smooth'>
      <body
        className={`${montserrat.variable} font-sans text-gray-800 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
