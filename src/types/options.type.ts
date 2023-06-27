import { CountryType } from './sign/personalInfoTypes'

export type UnitOptionType = {
  id: number
  name: string
  isAvailable: boolean
}

export type CompanyType = 'LSP' //추후 추가될 수 있음

export type CompanyOptionType = {
  id: string
  name: string
  type: string
  headquarter: string
  registrationNumber: string | null
  email: string
  phone: string | null
  fax: string | null
  ceo: string | null
  timezone: CountryType
}
