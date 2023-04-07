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
}
