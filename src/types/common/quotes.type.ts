import {
  ClientType,
  LanguageAndItemType,
  ProjectTeamListType,
} from '../orders/order-detail'
import { ReasonType } from '../quotes/quote'
import { ClientAddressType } from '../schema/client-address.schema'
import { ContactPersonType } from '../schema/client-contact-person.schema'
import { CountryType } from '../sign/personalInfoTypes'

import { QuotesStatus, QuotesStatusLabel } from '@src/types/common/status.type'
import { Currency } from '@src/types/common/currency.type'

export type QuotesProjectInfoFormType = {
  status: QuotesStatus & QuotesStatusLabel
  workName?: string
  projectName: string
  projectDescription?: string
  category: string
  serviceType: Array<string>
  genre?: Array<string>
  quoteDate: { date: string; timezone: { id: number | undefined, label: string; code: string, pinned: boolean } }
  projectDueDate: { date: string; timezone: { id: number | undefined, label: string; code: string, pinned: boolean } }
  quoteDeadline: { date: string; timezone: { id: number | undefined, label: string; code: string, pinned: boolean } }
  quoteExpiryDate: { date: string; timezone: { id: number | undefined, label: string; code: string, pinned: boolean } }
  estimatedDeliveryDate: { date: string; timezone: { id: number | undefined, label: string; code: string, pinned: boolean } }
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
  genre?: Array<string>
  quoteDate: { date: Date; timezone: { id: number | undefined, label: string; code: string, pinned: boolean } }
  projectDueDate: { date: Date; timezone: { id: number | undefined, label: string; code: string, pinned: boolean } }
  quoteDeadline: { date: Date; timezone: { id: number | undefined, label: string; code: string, pinned: boolean } }
  quoteExpiryDate: { date: Date; timezone: { id: number | undefined, label: string; code: string, pinned: boolean } }
  estimatedDeliveryDate: { date: Date; timezone: { id: number | undefined, label: string; code: string, pinned: boolean } }
  showDescription: boolean
  tax: number | null
  isTaxable: boolean
  subtotal: number
}

export type QuotesListType = {
  id: number
  corporationId: string
  status: QuotesStatusLabel
  projectName: string
  currency: Currency
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
  status: QuotesStatus & QuotesStatusLabel
  workName: string
  category: string
  serviceType: string[]
  genre: string[]
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
