import { useLocale } from '../i18n/LocaleContext'
import './SaveButton.css'

type SaveButtonProps = {
  onClick: () => void
  disabled?: boolean
  inline?: boolean
}

export function SaveButton({
  onClick,
  disabled = false,
  inline = false,
}: SaveButtonProps) {
  const { t } = useLocale()
  const className = inline
    ? 'save-button save-button--inline'
    : 'save-button'

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {t.save}
    </button>
  )
}
