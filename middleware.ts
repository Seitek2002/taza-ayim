import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['ky', 'ru'];
const defaultLocale = 'ky';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // www.taza-ayim.kg отдавал полную копию сайта (дубль для Google).
  // Склеиваем навсегда (301) на основной домен без www.
  // Лучше продублировать это редиректом в nginx — тогда и статика будет склеена.
  const host = request.headers.get('host') ?? '';
  if (host.startsWith('www.')) {
    return NextResponse.redirect(
      `https://${host.slice(4)}${pathname}${request.nextUrl.search}`,
      301,
    );
  }

  // Проверяем, есть ли язык в URL
  const pathnameIsMissingLocale = locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Игнорируем файлы (картинки, фавиконки, роботс) и системные папки
  if (
    pathname.includes('.') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')
  ) {
    return;
  }

  // Если языка нет, редиректим на дефолтный (ky).
  // Для корня — сразу на /ky, а не /ky/ (иначе второй редирект /ky/ → /ky).
  //
  // 308 (постоянный), а не 307 по умолчанию: при временном редиректе Google
  // индексировал сам корень «/» с содержимым /ky, а /ky считал его копией
  // (в Search Console: «Канонические версии, выбранные Google и пользователем,
  // не совпадают»). Если когда-нибудь появится выбор языка по Accept-Language,
  // редирект корня нужно будет вернуть на 302/307.
  if (pathnameIsMissingLocale) {
    const target = pathname === '/' ? '' : pathname;
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${target}`, request.url),
      308,
    );
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
