// app/layout.tsx
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-montserrat', // Важно! Это имя должно совпадать с тем, что в CSS
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Таза Айым - Клининговая компания',
  description: 'Профессиональная уборка в Бишкеке',
  icons: {
    icon: '/logo.svg',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ru'>
      <body className={`${montserrat.variable} antialiased`}>{children}</body>
    </html>
  );
}
