import { useEffect, useRef, useState } from 'react'
import { useLocale } from '../i18n/LocaleContext'
import type { SavedItem } from '../types'
import { copyText } from '../utils/copyText'
import {
  formatAmountForDisplay,
  formatConversionNumber,
} from '../utils/formatLocale'
import './SavedList.css'

type SavedListProps = {
  items: SavedItem[]
  onDelete: (id: string) => void
  onClearAll: () => void
  onRestore?: (item: SavedItem) => void
}

export function SavedList({
  items,
  onDelete,
  onClearAll,
  onRestore,
}: SavedListProps) {
  const { locale, t } = useLocale()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const copiedTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current !== null) {
        window.clearTimeout(copiedTimerRef.current)
      }
    }
  }, [])

  function getResultText(item: SavedItem): string {
    return formatConversionNumber(
      item.resultValue,
      item.categoryId,
      item.toUnitId ?? '',
      locale,
    )
  }

  function getFullResultText(item: SavedItem): string {
    const resultText = getResultText(item)
    return item.toSymbol ? `${resultText} ${item.toSymbol}` : resultText
  }

  async function handleCopy(item: SavedItem) {
    const ok = await copyText(getFullResultText(item))
    if (!ok) return

    setCopiedId(item.id)
    if (copiedTimerRef.current !== null) {
      window.clearTimeout(copiedTimerRef.current)
    }
    copiedTimerRef.current = window.setTimeout(() => {
      setCopiedId(null)
      copiedTimerRef.current = null
    }, 1200)
  }

  return (
    <section className="saved-list">
      <div className="saved-list__header">
        <h2 className="saved-list__title">{t.saved}</h2>
        {items.length > 0 ? (
          confirmClear ? (
            <div className="saved-list__confirm">
              <span className="saved-list__confirm-text">
                {t.clearAllConfirm}
              </span>
              <button
                type="button"
                className="saved-list__confirm-action saved-list__confirm-action--danger"
                onClick={() => {
                  onClearAll()
                  setConfirmClear(false)
                }}
              >
                {t.delete}
              </button>
              <button
                type="button"
                className="saved-list__confirm-action saved-list__confirm-cancel"
                onClick={() => setConfirmClear(false)}
              >
                {t.cancel}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="saved-list__clear-all"
              onClick={() => setConfirmClear(true)}
            >
              {t.clearAll}
            </button>
          )
        ) : null}
      </div>
      {items.length === 0 ? (
        <p className="saved-list__empty">{t.empty}</p>
      ) : (
        <ul className="saved-list__items">
          {items.map((item) => {
            const from = item.fromSymbol ? ` ${item.fromSymbol}` : ''
            const to = item.toSymbol ? ` ${item.toSymbol}` : ''
            const amountText = formatAmountForDisplay(item.amount, locale)
            const resultText = getResultText(item)

            return (
              <li key={item.id} className="saved-list__item">
                <div className="saved-list__body">
                  <button
                    type="button"
                    className="saved-list__restore"
                    onClick={() => onRestore?.(item)}
                  >
                    {amountText}
                    {from}
                    <span className="saved-list__arrow"> → </span>
                  </button>
                  <span className="saved-list__result-wrap">
                    <button
                      type="button"
                      className="saved-list__restore saved-list__restore--result"
                      onClick={() => onRestore?.(item)}
                    >
                      <span className="saved-list__result">{resultText}</span>
                      {to}
                    </button>
                    <button
                      type="button"
                      className={
                        copiedId === item.id
                          ? 'saved-list__copy saved-list__copy--copied'
                          : 'saved-list__copy'
                      }
                      aria-label={t.copyResult}
                      onClick={() => handleCopy(item)}
                    >
                      {copiedId === item.id ? t.copied : t.copyResult}
                    </button>
                  </span>
                </div>
                <button
                  type="button"
                  className="saved-list__delete"
                  aria-label={t.delete}
                  onClick={() => onDelete(item.id)}
                >
                  ×
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
