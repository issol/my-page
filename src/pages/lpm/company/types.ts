export type SignUpRequestsType = {
  id: number
  email: string
  role: string[]
  permission: string
}

export type MembersType = {
  id: number
  firstName: string
  middleName: string | null
  lastName: string
  email: string
  jobTitle: string | null
  role: string[]
  permission: string
  createdAt: number
}
