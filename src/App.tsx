import { useEffect, useMemo, useState } from 'react'
import { Header } from './components/Header'
import { CategoryTabs } from './components/CategoryTabs'
import { ConverterRow } from './components/ConverterRow'
import { CurrencyRateNote } from './components/CurrencyRateNote'
import { SavedList } from './components/SavedList'
import { AdBanner } from './components/AdBanner'
import { CATEGORIES } from './data/categories'
import { getUnits } from './data/units'
import { useExchangeRates } from './hooks/useExchangeRates'
import { useLocale } from './i18n/LocaleContext'
import { getConversionValue } from './utils/convert'
import { formatConversionNumber } from './utils/formatLocale'
import {
  readAppState,
  writeAppState,
  type AppUiState,
  type CategoryState,
} from './utils/appStateStorage'
import {
  readSavedItems,
  writeSavedItems,
} from './utils/savedItemsStorage'
import type { CategoryId, SavedItem } from './types'
import './App.css'

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function App() {
  const { locale } = useLocale()
  const { rates, updatedAt, status, isStale } = useExchangeRates()

  const [appState, setAppState] = useState<AppUiState>(() =>
    readAppState(locale),
  )
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() =>
    readSavedItems(),
  )

  const { categoryId } = appState
  const categoryState = appState.categories[categoryId]
  const { fromUnitId, toUnitId, amount } = categoryState

  useEffect(() => {
    writeAppState(appState)
  }, [appState])

  useEffect(() => {
    writeSavedItems(savedItems)
  }, [savedItems])

  const units = getUnits(categoryId)
  const fromUnit = units.find((unit) => unit.id === fromUnitId)
  const toUnit = units.find((unit) => unit.id === toUnitId)

  const resultValue = useMemo(() => {
    return getConversionValue(
      categoryId,
      amount,
      fromUnitId,
      toUnitId,
      rates,
    )
  }, [amount, categoryId, fromUnitId, toUnitId, rates])

  const resultDisplay = useMemo(() => {
    if (resultValue === null) return '-'
    return formatConversionNumber(
      resultValue,
      categoryId,
      toUnitId,
      locale,
    )
  }, [resultValue, categoryId, toUnitId, locale])

  function updateCategoryState(patch: Partial<CategoryState>) {
    setAppState((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [prev.categoryId]: {
          ...prev.categories[prev.categoryId],
          ...patch,
        },
      },
    }))
  }

  function handleCategoryChange(nextId: CategoryId) {
    setAppState((prev) => ({ ...prev, categoryId: nextId }))
  }

  function handleSwap() {
    updateCategoryState({
      fromUnitId: toUnitId,
      toUnitId: fromUnitId,
    })
  }

  function handleSave() {
    if (!amount || resultValue === null) return

    setSavedItems((prev) => [
      ...prev,
      {
        id: createId(),
        categoryId,
        amount,
        resultValue,
        fromUnitId,
        toUnitId,
        fromSymbol: fromUnit?.symbol,
        toSymbol: toUnit?.symbol,
      },
    ])
    updateCategoryState({ amount: '' })
  }

  function handleDelete(id: string) {
    setSavedItems((prev) => prev.filter((item) => item.id !== id))
  }

  function handleClearAll() {
    setSavedItems([])
  }

  function handleRestore(item: SavedItem) {
    setAppState((prev) => ({
      ...prev,
      categoryId: item.categoryId,
      categories: {
        ...prev.categories,
        [item.categoryId]: {
          fromUnitId: item.fromUnitId ?? prev.categories[item.categoryId].fromUnitId,
          toUnitId: item.toUnitId ?? prev.categories[item.categoryId].toUnitId,
          amount: item.amount,
        },
      },
    }))
  }

  return (
    <div className="app">
      <Header />
      <CategoryTabs
        categories={CATEGORIES}
        activeId={categoryId}
        onChange={handleCategoryChange}
      />

      <main className="app__main">
        <ConverterRow
          units={units}
          fromUnitId={fromUnitId}
          toUnitId={toUnitId}
          amount={amount}
          result={resultDisplay}
          toUnitSymbol={toUnit?.symbol}
          onAmountChange={(value) => updateCategoryState({ amount: value })}
          onFromChange={(value) => updateCategoryState({ fromUnitId: value })}
          onToChange={(value) => updateCategoryState({ toUnitId: value })}
          onSwap={handleSwap}
          onSave={handleSave}
          saveDisabled={!amount || resultValue === null}
        />

        {categoryId === 'currency' ? (
          <CurrencyRateNote
            updatedAt={updatedAt}
            isStale={isStale}
            status={status}
          />
        ) : null}

        <SavedList
          items={savedItems}
          onDelete={handleDelete}
          onClearAll={handleClearAll}
          onRestore={handleRestore}
        />

        <AdBanner />

        <div className="app__spacer" aria-hidden="true" />
      </main>
    </div>
  )
}

export default App
