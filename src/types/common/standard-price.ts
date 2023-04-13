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

export type AddNewLanguagePair = {
  pair: {
    source: string
    target: string
    priceFactor: number | null
    minimumPrice: number | null
  }[]
}

export type SetPriceUnit = {
  pair: {
    unit: string
    isBase: boolean
    unitId: number | null
    quantity: number | null | string
    price: number | null | string
    weighting: number | null | string
    title: string
  }[]
}

export type SetPriceUnitPair = {
  priceId: number
  price: number | null
  currency: string
  priceUnitId: number
  quantity: number | null
}
