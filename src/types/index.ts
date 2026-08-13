export type CategoryId = 'currency' | 'length' | 'weight'

export type Category = {
  id: CategoryId
  label?: string
}

export type Unit = {
  id: string
  label: string
  symbol: string
}

export type SavedItem = {
  id: string
  categoryId: CategoryId
  /** Raw input text for restore (not locale-formatted) */
  amount: string
  /** Numeric conversion result — format only when displaying */
  resultValue: number
  fromUnitId?: string
  toUnitId?: string
  fromSymbol?: string
  toSymbol?: string
}
