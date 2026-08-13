import type { Unit } from '../types'
import './UnitSelector.css'

type UnitSelectorProps = {
  label: string
  units: Unit[]
  value: string
  onChange: (unitId: string) => void
}

export function UnitSelector({
  label,
  units,
  value,
  onChange,
}: UnitSelectorProps) {
  return (
    <label className="unit-selector">
      <span className="unit-selector__label">{label}</span>
      <select
        className="unit-selector__select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {units.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.symbol} · {unit.label}
          </option>
        ))}
      </select>
    </label>
  )
}
