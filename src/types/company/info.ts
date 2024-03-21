import { CountryType } from '../sign/personalInfoTypes'

type CEOInfoType = {
  firstName: string
  middleName?: string
  lastName: string
}

type CompanyAddressType = {
  name?: string
  baseAddress?: string
  detailAddress?: string
  city?: string
  state?: string
  country?: string

  zipCode?: string
}

export type CompanyAddressFormType = {
  name?: string
  baseAddress?: string
  detailAddress?: string
  city?: string
  state?: string
  country?: {
    value: string
    label: string
  }
  zipCode?: string
}

export type CompanyInfoType = {
  id: string
  name: string
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

  companyAddresses: Array<CompanyAddressType>
}

export type CompanyInfoFormType = {
  companyId: string
  name: string
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

export type CompanyInfoParamsType = {
  companyId: string
  name: string
  logo?: string
  ceo?: Array<CEOInfoType>
  headquarter?: string
  timezone: CountryType
  registrationNumber?: string
  email?: string
  phone?: string
  fax?: string
}

export type CompanyAddressParamsType = {
  name?: string
  baseAddress?: string
  detailAddress?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
}
