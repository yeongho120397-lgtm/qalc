import './SwapButton.css'

type SwapButtonProps = {
  onClick: () => void
}

export function SwapButton({ onClick }: SwapButtonProps) {
  return (
    <button
      type="button"
      className="swap-button"
      onClick={onClick}
      aria-label="단위 바꾸기"
    >
      ⇅
    </button>
  )
}
