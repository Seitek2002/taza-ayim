import type { Metadata } from 'next';
import './globals.css';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Таза Айым',
  description: 'Клининговая компания',
  icons: {
    icon: '/logo.svg',
  }
};

export async function generateStaticParams() {
  return [{ lang: 'ky' }, { lang: 'ru' }];
}

// 1. Делаем компонент async
// 2. Тип params меняем на Promise
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // 3. Ждем параметры перед использованием
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
