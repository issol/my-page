export type ProjectTeamFormType = {
  supervisorId?: number | null
  projectManagerId: number
  member?: Array<number>
}

export type ClientFormType = {
  clientId?: number
  contactPersonId?: number | null
  addressType?: 'billing' | 'shipping'
}

export type LanguagePairsType = {
  id?: number
  source: string
  target: string
  priceId?: number
}

export type LanguagePairsPostType = {
  langPairId: number

  source: string
  target: string
  priceId?: number
}

export type ItemResType = {
  id: number
  contactPersonId: null | number
  itemName?: string
  name?: string
  dueAt: string
  sourceLanguage: string
  targetLanguage: string
  priceId: number
  description: string | null
  totalPrice: string
  quotePrice?: PriceType
}

// 변경된 item 내 quotePrice or orderPrice type
export type PriceType = {
  authorId: number
  calculationBasis: string | null
  category: string | null
  createdAt: string
  currency: "USD" | "KRW" | "SGD" | "JPY"
  deletedAt: string | null
  id: number
  isStandard: boolean
  memo: string | null
  name: string
  numberPlace: number
  priceId: number | null
  priceUnits: PriceUnitType[] | null
  rounding: number
  serviceType: Array<string>
  updatedAt: string | null
}

export type PriceUnitType = {
  authorId?: number
  createdAt?: string
  deletedAt?: string | null
  id: number | null
  isActive?: boolean | null
  isBase?: boolean | null
  parentPriceUnitId?: number | null
  price: number
  quantity: number | null
  title: string
  unit: string
  updatedAt?: string | null
  weighting?: string
  unitPrice: number
}
