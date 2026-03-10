import { getLocales } from 'expo-localization';

import type { AppLanguage } from '@/i18n';
import { el as elLocale, enUS } from 'date-fns/locale';

export const DEFAULT_LANGUAGE: AppLanguage = 'en';

const SUPPORTED_LANGUAGES: ReadonlySet<AppLanguage> = new Set<AppLanguage>(['en', 'el']);

export function getDeviceLanguageTag(): string {
  return getLocales()[0]?.languageTag ?? 'en-US';
}

export function toSupportedLanguage(languageTag?: string | null): AppLanguage {
  if (!languageTag) return DEFAULT_LANGUAGE;

  const [languageCode] = languageTag.toLowerCase().split('-');
  if (SUPPORTED_LANGUAGES.has(languageCode as AppLanguage)) {
    return languageCode as AppLanguage;
  }

  return DEFAULT_LANGUAGE;
}

export function getIntlLocale(languageTag?: string | null): string {
  const language = toSupportedLanguage(languageTag);
  if (language === 'el') return 'el-GR';
  return 'en-US';
}

export function getDateFnsLocale(languageTag?: string | null) {
  const language = toSupportedLanguage(languageTag);
  return language === 'el' ? elLocale : enUS;
}
