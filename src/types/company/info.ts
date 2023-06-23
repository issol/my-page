import { CountryType } from '../sign/personalInfoTypes'

type CEOInfoType = {
  firstName: string
  middleName?: string
  lastName: string
}

type CompanyAddressType = {
  officeName: string | null
  baseAddress: string | null
  detailAddress: string | null
  city: string | null
  state: string | null
  country: string | null

  zipCode: string | null
}

export type CompanyAddressFormType = {
  officeName: string | null
  baseAddress: string | null
  detailAddress: string | null
  city: string | null
  state: string | null
  country: {
    value: string | null
    label: string | null
  }

  zipCode: string | null
}

export type CompanyInfoType = {
  companyName: string
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

  address: Array<CompanyAddressType>
}

export type CompanyInfoFormType = {
  companyName: string
  logo?: string
  billingPlan?: {
    name: string
  }
  ceo?: Array<CEOInfoType>
  headquarter?: {
    value: string
    label: string
  }
  timezone: CountryType
  registrationNumber?: string
  email?: string
  phone?: string
  fax?: string

  address: Array<CompanyAddressFormType>
}