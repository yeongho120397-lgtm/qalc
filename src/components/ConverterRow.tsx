import { SaveButton } from './SaveButton'
import { useLocale } from '../i18n/LocaleContext'
import type { Unit } from '../types'
import './ConverterRow.css'

type ConverterRowProps = {
  units: Unit[]
  fromUnitId: string
  toUnitId: string
  amount: string
  result: string
  toUnitSymbol?: string
  onAmountChange: (value: string) => void
  onFromChange: (unitId: string) => void
  onToChange: (unitId: string) => void
  onSwap: () => void
  onSave: () => void
  saveDisabled?: boolean
}

export function ConverterRow({
  units,
  fromUnitId,
  toUnitId,
  amount,
  result,
  toUnitSymbol,
  onAmountChange,
  onFromChange,
  onToChange,
  onSwap,
  onSave,
  saveDisabled = false,
}: ConverterRowProps) {
  const { t } = useLocale()

  return (
    <section className="converter-row" aria-label={t.convert}>
      <div className="converter-row__from">
        <input
          className="converter-row__amount"
          type="text"
          inputMode="decimal"
          value={amount}
          placeholder="0"
          aria-label={t.amountInput}
          onChange={(e) => onAmountChange(e.target.value)}
        />
        <select
          className="converter-row__unit"
          value={fromUnitId}
          aria-label={t.fromUnit}
          onChange={(e) => onFromChange(e.target.value)}
        >
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.symbol}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="converter-row__swap"
        aria-label={t.swapUnits}
        onClick={onSwap}
      >
        ↔
      </button>

      <select
        className="converter-row__unit converter-row__unit--to"
        value={toUnitId}
        aria-label={t.toUnit}
        onChange={(e) => onToChange(e.target.value)}
      >
        {units.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.symbol}
          </option>
        ))}
      </select>

      <p className="converter-row__result" aria-live="polite">
        <span
          className={
            result === '-'
              ? 'converter-row__result-value converter-row__result-value--empty'
              : 'converter-row__result-value'
          }
        >
          {result}
        </span>
        {toUnitSymbol && result !== '-' ? (
          <span className="converter-row__result-unit">{toUnitSymbol}</span>
        ) : null}
      </p>

      <SaveButton inline onClick={onSave} disabled={saveDisabled} />
    </section>
  )
}
