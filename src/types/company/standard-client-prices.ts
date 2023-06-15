import { CurrencyType } from '../common/standard-price'

export type AddPriceType = {
  priceName: string
  category: { label: string; value: string }
  serviceType: { label: string; value: string }[]
  currency: { label: string; value: CurrencyType }
  catBasis?: { label: string; value: string }
  decimalPlace: number
  roundingProcedure: { label: string; value: number }
  memoForPrice: string | undefined
}
