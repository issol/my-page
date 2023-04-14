export type AddPriceType = {
  priceName: string
  category: { label: string; value: string }
  serviceType: { label: string; value: string }[]
  currency: { label: string; value: string }
  catBasis: { label: string; value: string }
  decimalPlace: number
  roundingProcedure: { label: string; value: number }
  memoForPrice: string
}
