import en from './en'
import zh from './zh'
import ja from './ja'
import ko from './ko'
import ru from './ru'
import es from './es'
import pt from './pt'
import type { LocaleCode, LocaleMeta, Translation } from './types'

export type { LocaleCode, LocaleMeta, Translation }

export const DEFAULT_LOCALE: LocaleCode = 'en'

export const LOCALE_STORAGE_KEY = 'qelk-locale'

export const LOCALE_TAGS: Record<LocaleCode, string> = {
  en: 'en-US',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
  ru: 'ru-RU',
  es: 'es-ES',
  pt: 'pt-BR',
}

export const LOCALES: LocaleMeta[] = [
  { code: 'en', nativeName: 'English', short: 'EN' },
  { code: 'zh', nativeName: '中文', short: 'ZH' },
  { code: 'ja', nativeName: '日本語', short: 'JA' },
  { code: 'ko', nativeName: '한국어', short: 'KO' },
  { code: 'ru', nativeName: 'Русский', short: 'RU' },
  { code: 'es', nativeName: 'Español', short: 'ES' },
  { code: 'pt', nativeName: 'Português', short: 'PT' },
]

const translations: Record<LocaleCode, Translation> = {
  en,
  zh,
  ja,
  ko,
  ru,
  es,
  pt,
}

export function isLocaleCode(value: string): value is LocaleCode {
  return value in translations
}

/** Map browser language (ko-KR, en-US, …) to a supported app locale. */
export function detectBrowserLocale(): LocaleCode {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE

  const candidates = [
    ...(navigator.languages ?? []),
    navigator.language,
  ].filter(Boolean)

  for (const raw of candidates) {
    const lower = raw.toLowerCase()
    const base = lower.split('-')[0]
    if (isLocaleCode(base)) return base
  }

  return DEFAULT_LOCALE
}

export function getTranslation(locale: LocaleCode): Translation {
  return translations[locale] ?? translations[DEFAULT_LOCALE]
}

export function getLocaleMeta(locale: LocaleCode): LocaleMeta {
  return LOCALES.find((item) => item.code === locale) ?? LOCALES[0]
}
