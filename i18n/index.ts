import { el } from '@/i18n/el';
import { en } from '@/i18n/en';

export const resources = {
  en,
  el,
} as const;

export type AppLanguage = keyof typeof resources;
