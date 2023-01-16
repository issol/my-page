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
  createdAt: string
  updatedAt: string
}

export type RequestActionType = {
  userId: number
  reply: string
  roles: string[]
  email: string

  type: string
}

export type ResponseRequestsType = {
  id: number
  email: string
  userId: number
  masterId: number | null
  reply: string
  roles: string[]
  updatedAt: string
}

export type ResponseMembersType = {
  createdAt: string
  deletedAt: string | null
  email: string
  firstName: string
  jobTitle: string
  lastName: string
  middleName: string | null
  permissionGroups: string[]
  type: string
  updatedAt: string
  userId: number
}
