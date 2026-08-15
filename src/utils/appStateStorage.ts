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

function defaultCategoryState(
  categoryId: CategoryId,
  locale?: LocaleCode,
): CategoryState {
  const pair = getDefaultUnitPair(categoryId, locale)
  return {
    fromUnitId: pair.fromId,
    toUnitId: pair.toId,
    amount: '',
  }
}

export function createDefaultAppState(locale: LocaleCode): AppUiState {
  return {
    categoryId: 'currency',
    categories: {
      currency: defaultCategoryState('currency', locale),
      length: defaultCategoryState('length', locale),
      weight: defaultCategoryState('weight', locale),
    },
  }
}

/** Fix legacy first-run state where both sides were the same currency (e.g. USD↔USD). */
function normalizeAppState(state: AppUiState, locale: LocaleCode): AppUiState {
  const currency = state.categories.currency
  if (currency.fromUnitId !== currency.toUnitId) return state

  const pair = getDefaultUnitPair('currency', locale)
  return {
    ...state,
    categories: {
      ...state.categories,
      currency: {
        ...currency,
        fromUnitId: pair.fromId,
        toUnitId: pair.toId,
      },
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
    if (parsed) return normalizeAppState(parsed, locale)
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
