export type StandardPriceListType = {
  id: number
  priceName: string
  category: string
  serviceType: string[]
  currency: string
  catBasis: string

  decimalPlace: number
  roundingProcedure: string
  memoForPrice: string
  languagePair: Array<LanguagePairListType>
  priceUnit: Array<PriceUnitListType>
}

export type LanguagePairListType = {
  id: number
  source: string
  target: string
  priceFactor: number
  minimumPrice: number
  currency: string
}

export type PriceUnitListType = {
  id: number
  isBase: boolean
  title: string
  unit: string
  weighting: number | null
  quantity: number | null
  price: number
  currency: string
}
