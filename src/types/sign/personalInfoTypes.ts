export type PronounceType = 'SHE' | 'HE' | 'THEY' | 'NONE'

export interface CountryType {
  code: string
  label: string
  phone: string
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
  pronounce?: PronounceType
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
}

export type ConsumerUserInfoType = {
  firstName: string
  lastName: string
  country: string
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
    pronounce?: PronounceType
    resume?: Array<string>
    specialties: Array<string>
    timezone: CountryType
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
  mobile?: string
  phone?: string
  fax?: string
}
