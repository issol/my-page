import { ServiceType } from '@src/shared/const/service-type/service-type.enum'
import { CountryType } from '../sign/personalInfoTypes'
import { ContactPersonType } from '../schema/client-contact-person.schema'
import { ClientAddressType } from '../schema/client-address.schema'
import { Row } from '@src/pages/orders/order-list/detail/components/rows'
import { OrderStatusType, RevenueFormType } from '../common/orders.type'
import { ItemType } from '../common/item.type'
import { CurrencyType } from '../common/standard-price'
import { ReasonType } from '../quotes/quote'

export type PositionType = 'supervisor' | 'projectManager' | 'teamMember'

export type ProjectTeamListType = {
  userId: number
  position: PositionType
  firstName: string
  middleName: string | null
  lastName: string
  email: string
  jobTitle: string
}

export type ProjectTeamCellType = {
  row: ProjectTeamListType
}

export type DeliveryFileType = {
  id?: number
  createdAt?: string
  type?: 'imported' | 'uploaded' | 'existing'
  filePath: string
  fileName: string
  fileExtension: string
  fileSize: number
}

export type ProjectInfoType = {
  id: number
  corporationId: string
  orderedAt: string
  status: OrderStatusType
  previousStatus: number
  workName: string
  category: string
  serviceType: string[]
  expertise: string[]
  revenueFrom: RevenueFormType
  parentOrderId: number
  hasChildOrder: boolean
  projectName: string
  projectDueAt: string
  projectDueTimezone: CountryType
  projectDescription: string
  showDescription: boolean
  tax: number
  isTaxable: boolean

  linkedInvoiceReceivable: {
    id: number
    corporationId: string
  } | null
  linkedJobs: {
    id: number
    corporationId: string
  }[]

  linkedQuote: {
    id: number
    corporationId: string
  } | null
  linkedRequest: {
    id: number
    corporationId: string
  } | null

  reason: ReasonType | null
  deliveries: DeliveryFileType[]
  feedback: string | null
  subtotal: string
}

export type ClientType = {
  addressType: string
  client: {
    clientId: number
    email: string
    fax: string | null
    mobile: string | null
    phone: string | null
    timezone: CountryType
    name: string
    taxable: boolean
    tax: number | null
  }

  contactPerson: ContactPersonType | null
  clientAddress: ClientAddressType[]
}

export type HistoryType = {
  projectInfo: ProjectInfoType
  client: ClientType
  projectTeam: ProjectTeamListType[]
}

export type VersionHistoryType = {
  id: number
  version: number
  email: string
  downloadedAt: string
  items: LanguageAndItemType
} & HistoryType

export type OrderDownloadData = {
  orderId: number
  adminCompanyName: string
  companyAddress: string
  corporationId: string
  orderedAt: string
  projectDueAt: { date: string; timezone: CountryType }
  pm: {
    email: string
    firstName: string
    middleName: string | null
    lastName: string
  }
  companyName: string
  projectName: string
  client: ClientType
  contactPerson: ContactPersonType | null
  clientAddress: ClientAddressType[]
  langItem: LanguageAndItemType
}

export type LanguageAndItemType = {
  id: number
  languagePairs: Array<LanguagePairTypeInItem>
  items: ItemType[]
}

export type LanguagePairTypeInItem = {
  id: number
  source: string
  target: string
  price: {
    id: number
    name: string
    isStandard: boolean
    category: string
    serviceType: Array<string>
    currency: CurrencyType
    calculationBasis: string
    rounding: number
    numberPlace: number
    authorId: number
  } | null
  minimumPrice?: string | null
  currency?: string | null
}

export type OrderDetailType = {
  id: number
  corporationId: string
  category: string
  client: {
    clientId: number
    email: string
    fax: string | null
    mobile: string | null
    phone: string | null
    timezone: CountryType
    name: string
  }
  contactPerson: ContactPersonType | null
}
