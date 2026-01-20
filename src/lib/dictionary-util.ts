import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import {
  dictionaries as defaultDictionaries,
  Lang,
} from '@/app/i18n/dictionaries';

// Путь к файлу
const EXCEL_PATH = path.join(process.cwd(), 'public', 'translations.xlsx');

type ExcelRow = {
  key: string;
  ru: string;
  ky: string;
};

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

export async function getDictionaryFromExcel(lang: Lang) {
  try {
    // 1. Проверяем, существует ли файл
    if (!fs.existsSync(EXCEL_PATH)) {
      console.warn(`Excel файл не найден по пути: ${EXCEL_PATH}`);
      return defaultDictionaries[lang];
    }

    // 2. Читаем файл через fs (Это надежнее на Windows)
    const fileBuffer = fs.readFileSync(EXCEL_PATH);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // 3. Превращаем в JSON
    const rows: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);

    // 4. Собираем структуру
    const newDict: any = {};

    rows.forEach((row) => {
      // Проверяем, есть ли перевод для нужного языка
      if (row.key && row[lang]) {
        // row[lang] берет значение из колонки 'ru' или 'ky'
        setNestedValue(newDict, row.key, String(row[lang]));
      }
    });

    // 5. Мержим с дефолтным (чтобы не ломалось, если в Excel чего-то нет)
    // Используем простой spread, но для глубокой вложенности лучше lodash.merge
    // Здесь упрощенный вариант:
    return { ...defaultDictionaries[lang], ...newDict };
  } catch (error) {
    console.error('Ошибка чтения Excel:', error);
    return defaultDictionaries[lang];
  }
}
