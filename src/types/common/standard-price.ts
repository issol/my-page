export type CurrencyType = 'USD' | 'KRW' | 'SGD' | 'JPY'
export type StandardPriceListType = {
  id: number
  isStandard: boolean
  priceName: string
  category: string
  serviceType: string[]
  currency: CurrencyType
  catBasis: string

  decimalPlace: number
  roundingProcedure: string
  memoForPrice: string
  languagePairs: Array<LanguagePairListType>
  priceUnit: Array<PriceUnitListType>
}

export type LanguagePairListType = {
  id: number
  source: string
  target: string
  priceFactor: number
  minimumPrice: number
  currency: CurrencyType
  createdAt: string
  deletedAt: string | null
  updatedAt: string
}

export interface PriceUnitListType {
  id: number
  priceUnitId: number
  parentPriceUnitId?: number | null
  isBase: boolean
  title: string
  unit: string
  weighting: number | null
  quantity: number | null
  price: number

  createdAt?: string
  updatedAt?: string

  deletedAt?: string | null
}

export interface PriceUnitListWithHeaders extends PriceUnitListType {
  headers: Array<{ value: string; selected: boolean; tmpSelected: boolean }>
}

export type AddNewPriceType = {
  clientId?: number
  isStandard: boolean
  priceName: string
  category: string
  serviceType: Array<string>
  currency: CurrencyType
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
      isActive?: boolean
      parentPriceUnitId: number | null
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

export type AddNewLanguagePairParams = {
  source: string
  target: string
  priceFactor: number | null
  minimumPrice: number | null
  currency: string
}

export type CreatePriceResType = {
  name: string
  category: string
  serviceType: string[]
  currency: CurrencyType
  calculationBasis: string
  rounding: number
  numberPlace: number
  authorId: number
  client: {
    clientId: number
  }
  memo: null | string
  id: number
  createdAt?: string
  updatedAt?: null | string
  isStandard: boolean
}
