import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['ky', 'ru'];
const defaultLocale = 'ky';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

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

  // Если языка нет, редиректим на дефолтный (ky)
  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url),
    );
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
