import { ClientAddressFormType } from '../schema/client-address.schema'
import { ClientContactPersonType } from '../schema/client-contact-person.schema'
import { CompanyInfoFormType } from '../schema/company-info.schema'

export type ClientDetailType = Omit<CompanyInfoFormType, 'memo'> & {
  memos: Array<ClientMemoType>
} & ClientAddressFormType &
  ClientContactPersonType

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
