import { format, formatDistanceToNow, formatRelative, isValid, parseISO } from 'date-fns';

import i18n from '@/config/i18n';
import { getDateFnsLocale } from '@/lib/locale/utils';

export const dateFormats = {
  shortDate: 'PPP',
  shortDateTime: 'PPp',
  isoDate: 'yyyy-MM-dd',
} as const;

export type DateInput = Date | string | number | null | undefined;

function toDate(value: DateInput): Date | null {
  if (value == null) return null;
  if (value instanceof Date) {
    return isValid(value) ? value : null;
  }
  if (typeof value === 'number') {
    const parsed = new Date(value);
    return isValid(parsed) ? parsed : null;
  }

  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
}

export function formatDate(
  value: DateInput,
  pattern: string = dateFormats.shortDate,
  languageTag = i18n.resolvedLanguage
): string {
  const parsed = toDate(value);
  if (!parsed) return '';
  return format(parsed, pattern, { locale: getDateFnsLocale(languageTag) });
}

export function formatRelativeTime(
  value: DateInput,
  languageTag = i18n.resolvedLanguage,
  now = new Date()
): string {
  const parsed = toDate(value);
  if (!parsed) return '';

  return formatDistanceToNow(parsed, {
    addSuffix: true,
    locale: getDateFnsLocale(languageTag),
    now,
  });
}

export function formatRelativeDate(
  value: DateInput,
  languageTag = i18n.resolvedLanguage,
  baseDate = new Date()
): string {
  const parsed = toDate(value);
  if (!parsed) return '';

  return formatRelative(parsed, baseDate, {
    locale: getDateFnsLocale(languageTag),
  });
}
