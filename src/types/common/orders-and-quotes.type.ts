import { OrderStatusType } from './orders.type'
import { CurrencyType } from './standard-price'

export type ProjectTeamFormType = {
  supervisorId?: number | null
  projectManagerId: number
  member?: Array<number>
}

export type ClientFormType = {
  clientId: number
  contactPersonId?: number | null
  addressType: 'billing' | 'shipping'
}

export type LanguagePairsType = {
  id?: number
  source: string
  target: string
  priceId?: number
}

export type ItemType = {
  id?: number
  name: string
  dueAt: string
  contactPersonId?: number | null
  source: string
  target: string
  priceId: number
  detail?: Array<ItemDetailType>
  description?: string
  analysis?: number[]
  totalPrice: number
}

export type ItemDetailType = {
  quantity: number
  priceUnit: string // title
  unitPrice: number // unit에 등록된 price
  prices: number // quantity 등이 계산 된 price
  unit: string
  currency: CurrencyType
}
