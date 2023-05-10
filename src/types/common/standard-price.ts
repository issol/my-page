import { CreateClientResType } from '../client/client'

export type CurrencyType = 'USD' | 'KRW' | 'SGD' | 'JPY'
export type StandardPriceListType = {
  id: number
  isStandard: boolean
  priceName: string
  client?: CreateClientResType | null
  category: string
  serviceType: string[]
  currency: CurrencyType
  catBasis: string

  decimalPlace: number
  roundingProcedure: string
  memoForPrice?: string | undefined
  languagePairs: Array<LanguagePairListType>
  priceUnit: Array<PriceUnitListType>
  catInterface: {
    memSource: Array<CatInterfaceType>
    memoQ: Array<CatInterfaceType>
  }
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

export interface PriceUnitListWithHeaders {
  id: number
  title: string
  priceUnitPairId: number
  quantity: number | null
  price: number | null
  unit: string | null
  perWords: number | null
  chips: Array<{
    id: number
    title: string
    selected: boolean
    tmpSelected: boolean
  }>
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
  memoForPrice?: string | undefined
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
    id?: number
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
  priceUnitPairId?: number
  priceUnitId: number
  price: string | null
  weighting: string | null
  quantity: string | null
}

export type LanguagePairParams = {
  source: string
  target: string
  priceFactor: string | null
  minimumPrice: string | null
  currency: CurrencyType
}

export type CatInterfaceType = {
  id: number
  createdAt: string
  updatedAt: string
  priceUnitPairId: number
  priceUnitTitle: string
  priceUnitQuantity: number
  priceUnitUnit: string
  perWords: number
  priceUnitPrice: number
  chips: Array<{
    id: number
    title: string
    selected: boolean
  }>
}

export type CatInterfaceParams = {
  priceUnitPairId: number
  priceUnitTitle: string
  priceUnitPrice: number
  priceUnitQuantity: number
  priceUnitUnit: string
  perWords: number
  chips: Array<{
    title: string
    selected: boolean
  }>
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
