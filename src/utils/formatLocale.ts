import type { LocaleCode } from '../locales'
import { LOCALE_TAGS } from '../locales'
import type { CategoryId } from '../types'

/** BCP 47 tag for the active app language. */
export function getLocaleTag(locale: LocaleCode): string {
  return LOCALE_TAGS[locale] ?? 'en-US'
}

/** Conversion results show up to 2 decimal places. */
const RESULT_MAX_FRACTION_DIGITS = 2

/**
 * Format a number for display only — does not change the stored numeric value.
 * Uses Intl.NumberFormat with the active locale (en-US, ja-JP, es-ES, …).
 */
export function formatLocaleNumber(
  value: number,
  locale: LocaleCode,
  maximumFractionDigits = RESULT_MAX_FRACTION_DIGITS,
): string {
  if (!Number.isFinite(value)) return '-'

  const digits = Math.max(0, maximumFractionDigits)
  const factor = 10 ** digits
  const rounded =
    digits === 0
      ? Math.round(value)
      : Math.round(value * factor) / factor

  return new Intl.NumberFormat(getLocaleTag(locale), {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
    useGrouping: true,
  }).format(rounded)
}

/** Format a conversion result for the current locale (max 2 decimals). */
export function formatConversionNumber(
  value: number,
  _categoryId: CategoryId,
  _unitId: string,
  locale: LocaleCode,
): string {
  return formatLocaleNumber(value, locale, RESULT_MAX_FRACTION_DIGITS)
}

/** Format amount input (raw string → number) for list display. */
export function formatAmountForDisplay(
  amountText: string,
  locale: LocaleCode,
): string {
  const cleaned = amountText.replace(/,/g, '').trim()
  if (!cleaned) return amountText

  const parsed = Number.parseFloat(cleaned)
  if (!Number.isFinite(parsed)) return amountText

  return formatLocaleNumber(parsed, locale, RESULT_MAX_FRACTION_DIGITS)
}

/**
 * Locale-aware date/time for rate update labels.
 * Label text (Updated / 환율 업데이트 / …) stays in translations.
 */
export function formatLocaleDateTime(
  timestamp: number,
  locale: LocaleCode,
): string {
  const tag = getLocaleTag(locale)

  return new Intl.DateTimeFormat(tag, {
    year: 'numeric',
    month: locale === 'en' ? 'short' : 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(timestamp))
}
