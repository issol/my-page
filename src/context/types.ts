import { Dispatch, SetStateAction } from 'react'
import { loginResType } from 'src/types/sign/signInTypes'
import {
  CountryType,
  JobInfoType,
  PronounceType,
} from 'src/types/sign/personalInfoTypes'

export type RoleType = 'CLIENT' | 'PRO' | 'LPM' | 'TAD'

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
  // role: Array<RoleType>
  email: string
  // permission: Array<string>
  company?: string
  country?: string
  firstName?: string
  lastName?: string
  username?: string
  //⬇️ extraData
  middleName?: string
  legalName_pronunciation?: string
  pronounce?: PronounceType
  havePreferred?: boolean
  preferredName?: string
  preferredName_pronunciation?: string
  timezone: CountryType
  mobile?: string
  phone?: string
  jobInfo?: Array<JobInfoType>
  experience?: string
  resume?: Array<File> | null
  specialties?: Array<string>
  jobTitle?: string
  fax?: string
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
  updateUserInfo: (response: loginResType) => void
  setLoading: (value: boolean) => void
  setUser: Nullable<Dispatch<SetStateAction<UserDataType | null>>>
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
}

export type PermissionObjectType = Array<{
  subject: string
  can: Array<'all' | 'create' | 'read' | 'update' | 'delete'>
}>
