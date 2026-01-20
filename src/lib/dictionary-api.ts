import {
  dictionaries as defaultDictionaries,
  Dictionary,
  Lang,
} from '@/app/i18n/dictionaries';

const API_URL = 'https://clinning.sino0on.ru/api/items/';
const IGNORED_KEYS = ['value_ru', 'created_at', 'updated_at', 'id'];

type ApiItem = {
  value_ru: string;
  created_at: string;
  updated_at: string;
  [key: string]: string;
};

// Исправляем any в setNestedValue
// Мы используем Record<string, any>, так как структура словаря сложная и вложенная
function setNestedValue(obj: Record<string, any>, path: string, value: string) {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (i === keys.length - 1) {
      current[key] = value;
    } else {
      // Если ключа нет или это не объект, создаем новый объект
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
  }
}

export async function getDictionaryFromApi(lang: Lang): Promise<Dictionary> {
  try {
    const res = await fetch(API_URL, { next: { revalidate: 60 } });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const items: ApiItem[] = await res.json();

    // 1. Создаем глубокую копию.
    // JSON.parse/stringify возвращает any, поэтому сразу кастуем к Dictionary
    // Но так как мы будем его менять, приводим к "расширенному" типу, чтобы TS не ругался на запись
    const dictCopy = JSON.parse(JSON.stringify(defaultDictionaries[lang]));

    // 2. Обновляем значения
    items.forEach((item) => {
      const dictionaryKey = Object.keys(item).find(
        (key) => !IGNORED_KEYS.includes(key),
      );

      if (dictionaryKey) {
        let value = '';

        if (lang === 'ru') {
          value = item[dictionaryKey];
        } else if (lang === 'ky') {
          value = item.value_ru;
        }

        if (value) {
          setNestedValue(dictCopy, dictionaryKey, value);
        }
      }
    });

    // 3. Возвращаем как Dictionary
    // Здесь используем 'as unknown as Dictionary', чтобы "заткнуть" TypeScript,
    // если типы строгих литералов все еще конфликтуют. Это безопасно здесь.
    return dictCopy as unknown as Dictionary;
  } catch (error) {
    console.error('Ошибка получения данных с API:', error);
    return defaultDictionaries[lang] as unknown as Dictionary;
  }
}
