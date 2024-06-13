import { Dispatch, SetStateAction } from 'react'
import { loginResType } from 'src/types/sign/signInTypes'
import {
  CountryType,
  JobInfoType,
  PronounceType,
} from 'src/types/sign/personalInfoTypes'
import { ClientAddressType } from '@src/types/schema/client-address.schema'

export type RoleType = 'CLIENT' | 'PRO' | 'LPM' | 'TAD' | 'ACCOUNT_MANAGER'
export type UserType = 'Master' | 'Manager' | 'General'

export type UserRoleType = {
  name: RoleType
  type: UserType
}

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
  email: string
  company?: string
  country?: string
  firstName?: string
  lastName?: string
  username?: string
  userCorporationId?: string
  createdAt?: string
  isSignToNDA?: boolean
  isSignToContract?: boolean
  //⬇️ extraData
  middleName?: string
  legalNamePronunciation?: string
  pronounce?: PronounceType
  havePreferred?: boolean
  preferredName?: string
  preferredNamePronunciation?: string
  timezone: CountryType
  mobilePhone?: string
  telephone?: string
  jobInfo?: Array<JobInfoType>
  experience?: string
  resume?: Array<{ name: string; size: number }> | null
  specialties?: Array<string>
  jobTitle?: string
  fax?: string
  userId: number
  department?: string
  dateOfBirth?: string
  birthday?: string
  address: ClientAddressType<number>
  addresses: ClientAddressType<number>[]
  fromSNS?: null | 'GOOGLE'
  roles?: Array<UserRoleType>
  companyId?: string
  isSubscribed: boolean // 구독 여부
  isSeatAssigned: boolean // 좌석 할당 여부
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
  company: ClientUserType | null | undefined
  updateUserInfo: (response: loginResType) => Promise<void>
  setLoading: (value: boolean) => void
  setUser: Nullable<Dispatch<SetStateAction<UserDataType | null>>>
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
}

export type PermissionObjectType = Array<{
  subject: string
  can: 'create' | 'read' | 'update' | 'delete'
  option?: { [key: string]: any }
}>

// ** CLIENT 유저가 받게 되는 유저 데이터 타입
export type ClientClassificationType =
  | 'individual'
  | 'corporate'
  | 'corporate_non_korean'

export type ClientCompanyInfoType = {
  businessClassification?: ClientClassificationType
  name?: string //client name
  email?: string
  phone?: string
  mobile?: string
  fax?: string
  websiteLink?: string
  timezone?: CountryType
  headquarter?: string
}

export type CorporateClientInfoType = {
  registrationNumber?: number
  representativeName?: string
  commencementDate?: string
}

export type ClientUserType = {
  headquarter?: string
  clientId: number
  corporationId: string
  adminCompanyName: string
  clientType: string
  isReferred: boolean
  status: string //!추후 number로 변경될 수 있음
  companyId: null | string
  isTaxable: boolean
  tax: null | number
  clientAddresses: ClientAddressType<number>[]
} & ClientCompanyInfoType &
  CorporateClientInfoType
