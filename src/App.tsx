import { useEffect, useMemo, useState } from 'react'
import { Header } from './components/Header'
import { CategoryTabs } from './components/CategoryTabs'
import { ConverterRow } from './components/ConverterRow'
import { CurrencyRateNote } from './components/CurrencyRateNote'
import { SavedList } from './components/SavedList'
import { CATEGORIES } from './data/categories'
import { getDefaultUnitPair, getUnits } from './data/units'
import { useExchangeRates } from './hooks/useExchangeRates'
import { useLocale } from './i18n/LocaleContext'
import { getConversionValue } from './utils/convert'
import { formatConversionNumber } from './utils/formatLocale'
import {
  readSavedItems,
  writeSavedItems,
} from './utils/savedItemsStorage'
import type { CategoryId, SavedItem } from './types'
import './App.css'

const INITIAL_CATEGORY: CategoryId = 'currency'
const initialPair = getDefaultUnitPair(INITIAL_CATEGORY)

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function App() {
  const { locale } = useLocale()
  const { rates, updatedAt, status, isStale } = useExchangeRates()

  const [categoryId, setCategoryId] = useState<CategoryId>(INITIAL_CATEGORY)
  const [fromUnitId, setFromUnitId] = useState(initialPair.fromId)
  const [toUnitId, setToUnitId] = useState(initialPair.toId)
  const [amount, setAmount] = useState('')
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() =>
    readSavedItems(),
  )

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

  function handleCategoryChange(nextId: CategoryId) {
    setCategoryId(nextId)
    setAmount('')

    const pair = getDefaultUnitPair(nextId)
    setFromUnitId(pair.fromId)
    setToUnitId(pair.toId)
  }

  function handleSwap() {
    setFromUnitId(toUnitId)
    setToUnitId(fromUnitId)
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
  }

  function handleDelete(id: string) {
    setSavedItems((prev) => prev.filter((item) => item.id !== id))
  }

  function handleRestore(item: SavedItem) {
    setCategoryId(item.categoryId)
    setAmount(item.amount)

    const pair = getDefaultUnitPair(item.categoryId)
    setFromUnitId(item.fromUnitId ?? pair.fromId)
    setToUnitId(item.toUnitId ?? pair.toId)
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
          onAmountChange={setAmount}
          onFromChange={setFromUnitId}
          onToChange={setToUnitId}
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
          onRestore={handleRestore}
        />

        <div className="app__spacer" aria-hidden="true" />
      </main>
    </div>
  )
}

export default App
