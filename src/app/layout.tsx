// app/layout.tsx
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import SeoClient from './components/SeoClient';

const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title:
    '«Таза Айым» клининг компаниясы — Профессионалдуу тазалоо Бишкекте жана Чүй облусунда',
  description:
    'Бизнес жана жеке кардарлар үчүн клининг: терезе/фасад жуу, курулуштан кийинки тазалоо, химтазалоо, бийиктиктеги иштер.',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ky'>
      <body className={`${montserrat.variable} antialiased`}>
        {/* Клиентский SEO с переводами */}
        <SeoClient />
        {children}
      </body>
    </html>
  );
}
