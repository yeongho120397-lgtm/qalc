import { getDefaultUnitPair } from '../data/units'
import type { LocaleCode } from '../locales'
import type { CategoryId } from '../types'

export const APP_STATE_STORAGE_KEY = 'qalc-app-state'

export type CategoryState = {
  fromUnitId: string
  toUnitId: string
  amount: string
}

export type AppUiState = {
  categoryId: CategoryId
  categories: Record<CategoryId, CategoryState>
}

const CATEGORY_IDS: CategoryId[] = ['currency', 'length', 'weight']

function defaultCategoryState(categoryId: CategoryId): CategoryState {
  const pair = getDefaultUnitPair(categoryId)
  return {
    fromUnitId: pair.fromId,
    toUnitId: pair.toId,
    amount: '',
  }
}

export function createDefaultAppState(_locale: LocaleCode): AppUiState {
  const currency = getDefaultUnitPair('currency')

  return {
    categoryId: 'currency',
    categories: {
      currency: {
        fromUnitId: currency.fromId,
        toUnitId: currency.toId,
        amount: '',
      },
      length: defaultCategoryState('length'),
      weight: defaultCategoryState('weight'),
    },
  }
}

function isCategoryState(value: unknown): value is CategoryState {
  if (!value || typeof value !== 'object') return false
  const v = value as Partial<CategoryState>
  return (
    typeof v.fromUnitId === 'string' &&
    typeof v.toUnitId === 'string' &&
    typeof v.amount === 'string'
  )
}

function parseAppUiState(value: unknown): AppUiState | null {
  if (!value || typeof value !== 'object') return null
  const v = value as Partial<AppUiState>
  if (
    v.categoryId !== 'currency' &&
    v.categoryId !== 'length' &&
    v.categoryId !== 'weight'
  ) {
    return null
  }
  if (!v.categories || typeof v.categories !== 'object') return null

  for (const id of CATEGORY_IDS) {
    if (!isCategoryState(v.categories[id])) return null
  }

  return {
    categoryId: v.categoryId,
    categories: v.categories,
  }
}

export function readAppState(locale: LocaleCode): AppUiState {
  try {
    const raw = localStorage.getItem(APP_STATE_STORAGE_KEY)
    if (!raw) return createDefaultAppState(locale)

    const parsed = parseAppUiState(JSON.parse(raw) as unknown)
    if (parsed) return parsed
  } catch {
    // ignore
  }

  return createDefaultAppState(locale)
}

export function writeAppState(state: AppUiState): void {
  try {
    localStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}
