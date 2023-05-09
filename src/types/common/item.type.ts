import { CurrencyType } from './standard-price'
import { MemoQType } from './tm-analysis.type'

export type ItemType = {
  id?: number
  name: string
  dueAt?: string
  contactPersonId?: number
  source: string
  target: string
  priceId: number | null
  detail?: Array<ItemDetailType>
  description?: string
  // analysis?: number[] //file id를 보내기
  analysis?: {
    name: string
    size: number
    data: MemoQType | null
  }[]
  totalPrice: number
}

export type ItemDetailType = {
  quantity: number
  priceUnit: string // title
  unitPrice: number
  prices: number | string
  unit: string
  currency: CurrencyType
  priceFactor?: string | null
}
