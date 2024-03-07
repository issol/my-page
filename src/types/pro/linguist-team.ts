export type LinguistTeamListType = {
  id: number
  corporateId: string
  name: string
  source: string
  target: string
  serviceTypeId: number
  client: string
  description?: string
  pros: Array<{
    userId: number
    firstName: string
    lastName: string
  }>
  isPrivate: boolean
}

export type LinguistTeamFormType = {
  isPrivate: boolean
  name: string
  client: string
  serviceTypeId: number
  source: string
  target: string
  description?: string
}
