import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  detectBrowserLocale,
  getLocaleMeta,
  getTranslation,
  isLocaleCode,
  LOCALES,
  LOCALE_STORAGE_KEY,
  type LocaleCode,
  type LocaleMeta,
  type Translation,
} from '../locales'

type LocaleContextValue = {
  locale: LocaleCode
  locales: LocaleMeta[]
  meta: LocaleMeta
  t: Translation
  setLocale: (code: LocaleCode) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function readStoredLocale(): LocaleCode {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored && isLocaleCode(stored)) return stored
  } catch {
    // ignore storage errors
  }
  return detectBrowserLocale()
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(readStoredLocale)

  const setLocale = useCallback((code: LocaleCode) => {
    setLocaleState(code)
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, code)
    } catch {
      // ignore storage errors
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      locales: LOCALES,
      meta: getLocaleMeta(locale),
      t: getTranslation(locale),
      setLocale,
    }),
    [locale, setLocale],
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return ctx
}
