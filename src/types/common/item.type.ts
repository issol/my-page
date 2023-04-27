import { CurrencyType } from './standard-price'

export type ItemType = {
  id?: number
  name: string
  dueAt?: string
  contactPersonId?: number
  source: string
  target: string
  priceId: number | null
  detail?: Array<{
    quantity: number
    priceUnit: string
    unitPrice: number
    prices: number
    unit: string
    currency: CurrencyType
  }>
  description?: string
  analysis?: number[] //file id를 보내기
  totalPrice: number
}
