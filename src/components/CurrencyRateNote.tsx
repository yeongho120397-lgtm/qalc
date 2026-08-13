import { useLocale } from '../i18n/LocaleContext'
import {
  formatRateUpdatedAt,
  UNIPASS_RATE_URL,
} from '../services/exchangeRate'
import './CurrencyRateNote.css'

type CurrencyRateNoteProps = {
  updatedAt: number | null
  isStale: boolean
  status: 'loading' | 'ready' | 'error'
}

export function CurrencyRateNote({
  updatedAt,
  isStale,
  status,
}: CurrencyRateNoteProps) {
  const { locale, t } = useLocale()

  const updatedLine =
    updatedAt != null
      ? `${t.rateUpdated}: ${formatRateUpdatedAt(updatedAt, locale)}`
      : status === 'loading'
        ? `${t.rateUpdated}: …`
        : null

  return (
    <aside className="rate-note" aria-live="polite">
      {updatedLine ? <p className="rate-note__line">{updatedLine}</p> : null}
      {isStale ? <p className="rate-note__line">{t.rateStale}</p> : null}
      {status === 'error' && !updatedAt ? (
        <p className="rate-note__line">{t.rateUnavailable}</p>
      ) : null}
      <p className="rate-note__line">{t.rateDisclaimer}</p>
      {locale === 'ko' ? (
        <p className="rate-note__line">
          <a
            className="rate-note__link"
            href={UNIPASS_RATE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.unipassLink}
          </a>
        </p>
      ) : null}
    </aside>
  )
}
