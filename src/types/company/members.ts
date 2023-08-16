export type SignUpRequestsType = {
  id: number
  rId: number
  email: string
  roles: string[]
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
  permission: string[]
  department?: string
  createdAt: string
  updatedAt: string
}

export type RequestActionType = {
  rId: number
  reply: string
  roles?: string[]
}

export type RequestPayloadType = {
  payload: RequestActionType
  user: SignUpRequestsType
}

export type ResponseRequestsType = {
  id: number
  userEmail: string
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
  department?: string
  lastName: string
  middleName: string | null
  permissionGroups: string[]
  type: string
  updatedAt: string
  userId: number
}
