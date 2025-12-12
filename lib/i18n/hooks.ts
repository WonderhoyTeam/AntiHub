import { useI18n } from './context';

export function useTranslation() {
  const { t, locale, setLocale } = useI18n();

  return {
    t,
    locale,
    setLocale,
  };
}
