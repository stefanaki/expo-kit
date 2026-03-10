import i18n from '@/config/i18n';
import { getIntlLocale } from '@/lib/locale/utils';

function resolveLocale(locale?: string): string {
  return getIntlLocale(locale ?? i18n.resolvedLanguage);
}

export function formatCurrency(
  value: number,
  currency = 'EUR',
  locale?: string,
  options?: Omit<Intl.NumberFormatOptions, 'currency' | 'style'>
): string {
  return new Intl.NumberFormat(resolveLocale(locale), {
    style: 'currency',
    currency,
    ...options,
  }).format(value);
}

export function formatNumber(
  value: number,
  locale?: string,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(resolveLocale(locale), options).format(value);
}

export function formatPercentage(
  value: number,
  locale?: string,
  options?: Omit<Intl.NumberFormatOptions, 'style'>
): string {
  return new Intl.NumberFormat(resolveLocale(locale), {
    style: 'percent',
    ...options,
  }).format(value);
}

export function truncate(value: string, maxLength: number, suffix = '...'): string {
  if (value.length <= maxLength) return value;
  const safeLength = Math.max(0, maxLength - suffix.length);
  return `${value.slice(0, safeLength)}${suffix}`;
}
