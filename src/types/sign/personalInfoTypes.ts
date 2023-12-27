import { ClientAddressType } from '../schema/client-address.schema'

export type PronounceType = 'SHE' | 'HE' | 'THEY' | 'NONE'

export interface CountryType {
  code: string
  label: string
  phone: string
}

export interface TimeZoneType {
  offset: number;
  offsetFormatted: string;
  timezone: string;
  timezoneCode: string;
}

export interface JobInfoType {
  jobType: string
  role: string
  source?: string | null
  target?: string | null
}

export interface PersonalInfo {
  firstName: string
  middleName?: string
  lastName: string
  legalNamePronunciation?: string
  pronounce?: PronounceType | null
  havePreferred: boolean
  preferredName?: string
  preferredNamePronunciation?: string
  timezone: CountryType
  mobile?: string
  phone?: string
  jobInfo: Array<JobInfoType>
  experience: string
  resume: Array<File> | null
  specialties: Array<{ label: string; value: string }>
  birthday?: Date | null
  address: ClientAddressType<string>
}

export type ProUserInfoType = {
  firstName: string
  lastName: string
  country: string
  birthday: string
  extraData: {
    havePreferredName: boolean
    jobInfo: Array<JobInfoType>
    middleName?: string
    experience?: string
    legalNamePronunciation?: string
    mobilePhone?: string
    telephone?: string
    preferredName?: string
    preferredNamePronunciation?: string
    pronounce?: PronounceType | null
    resume?: Array<string>
    specialties: Array<string>
    timezone: CountryType
    addresses: Array<ClientAddressType<string>>
  }
}

export type ProUserResumeInfoType = {
  extraData: {
    resume: Array<string>
  }
}

export type ManagerUserInfoType = {
  firstName: string
  middleName?: string
  lastName: string
  country: string
  company?: string
  extraData: {
    timezone?: CountryType
    jobTitle?: string
    mobilePhone?: string
    telephone?: string
    fax?: string
    department?: string
  }
}

export type ManagerInfo = {
  firstName: string
  middleName?: string
  lastName: string
  email?: string
  department?: string
  jobTitle?: string
  timezone: CountryType
  mobilePhone?: string
  telephone?: string
  fax?: string
}
