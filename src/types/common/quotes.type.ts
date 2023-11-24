import {
  ClientType,
  LanguageAndItemType,
  ProjectTeamListType,
} from '../orders/order-detail'
import { ReasonType } from '../quotes/quote'
import { CancelReasonType } from '../requests/detail.type'
import { ClientAddressType } from '../schema/client-address.schema'
import { ContactPersonType } from '../schema/client-contact-person.schema'
import { CountryType } from '../sign/personalInfoTypes'
import { ItemType } from './item.type'
import { CurrencyType } from './standard-price'

export type QuoteStatusType =
  | 'New'
  | 'In preparation'
  | 'Internal review'
  | 'Client review'
  | 'Quote sent'
  | 'Expired'
  | 'Rejected'
  | 'Accepted'
  | 'Changed into order'
  | 'Canceled'
  | 'Under review'
  | 'Revision requested'
  | 'Under revision'
  | 'Revised'

export type QuotesStatusType =
  | 20000
  | 20100
  | 20200
  | 20300
  | 20400
  | 20500
  | 20600
  | 20700
  | 20800
  | 20900
  | 201000
  | 201100
  | 201200

export type QuotesProjectInfoFormType = {
  status: QuoteStatusType
  workName?: string
  projectName: string
  projectDescription?: string
  category: string
  serviceType: Array<string>
  expertise?: Array<string>
  quoteDate: { date: string; timezone: CountryType }
  projectDueDate: { date: string; timezone: CountryType }
  quoteDeadline: { date: string; timezone: CountryType }
  quoteExpiryDate: { date: string; timezone: CountryType }
  estimatedDeliveryDate: { date: string; timezone: CountryType }
  showDescription: '1' | '0'
  tax: number | null
  isTaxable: '1' | '0'
  subtotal: number
}

export type QuotesProjectInfoAddNewType = {
  status: number
  workName?: string
  projectName: string
  projectDescription?: string
  category: string
  serviceType: Array<string>
  expertise?: Array<string>
  quoteDate: { date: Date; timezone: CountryType }
  projectDueDate: { date: string; timezone: CountryType }
  quoteDeadline: { date: string; timezone: CountryType }
  quoteExpiryDate: { date: Date; timezone: CountryType }
  estimatedDeliveryDate: { date: string; timezone: CountryType }
  showDescription: boolean
  tax: number | null
  isTaxable: boolean
  subtotal: number
}

export type QuotesListType = {
  id: number
  corporationId: string
  status: QuoteStatusType
  projectName: string
  currency: CurrencyType
  client: {
    name: string
    email: string
  }
  lsp?: {
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
  quoteDateTimezone: CountryType
  projectDueAt: string
  projectDueTimezone: CountryType
  quoteDeadline: string
  quoteDeadlineTimezone: CountryType
  quoteExpiryDate: string
  quoteExpiryDateTimezone: CountryType
  estimatedAt: string
  estimatedTimezone: CountryType
  totalPrice: number
  updatedAt: string
  subtotal: number
  sortIndex?: number
}

export type ProjectInfoType = {
  id: number
  corporationId: string
  quoteDate: string
  quoteDateTimezone: CountryType
  status: QuoteStatusType
  workName: string
  category: string
  serviceType: string[]
  expertise: string[]
  projectName: string
  projectDescription: string
  showDescription: boolean
  projectDueAt: string
  projectDueTimezone: CountryType
  quoteDeadline: string
  quoteDeadlineTimezone: CountryType
  quoteExpiryDate: string
  quoteExpiryDateTimezone: CountryType
  estimatedAt: string
  estimatedTimezone: CountryType
  tax: number | null
  isTaxable: boolean
  isConfirmed: boolean
  confirmedAt: string | null
  reason: ReasonType | null
  linkedOrder: {
    id: number
    corporationId: string
  } | null

  linkedRequest: {
    id: number
    corporationId: string
  } | null
  subtotal: string | number
  // history 처리를 위해 추가
  contactPerson?: ContactPersonType
}

export type VersionHistoryType = HistoryType & {
  id: number
  version: number
  email: string
  // downloadedAt: string
  confirmedAt: string
}

export type HistoryType = {
  projectInfo: ProjectInfoType
  client: ClientType
  projectTeam: { members: ProjectTeamListType[]; quoteId: number }
  items: LanguageAndItemType
}

export type QuoteDownloadData = {
  quoteId: number
  adminCompanyName: string
  companyAddress: string
  corporationId: string
  quoteDate: { date: string; timezone: CountryType | undefined }
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
  subtotal: string | number | undefined
}
