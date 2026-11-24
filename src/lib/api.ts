// Бэкенд (Django): тексты сайта и контент из админки
export const API_ORIGIN = 'https://clinning.sino0on.com';

// Теги кэша: по ним /api/revalidate мгновенно сбрасывает данные после
// правок в админке (иначе они обновятся сами в течение ~минуты).
export const TRANSLATIONS_TAG = 'translations';
export const CONTENT_TAG = 'site-content';

// Если API тормозит, не держим рендер страницы, берём встроенные данные
export const API_TIMEOUT_MS = 5000;
