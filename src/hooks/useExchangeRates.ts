import { useCallback, useEffect, useRef, useState } from 'react'
import {
  EXCHANGE_REFRESH_MS,
  fetchLatestRates,
  isCacheFresh,
  readCachedRates,
  type ExchangeRateSnapshot,
} from '../services/exchangeRate'

export type ExchangeRateStatus = 'loading' | 'ready' | 'error'

export type UseExchangeRatesResult = {
  rates: ExchangeRateSnapshot['rates'] | null
  updatedAt: number | null
  source: ExchangeRateSnapshot['source'] | null
  status: ExchangeRateStatus
  /** true only when falling back to cache after a failed fetch */
  isStale: boolean
}

export function useExchangeRates(): UseExchangeRatesResult {
  const initial = readCachedRates()
  const [snapshot, setSnapshot] = useState<ExchangeRateSnapshot | null>(initial)
  const [status, setStatus] = useState<ExchangeRateStatus>(
    initial ? 'ready' : 'loading',
  )
  const [isStale, setIsStale] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const load = useCallback(async (force = false) => {
    const existing = readCachedRates()
    if (!force && isCacheFresh(existing)) {
      setSnapshot(existing)
      setIsStale(false)
      setStatus('ready')
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    if (!existing) setStatus('loading')

    try {
      const next = await fetchLatestRates(controller.signal)
      if (controller.signal.aborted) return
      setSnapshot(next)
      setIsStale(false)
      setStatus('ready')
    } catch {
      if (controller.signal.aborted) return
      const fallback = existing ?? readCachedRates()
      if (fallback) {
        setSnapshot({ ...fallback, source: 'cache' })
        setIsStale(true)
        setStatus('ready')
      } else {
        setStatus('error')
      }
    }
  }, [])

  useEffect(() => {
    void load(false)

    const timer = window.setInterval(() => {
      void load(true)
    }, EXCHANGE_REFRESH_MS)

    return () => {
      window.clearInterval(timer)
      abortRef.current?.abort()
    }
  }, [load])

  return {
    rates: snapshot?.rates ?? null,
    updatedAt: snapshot?.updatedAt ?? null,
    source: snapshot?.source ?? null,
    status,
    isStale,
  }
}
