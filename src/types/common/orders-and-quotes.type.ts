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

export type LanguagePairsPostType = {
  langPairId: number

  source: string
  target: string
  priceId?: number
}
