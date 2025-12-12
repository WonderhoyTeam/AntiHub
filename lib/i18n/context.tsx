'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Locale, Translations } from './types';
import { getInitialLocale, setStoredLocale, getNestedValue } from './utils';
import zhTranslations from './locales/zh.json';
import enTranslations from './locales/en.json';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations: Record<Locale, Translations> = {
  zh: zhTranslations as Translations,
  en: enTranslations as Translations,
};

export function I18nProvider({ children }: { children: ReactNode }) {
  // Initialize locale immediately during render
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      return getInitialLocale();
    }
    return 'zh';
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setStoredLocale(newLocale);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = getNestedValue(translations[locale], key);

    // Replace placeholders like {{variable}} with actual values
    if (params) {
      Object.keys(params).forEach((param) => {
        translation = translation.replace(new RegExp(`{{${param}}}`, 'g'), String(params[param]));
      });
    }

    return translation;
  };

  // Don't render children on server to prevent hydration mismatch
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
