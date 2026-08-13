import { useEffect, useId, useRef, useState } from 'react'
import { useLocale } from '../i18n/LocaleContext'
import type { LocaleCode } from '../locales'
import './LanguageSwitcher.css'

export function LanguageSwitcher() {
  const { locale, locales, meta, t, setLocale } = useLocale()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  function handleSelect(code: LocaleCode) {
    setLocale(code)
    setOpen(false)
  }

  return (
    <div className="lang-switcher" ref={rootRef}>
      <button
        type="button"
        className="lang-switcher__trigger"
        aria-label={t.language}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{meta.short}</span>
        <span className="lang-switcher__caret" aria-hidden="true">
          ▾
        </span>
      </button>

      {open ? (
        <ul
          id={listId}
          className="lang-switcher__menu"
          role="listbox"
          aria-label={t.language}
        >
          {locales.map((item) => (
            <li key={item.code} role="presentation">
              <button
                type="button"
                role="option"
                className={
                  item.code === locale
                    ? 'lang-switcher__option lang-switcher__option--active'
                    : 'lang-switcher__option'
                }
                aria-selected={item.code === locale}
                onClick={() => handleSelect(item.code)}
              >
                {item.nativeName}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
