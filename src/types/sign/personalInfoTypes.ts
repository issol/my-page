export type PronounceType = 'SHE' | 'HE' | 'THEY' | 'NONE'

export interface CountryType {
  code: string
  label: string
  phone: string
}

export interface JobInfoType {
  jobType: string
  role: string
  source: string
  target: string
}

export interface PersonalInfo {
  firstName: string
  middleName?: string
  lastName: string
  legalName_pronunciation?: string
  pronounce?: PronounceType
  havePreferred: boolean
  preferredName?: string
  preferredName_pronunciation?: string
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
    legalName_pronunciation?: string
    mobilePhone?: string
    telephone?: string
    preferredName?: string
    preferredName_pronunciation?: string
    pronounce?: PronounceType
    resume: Array<File> | null
    specialties: Array<{ label: string; value: string }>
    timezone: CountryType
  }
}

export type ManagerUserInfoType = {
  firstName: string
  lastName: string
  country: string
  extraData: {
    timezone?: CountryType
    jobTitle?: string
    mobilePhone?: string
    telephone?: string
    fax?: string
  }
}

export type ManagerInfo = {
  firstName: string
  middleName?: string
  lastName: string
  jobTitle?: string
  timezone: CountryType
  mobile?: string
  phone?: string
  fax?: string
}
