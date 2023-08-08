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
}
