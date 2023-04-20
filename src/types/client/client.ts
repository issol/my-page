import { ClientAddressFormType } from '../schema/client-address.schema'
import {
  ClientContactPersonType,
  ContactPersonType,
} from '../schema/client-contact-person.schema'
import { CompanyInfoFormType } from '../schema/company-info.schema'
import { CountryType } from '../sign/personalInfoTypes'

export type CreateClientResType = {
  adminCompanyName: string
  clientType: string
  name: string
  email: string
  phone: string | null
  mobile: string | null
  fax: string | null
  websiteLink: string | null
  timezone: CountryType
  corporationId: string
  status: string
  memo: string | null
  clientId: number
}

export type CreateContactPersonFormType = ContactPersonType & {
  clientId: number
}

export type ClientMemoType = ClientMemoCommonType & {
  id: number
  createdAt: string
  updatedAt: string
}

export type ClientMemoPostType = ClientMemoCommonType & {
  clientId: number
}

export type ClientMemoCommonType = {
  writerId: number
  writerFirstName: string
  writerMiddleName: string
  writerLastName: string
  writerEmail: string
  memo: string
}

export type ClientDetailType = Omit<CompanyInfoFormType, 'memo'> & {
  memos: Array<ClientMemoType>
} & ClientAddressFormType & {
    clientId: number
    corporationId: string
    authorId: number
  } & ClientContactPersonType & { isReferred: boolean }
