import {
  dictionaries as defaultDictionaries,
  Lang,
} from '@/app/i18n/dictionaries';

// Адрес твоего API
const API_URL = 'https://clinning.sino0on.ru/api/items/';

// Поля, которые не являются ключами перевода
const IGNORED_KEYS = ['value_ru', 'created_at', 'updated_at', 'id'];

// Тип данных с бекенда
type ApiItem = {
  value_ru: string; // Это Кыргызский перевод (судя по данным)
  created_at: string;
  updated_at: string;
  [key: string]: string; // Динамический ключ (например "hero.title")
};

// Функция для создания вложенности (hero.title -> { hero: { title: ... } })
function setNestedValue(obj: any, path: string, value: string) {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (i === keys.length - 1) {
      current[key] = value;
    } else {
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
  }
}

export async function getDictionaryFromApi(lang: Lang) {
  try {
    // 1. Делаем запрос к API
    // next: { revalidate: 60 } означает, что Next.js будет кэшировать ответ на 60 секунд.
    // Если заказчик обновит текст, изменения появятся через минуту.
    const res = await fetch(API_URL, { next: { revalidate: 60 } });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const items: ApiItem[] = await res.json();
    const newDict: any = {};

    // 2. Парсим каждый элемент массива
    items.forEach((item) => {
      // Ищем динамический ключ (тот, который не служебный)
      const dictionaryKey = Object.keys(item).find(
        (key) => !IGNORED_KEYS.includes(key),
      );

      if (dictionaryKey) {
        let value = '';

        if (lang === 'ru') {
          // Для русского берем значение самого динамического ключа
          // Пример: { "hero.title": "НАША ЦЕЛЬ" } -> берем "НАША ЦЕЛЬ"
          value = item[dictionaryKey];
        } else if (lang === 'ky') {
          // Для кыргызского берем поле value_ru (да, бек назвали странно, но там кырг. текст)
          value = item.value_ru;
        }

        // Записываем в объект
        if (value) {
          setNestedValue(newDict, dictionaryKey, value);
        }
      }
    });

    // 3. Объединяем с дефолтным словарем (страховка, если API упадет или там не будет каких-то ключей)
    // Глубокое слияние здесь упрощено (spread), но для продакшена лучше lodash.merge,
    // если структура сильно сложная. Пока хватит и так.
    return { ...defaultDictionaries[lang], ...newDict };
  } catch (error) {
    console.error('Ошибка получения данных с API:', error);
    // В случае ошибки возвращаем локальный файл, чтобы сайт не упал
    return defaultDictionaries[lang];
  }
}
