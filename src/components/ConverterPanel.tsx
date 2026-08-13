import { UnitSelector } from './UnitSelector'
import { SwapButton } from './SwapButton'
import type { Unit } from '../types'
import './ConverterPanel.css'

type ConverterPanelProps = {
  units: Unit[]
  fromUnitId: string
  toUnitId: string
  onFromChange: (unitId: string) => void
  onToChange: (unitId: string) => void
  onSwap: () => void
}

export function ConverterPanel({
  units,
  fromUnitId,
  toUnitId,
  onFromChange,
  onToChange,
  onSwap,
}: ConverterPanelProps) {
  return (
    <div className="converter-panel">
      <UnitSelector
        label="기준 단위"
        units={units}
        value={fromUnitId}
        onChange={onFromChange}
      />
      <SwapButton onClick={onSwap} />
      <UnitSelector
        label="변환 단위"
        units={units}
        value={toUnitId}
        onChange={onToChange}
      />
    </div>
  )
}
