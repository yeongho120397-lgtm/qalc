import { useLocale } from '../i18n/LocaleContext'
import type { SavedItem } from '../types'
import {
  formatAmountForDisplay,
  formatConversionNumber,
} from '../utils/formatLocale'
import './SavedList.css'

type SavedListProps = {
  items: SavedItem[]
  onDelete: (id: string) => void
  onRestore?: (item: SavedItem) => void
}

export function SavedList({ items, onDelete, onRestore }: SavedListProps) {
  const { locale, t } = useLocale()

  function formatItem(item: SavedItem): string {
    const from = item.fromSymbol ? ` ${item.fromSymbol}` : ''
    const to = item.toSymbol ? ` ${item.toSymbol}` : ''
    const amountText = formatAmountForDisplay(item.amount, locale)
    const resultText = formatConversionNumber(
      item.resultValue,
      item.categoryId,
      item.toUnitId ?? '',
      locale,
    )
    return `${amountText}${from} → ${resultText}${to}`
  }

  return (
    <section className="saved-list">
      <h2 className="saved-list__title">{t.saved}</h2>
      {items.length === 0 ? (
        <p className="saved-list__empty">{t.empty}</p>
      ) : (
        <ul className="saved-list__items">
          {items.map((item) => (
            <li key={item.id} className="saved-list__item">
              <button
                type="button"
                className="saved-list__body"
                onClick={() => onRestore?.(item)}
              >
                {formatItem(item)}
              </button>
              <button
                type="button"
                className="saved-list__delete"
                aria-label={t.delete}
                onClick={() => onDelete(item.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
