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
}

export type LanguagePairListType = {
  id: number
  source: string
  target: string
  priceFactor: number
  minimumPrice: number
  currency: string
}
