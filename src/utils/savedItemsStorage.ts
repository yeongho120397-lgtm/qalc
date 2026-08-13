import type { CategoryId, SavedItem } from '../types'

/** Separate from locale (`qalc-locale`) and rates (`qalc-exchange-rates`). */
export const SAVED_ITEMS_STORAGE_KEY = 'qalc-saved-items'

const CATEGORY_IDS = new Set<CategoryId>(['currency', 'length', 'weight'])

function isSavedItem(value: unknown): value is SavedItem {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<SavedItem>
  return (
    typeof item.id === 'string' &&
    typeof item.categoryId === 'string' &&
    CATEGORY_IDS.has(item.categoryId as CategoryId) &&
    typeof item.amount === 'string' &&
    typeof item.resultValue === 'number' &&
    Number.isFinite(item.resultValue)
  )
}

export function readSavedItems(): SavedItem[] {
  try {
    const raw = localStorage.getItem(SAVED_ITEMS_STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []

    return parsed.filter(isSavedItem)
  } catch {
    return []
  }
}

export function writeSavedItems(items: SavedItem[]): void {
  try {
    localStorage.setItem(SAVED_ITEMS_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore quota / private mode
  }
}
