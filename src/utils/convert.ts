import type { CategoryId } from '../types'
import { LENGTH_TO_METERS, WEIGHT_TO_KG } from '../data/units'
import {
  convertWithRates,
  type UsdRates,
} from '../services/exchangeRate'
import { formatConversionNumber } from './formatLocale'
import type { LocaleCode } from '../locales'

export function parseAmount(value: string): number | null {
  const cleaned = value.replace(/,/g, '').trim()
  if (!cleaned) return null

  const parsed = Number.parseFloat(cleaned)
  return Number.isFinite(parsed) ? parsed : null
}

function convertByFactor(
  amount: number,
  fromId: string,
  toId: string,
  factors: Record<string, number>,
): number | null {
  const fromFactor = factors[fromId]
  const toFactor = factors[toId]
  if (!fromFactor || !toFactor) return null

  const baseValue = amount * fromFactor
  return baseValue / toFactor
}

export function convert(
  categoryId: CategoryId,
  amount: number,
  fromId: string,
  toId: string,
  currencyRates?: UsdRates | null,
): number | null {
  if (fromId === toId) return amount

  switch (categoryId) {
    case 'currency':
      return convertWithRates(amount, fromId, toId, currencyRates)
    case 'length':
      return convertByFactor(amount, fromId, toId, LENGTH_TO_METERS)
    case 'weight':
      return convertByFactor(amount, fromId, toId, WEIGHT_TO_KG)
  }
}

/** Numeric conversion only — display formatting happens elsewhere. */
export function getConversionValue(
  categoryId: CategoryId,
  amountText: string,
  fromId: string,
  toId: string,
  currencyRates?: UsdRates | null,
): number | null {
  const amount = parseAmount(amountText)
  if (amount === null) return null

  return convert(categoryId, amount, fromId, toId, currencyRates)
}

/** Convenience: numeric convert + locale display string. */
export function getConversionResult(
  categoryId: CategoryId,
  amountText: string,
  fromId: string,
  toId: string,
  currencyRates: UsdRates | null | undefined,
  locale: LocaleCode,
): string {
  const value = getConversionValue(
    categoryId,
    amountText,
    fromId,
    toId,
    currencyRates,
  )
  if (value === null) return '-'
  return formatConversionNumber(value, categoryId, toId, locale)
}
