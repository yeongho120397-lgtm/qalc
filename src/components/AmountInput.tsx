import './AmountInput.css'

type AmountInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function AmountInput({
  value,
  onChange,
  placeholder = '0',
}: AmountInputProps) {
  return (
    <label className="amount-input">
      <span className="amount-input__label">입력</span>
      <input
        className="amount-input__field"
        type="text"
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        aria-label="변환할 숫자"
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
