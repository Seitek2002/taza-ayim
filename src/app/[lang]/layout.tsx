import type { Metadata } from 'next';
import './globals.css';
import { Montserrat } from 'next/font/google';

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

// export const metadata: Metadata = {
//   title: 'Таза Айым',
//   description: 'Клининговая компания',
//   icons: {
//     icon: '/logo.svg',
//   },
// };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: 'ru' | 'ky' }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = seoDict[lang] || seoDict.ru;

  // Базовый URL вашего сайта (замени на реальный домен!)
  const baseUrl = 'https://taza-ayim.kg';

  return {
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
    // Иконки
    icons: {
      icon: '/logo.svg',
      shortcut: '/logo.svg',
      apple: '/logo.svg', // Лучше сделать png 180x180 для Apple
    },
    // Open Graph — это то, как ссылка выглядит в WhatsApp, Telegram, Facebook
    openGraph: {
      title: dict.title,
      description: dict.description,
      url: `${baseUrl}/${lang}`,
      siteName: 'Таза Айым Cleaning',
      images: [
        {
          url: '/og-image.jpg', // СДЕЛАЙ КАРТИНКУ 1200x630px и положи в public
          width: 1200,
          height: 630,
          alt: 'Таза Айым Клининг',
        },
      ],
      locale: lang === 'ru' ? 'ru_RU' : 'ky_KG',
      type: 'website',
    },
    // Альтернативные ссылки (очень важно для двух языков!)
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        ru: `${baseUrl}/ru`,
        ky: `${baseUrl}/ky`,
      },
    },
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
