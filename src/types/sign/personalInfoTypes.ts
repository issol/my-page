export type PronounceType = 'SHE' | 'HE' | 'THEY' | 'NONE'

export interface CountryType {
  code: string
  label: string
  phone: string
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
  jobInfo: Array<{
    jobType: string
    role: string
    source: string
    target: string
  }>
  experience: string
  resume: File | null
  specialties: Array<{ label: string; value: string }>
}
