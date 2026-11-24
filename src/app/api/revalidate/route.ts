import { timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { CONTENT_TAG, TRANSLATIONS_TAG } from '@/lib/api';

/*
 * Мгновенное обновление сайта после правок в админке.
 *
 * Бэкенд (content/signals.py) после сохранения/удаления контента делает
 * POST /api/revalidate с заголовком x-revalidate-secret. Секрет общий:
 * переменная REVALIDATE_SECRET в /etc/taza-ayim.env (фронт) и в .env
 * бэкенда. Без этого правки появятся сами в течение ~минуты (ISR).
 */

function secretMatches(given: string, expected: string) {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET;
  const given = request.headers.get('x-revalidate-secret') ?? '';
  if (!expected || !secretMatches(given, expected)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  // 'max' = stale-while-revalidate: следующий запрос получит прежнюю версию
  // и запустит пересборку в фоне. Бэкенд сразу после этого сам открывает
  // страницы сайта (content/signals.py), поэтому к приходу посетителя они
  // уже свежие. Страницы, которые использовали эти данные, сбрасываются
  // вместе с тегом.
  //
  // НЕ использовать { expire: 0 } и revalidatePath('/[lang]'): при
  // dynamicParams = false Next 16 после них отдаёт 404 на /ru и /ky
  // (NoFallbackError) — проверено.
  revalidateTag(CONTENT_TAG, 'max');
  revalidateTag(TRANSLATIONS_TAG, 'max');

  return Response.json({ ok: true });
}
