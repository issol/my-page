import { CurrencyType } from './standard-price'
import { MemSourceType, MemoQType } from './tm-analysis.type'

export type ItemType = Omit<PostItemType, 'analysis'> & {
  analysis?: {
    name: string
    size: number
    data: MemoQType | MemSourceType | null
  }[]
}

export type PostItemType = {
  id?: number
  name: string
  dueAt?: string
  contactPersonId?: number
  source: string
  target: string
  priceId: number | null
  detail?: Array<ItemDetailType>
  description?: string | null
  analysis?: number[] //file id를 보내기
  totalPrice: number
}

export type ItemDetailType = {
  priceUnitId: number
  priceUnit?: string | null
  quantity: number
  unitPrice: number
  prices: number | string
  unit: string
  currency: CurrencyType
  priceFactor?: string | null
}
