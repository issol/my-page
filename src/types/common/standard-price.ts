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

export interface PriceUnitListType {
  id: number
  priceUnitId: number
  parentPriceUnitId: number | null
  isBase: boolean
  title: string
  unit: string
  weighting: number | null
  quantity: number | null
  price: number

  createdAt: string
  updatedAt: string

  deletedAt: string | null
}

export interface PriceUnitListWithHeaders extends PriceUnitListType {
  headers: Array<{ value: string; selected: boolean; tmpSelected: boolean }>
}

export type AddNewPriceType = {
  isStandard: boolean
  priceName: string
  category: string
  serviceType: Array<string>
  currency: string
  catBasis: string
  decimalPlace: number
  roundingProcedure: number
  memoForPrice: string
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
    parentPriceUnitId: number | null
    subPriceUnits?: Array<{
      id: number
      isBase: boolean
      title: string
      unit: string
      weighting: number
      isActive: boolean
      parentPriceUnitId: number
    }>
  }[]
}

export type SetPriceUnitPair = {
  priceId: number
  priceUnitId: number
  price: string | null
  weighting: string | null
  quantity: string | null
}
