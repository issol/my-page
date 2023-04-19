import { ClientAddressFormType } from '../schema/client-address.schema'
import { ClientContactPersonType } from '../schema/client-contact-person.schema'
import { CompanyInfoFormType } from '../schema/company-info.schema'

export type ClientDetailType = Omit<CompanyInfoFormType, 'memo'> & {
  memos: Array<ClientMemoType>
} & ClientAddressFormType &
  ClientContactPersonType

export type ClientMemoType = {
  id: number
  createdAt: string
  updatedAt: string
  writerId: number
  writerFirstName: string
  writerMiddleName: string
  writerLastName: string
  writerEmail: string
  memo: string
}
