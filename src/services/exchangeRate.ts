import type { LocaleCode } from '../locales'
import { formatLocaleDateTime } from '../utils/formatLocale'

/** ISO codes — global market order (USD first, major currencies, then regional). */
export const CURRENCY_CODES = [
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'CNY',
  'CHF',
  'CAD',
  'AUD',
  'SGD',
  'HKD',
  'KRW',
  'THB',
  'VND',
  'PHP',
  'IDR',
] as const

export type CurrencyCode = (typeof CURRENCY_CODES)[number]

/** unit id = lowercase currency code */
export type UsdRates = Record<string, number>

export type ExchangeRateSnapshot = {
  /** 1 USD = N units of each currency (keys are lowercase ids) */
  rates: UsdRates
  /** When rates were published / last successfully fetched */
  updatedAt: number
  source: 'live' | 'cache'
}

export const EXCHANGE_RATE_STORAGE_KEY = 'qelk-exchange-rates'

/** Open Access updates ~daily; refresh while app is open at this interval. */
export const EXCHANGE_REFRESH_MS = 6 * 60 * 60 * 1000

/** Prefer cache if younger than this (avoid hammering API). */
export const EXCHANGE_CACHE_MAX_AGE_MS = 12 * 60 * 60 * 1000

type ApiSuccess = {
  result: 'success'
  time_last_update_unix?: number
  base_code?: string
  rates: Record<string, number>
}

type StoredCache = {
  rates: UsdRates
  updatedAt: number
}

function toUnitId(code: string): string {
  return code.toLowerCase()
}

function buildUsdRates(apiRates: Record<string, number>): UsdRates {
  const rates: UsdRates = { usd: 1 }

  for (const code of CURRENCY_CODES) {
    const value = apiRates[code]
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
      rates[toUnitId(code)] = value
    }
  }

  return rates
}

function getApiUrl(): string {
  const key = import.meta.env.VITE_EXCHANGE_RATE_API_KEY?.trim()
  if (key) {
    return `https://v6.exchangerate-api.com/v6/${key}/latest/USD`
  }
  return 'https://open.er-api.com/v6/latest/USD'
}

export function readCachedRates(): ExchangeRateSnapshot | null {
  try {
    const raw = localStorage.getItem(EXCHANGE_RATE_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as StoredCache
    if (
      !parsed ||
      typeof parsed.updatedAt !== 'number' ||
      !parsed.rates ||
      typeof parsed.rates.usd !== 'number'
    ) {
      return null
    }

    return {
      rates: parsed.rates,
      updatedAt: parsed.updatedAt,
      source: 'cache',
    }
  } catch {
    return null
  }
}

export function writeCachedRates(snapshot: Omit<ExchangeRateSnapshot, 'source'>): void {
  try {
    const payload: StoredCache = {
      rates: snapshot.rates,
      updatedAt: snapshot.updatedAt,
    }
    localStorage.setItem(EXCHANGE_RATE_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // ignore quota / private mode
  }
}

export function isCacheFresh(
  snapshot: ExchangeRateSnapshot | null,
  maxAgeMs = EXCHANGE_CACHE_MAX_AGE_MS,
): boolean {
  if (!snapshot) return false
  return Date.now() - snapshot.updatedAt < maxAgeMs
}

export async function fetchLatestRates(
  signal?: AbortSignal,
): Promise<ExchangeRateSnapshot> {
  const response = await fetch(getApiUrl(), {
    signal,
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Exchange rate request failed (${response.status})`)
  }

  const data = (await response.json()) as ApiSuccess
  if (data.result !== 'success' || !data.rates) {
    throw new Error('Invalid exchange rate response')
  }

  const rates = buildUsdRates(data.rates)
  if (!rates.usd || Object.keys(rates).length < 2) {
    throw new Error('Incomplete exchange rate data')
  }

  const updatedAt =
    typeof data.time_last_update_unix === 'number'
      ? data.time_last_update_unix * 1000
      : Date.now()

  const snapshot: ExchangeRateSnapshot = {
    rates,
    updatedAt,
    source: 'live',
  }

  writeCachedRates(snapshot)
  return snapshot
}

export function convertWithRates(
  amount: number,
  fromId: string,
  toId: string,
  rates: UsdRates | null | undefined,
): number | null {
  if (!rates) return null
  if (fromId === toId) return amount

  const fromRate = rates[fromId]
  const toRate = rates[toId]
  if (!fromRate || !toRate) return null

  const usdValue = amount / fromRate
  return usdValue * toRate
}

export function formatRateUpdatedAt(
  updatedAt: number,
  locale: LocaleCode,
): string {
  return formatLocaleDateTime(updatedAt, locale)
}

/** Official UNIPASS weekly / customs exchange rate lookup (Korea). */
export const UNIPASS_RATE_URL =
  'https://unipass.customs.go.kr/clip/com/bsopcomn/baseinfo/otsd/COM0101049Q.do'
