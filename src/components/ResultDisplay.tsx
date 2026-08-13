import './ResultDisplay.css'

type ResultDisplayProps = {
  value: string
  unitSymbol?: string
}

export function ResultDisplay({ value, unitSymbol }: ResultDisplayProps) {
  return (
    <section className="result-display" aria-live="polite">
      <p className="result-display__label">결과</p>
      <p className="result-display__value">
        {value}
        {unitSymbol ? (
          <span className="result-display__unit">{unitSymbol}</span>
        ) : null}
      </p>
    </section>
  )
}
