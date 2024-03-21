import { Currency } from '@src/types/common/currency.type'

export type AddPriceType = {
  priceName: string
  category: { label: string; value: string }
  serviceType: { label: string; value: string }[]
  currency: { label: string; value: Currency }
  catBasis?: { label: string; value: string }
  decimalPlace: number
  roundingProcedure: { label: string; value: number }
  memoForPrice: string | undefined
}
