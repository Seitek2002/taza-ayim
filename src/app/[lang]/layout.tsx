import type { Metadata } from 'next';
import './globals.css'; // Проверь количество '../', чтобы дойти до globals.css
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Таза Айым',
  description: 'Клининговая компания',
};

// Генерируем статические параметры для билда
export async function generateStaticParams() {
  return [{ lang: 'ky' }, { lang: 'ru' }];
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang} className='scroll-smooth'>
      <body
        className={`${montserrat.variable} font-sans text-gray-800 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
