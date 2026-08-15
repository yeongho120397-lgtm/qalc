export type LocaleCode = 'en' | 'zh' | 'ja' | 'ko' | 'ru' | 'es' | 'pt'

export type Translation = {
  currency: string
  length: string
  weight: string
  save: string
  saved: string
  empty: string
  delete: string
  convert: string
  categoryNav: string
  amountInput: string
  fromUnit: string
  toUnit: string
  swapUnits: string
  language: string
  country: string
  rateUpdated: string
  rateDisclaimer: string
  rateStale: string
  rateUnavailable: string
  unipassLink: string
  copyResult: string
  copied: string
  clearAll: string
  clearAllConfirm: string
  cancel: string
}

export type LocaleMeta = {
  code: LocaleCode
  nativeName: string
  short: string
}
