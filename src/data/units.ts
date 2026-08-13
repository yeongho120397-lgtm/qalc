import type { CategoryId, Unit } from '../types'
import { CURRENCY_CODES } from '../services/exchangeRate'

function currencyUnits(): Unit[] {
  return CURRENCY_CODES.map((code) => ({
    id: code.toLowerCase(),
    label: code,
    symbol: code,
  }))
}

/** 길이: 큰 단위 → 작은 단위 (미터법 → 영미) */
export const LENGTH_UNITS: Unit[] = [
  { id: 'km', label: 'km', symbol: 'km' },
  { id: 'm', label: 'm', symbol: 'm' },
  { id: 'cm', label: 'cm', symbol: 'cm' },
  { id: 'mm', label: 'mm', symbol: 'mm' },
  { id: 'mile', label: 'mile', symbol: 'mile' },
  { id: 'yard', label: 'yard', symbol: 'yard' },
  { id: 'ft', label: 'ft', symbol: 'ft' },
  { id: 'inch', label: 'inch', symbol: 'inch' },
]

/** 무게: 큰 단위 → 작은 단위 (미터법 → 영미) */
export const WEIGHT_UNITS: Unit[] = [
  { id: 'ton', label: 'ton', symbol: 'ton' },
  { id: 'kg', label: 'kg', symbol: 'kg' },
  { id: 'g', label: 'g', symbol: 'g' },
  { id: 'mg', label: 'mg', symbol: 'mg' },
  { id: 'lb', label: 'lb', symbol: 'lb' },
  { id: 'oz', label: 'oz', symbol: 'oz' },
]

/**
 * 길이 → 미터(m) 환산 계수
 * inch = 2.54 cm, ft = 12 inch, yard = 3 ft, mile = 1760 yard
 */
export const LENGTH_TO_METERS: Record<string, number> = {
  km: 1000,
  m: 1,
  cm: 0.01,
  mm: 0.001,
  inch: 0.0254,
  ft: 0.3048,
  yard: 0.9144,
  mile: 1609.344,
}

/**
 * 무게 → 킬로그램(kg) 환산 계수
 * 1 lb = 0.45359237 kg, 1 lb = 16 oz
 */
export const WEIGHT_TO_KG: Record<string, number> = {
  ton: 1000,
  kg: 1,
  g: 0.001,
  mg: 0.000001,
  lb: 0.45359237,
  oz: 0.028349523125,
}

/** 단위는 카테고리별로 분리 — 목록 순서가 드롭다운 순서 */
export const UNITS_BY_CATEGORY: Record<CategoryId, Unit[]> = {
  currency: currencyUnits(),
  length: LENGTH_UNITS,
  weight: WEIGHT_UNITS,
}

const DEFAULT_UNIT_PAIR: Record<CategoryId, { fromId: string; toId: string }> = {
  currency: { fromId: 'krw', toId: 'usd' },
  length: { fromId: 'm', toId: 'cm' },
  weight: { fromId: 'kg', toId: 'g' },
}

export function getUnits(categoryId: CategoryId): Unit[] {
  return UNITS_BY_CATEGORY[categoryId]
}

export function getDefaultUnitPair(categoryId: CategoryId): {
  fromId: string
  toId: string
} {
  return DEFAULT_UNIT_PAIR[categoryId]
}
