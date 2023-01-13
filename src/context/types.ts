import { Dispatch, SetStateAction } from 'react'
import { RoleType } from 'src/types/apps/userTypes'

// export type ErrCallbackType = (err: { [key: string]: string }) => void
export type ErrCallbackType = any

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type RegisterParams = {
  email: string
  username: string
  password: string
}

export type UserDataType = {
  id: number
  role: Array<RoleType>
  email: string
  permission: Array<string>
  company?: string
  country?: string
  firstName?: string
  lastName?: string
  extraData?: any
  username?: string
}

export type LoginSuccessResponse = {
  email: string
  accessToken: string
  isFirstLogin: string | boolean
  role: string
  originatorCredentials: string | null
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null

  setLoading: (value: boolean) => void
  setUser: Nullable<Dispatch<SetStateAction<UserDataType | null>>>
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
}
