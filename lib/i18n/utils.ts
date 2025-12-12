import type { Locale } from './types';

const LOCALE_STORAGE_KEY = 'antihub-locale';
const DEFAULT_LOCALE: Locale = 'zh';

/**
 * Detect user's preferred language from browser settings
 */
export function detectBrowserLanguage(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;

  const browserLang = navigator.language.toLowerCase();

  // Check if browser language starts with 'zh' (includes zh-CN, zh-TW, etc.)
  if (browserLang.startsWith('zh')) {
    return 'zh';
  }

  // Check if browser language starts with 'en'
  if (browserLang.startsWith('en')) {
    return 'en';
  }

  // Default to Chinese
  return DEFAULT_LOCALE;
}

/**
 * Get stored locale from localStorage
 */
export function getStoredLocale(): Locale | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === 'en' || stored === 'zh') {
      return stored;
    }
  } catch (error) {
    console.error('Failed to get stored locale:', error);
  }

  return null;
}

/**
 * Save locale to localStorage
 */
export function setStoredLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch (error) {
    console.error('Failed to store locale:', error);
  }
}

/**
 * Get initial locale: checks localStorage first, then browser, then default
 */
export function getInitialLocale(): Locale {
  const stored = getStoredLocale();
  if (stored) return stored;

  return detectBrowserLanguage();
}

/**
 * Get nested value from object using dot notation
 * e.g., get(obj, 'nav.dashboard') returns obj.nav.dashboard
 */
export function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path; // Return the key itself if not found
    }
  }

  return typeof result === 'string' ? result : path;
}
