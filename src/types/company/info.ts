import { CountryType } from '../sign/personalInfoTypes'

type CEOInfoType = {
  firstName: string
  middleName?: string
  lastName: string
}

export type CompanyInfoType = {
  adminCompanyName: string
  logo?: string
  billingPlan?: {
    name: string
  }
  ceo?: Array<CEOInfoType>
  headquarter?: string
  timezone: CountryType
  registrationNumber?: string
  email?: string
  phone?: string
  fax?: string
}
