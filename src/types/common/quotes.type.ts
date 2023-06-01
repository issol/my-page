import {
  ClientType,
  LanguageAndItemType,
  ProjectTeamListType,
} from '../orders/order-detail'
import { ClientAddressType } from '../schema/client-address.schema'
import { ContactPersonType } from '../schema/client-contact-person.schema'
import { CountryType } from '../sign/personalInfoTypes'
import { ItemType } from './item.type'

export type QuoteStatusType =
  | 'New'
  | 'In preparation'
  | 'Review before submission'
  | 'Pending'
  | 'Expired'
  | 'Rejected'
  | 'Accepted'
  | 'Changed into order'
  | 'Canceled'

export type QuotesProjectInfoFormType = {
  status: QuoteStatusType
  workName?: string
  projectName: string
  projectDescription?: string
  category: string
  serviceType: Array<string>
  expertise?: Array<string>
  quoteDate: string
  projectDueDate: { date: string; timezone: CountryType }
  quoteDeadline: { date: string; timezone: CountryType }
  quoteExpiryDate: { date: string; timezone: CountryType }
  estimatedDeliveryDate: { date: string; timezone: CountryType }
  tax: number | null
  taxable: boolean
}

export type QuotesListType = {
  id: string
  corporationId: string
  status: QuoteStatusType
  projectName: string
  client: {
    name: string
    email: string
  }
  contactPerson: {
    firstName: string
    middleName: string | null
    lastName: string
    email: string
  }
  category: string
  serviceType: Array<string>
  quoteDate: string
  quoteDeadline: string
  quoteExpiry: string
  totalPrice: number
}

export type ProjectInfoType = {
  id: number
  corporationId: string
  quoteDate: string
  status: QuoteStatusType
  workName: string
  category: string
  serviceType: string[]
  expertise: string[]
  projectName: string
  projectDescription: string
  projectDueAt: string
  projectDueTimezone: CountryType
  quoteDeadline: string
  quoteDeadlineTimezone: CountryType
  quoteExpiryDate: string
  quoteExpiryDateTimezone: CountryType
  estimatedDeliveryDate: string
  estimatedDeliveryDateTimezone: CountryType
  tax: number | null
  taxable: boolean
}

export type VersionHistoryType = HistoryType & {
  id: number
  version: number
  email: string
  downloadedAt: string
}

export type HistoryType = {
  projectInfo: ProjectInfoType
  client: ClientType
  projectTeam: ProjectTeamListType[]
  items: LanguageAndItemType
}

// TODO: 스키마수정하기
export type QuoteDownloadData = {
  quoteId: number
  adminCompanyName: string
  companyAddress: string
  corporationId: string
  quoteDate: string
  projectDueDate: { date: string; timezone: CountryType | undefined }
  quoteDeadline: { date: string; timezone: CountryType | undefined }
  quoteExpiryDate: { date: string; timezone: CountryType | undefined }
  estimatedDeliveryDate: { date: string; timezone: CountryType | undefined }
  pm: {
    email: string
    firstName: string
    middleName: string | null
    lastName: string
  }
  companyName: string
  projectName: string
  client: ClientType | undefined
  contactPerson: ContactPersonType | null
  clientAddress: ClientAddressType[]
  langItem: LanguageAndItemType | undefined
}