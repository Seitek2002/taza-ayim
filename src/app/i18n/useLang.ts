'use client';

import { useEffect, useState } from 'react';
import type { Lang } from './dictionaries';

// Простой хук для чтения текущего языка и подписки на изменения
export function useCurrentLang(defaultLang: Lang = 'ky'): Lang {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lang') as Lang | null;
      if (saved === 'ru' || saved === 'ky') return saved;
    }
    return defaultLang;
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'lang') {
        const val = e.newValue as Lang | null;
        if (val === 'ru' || val === 'ky') setLang(val);
      }
    };
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent).detail as Lang | undefined;
      if (detail === 'ru' || detail === 'ky') setLang(detail);
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('lang-changed', onCustom as EventListener);
    // синхронизируем <html lang>
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('lang-changed', onCustom as EventListener);
    };
  }, [lang]);

  return lang;
}
