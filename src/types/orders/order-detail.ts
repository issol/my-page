import { ServiceType } from '@src/shared/const/service-type/service-type.enum'
import { OrderStatusType } from './order-list'
import { CountryType } from '../sign/personalInfoTypes'
import { ContactPersonType } from '../schema/client-contact-person.schema'
import { ClientAddressType } from '../schema/client-address.schema'
import { number } from 'yup'

type PositionType = 'Supervisor' | 'Project manager' | 'Team member'

export type ProjectTeamType = {
  id: number
  position: PositionType
  member: string
  jobTitle: string
}

export type ProjectTeamCellType = {
  row: ProjectTeamType
}

export type ProjectInfoType = {
  id: number
  corporationId: string
  orderedAt: string
  status: OrderStatusType
  workName: string
  category: string
  serviceType: string[]
  expertise: string[]
  revenueFrom: string
  projectName: string
  projectDueAt: { date: string; timezone: CountryType }
  projectDescription: string
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
  }

  contactPerson: ContactPersonType | null
  clientAddress: ClientAddressType[]
}

export type HistoryType = {
  projectInfo: ProjectInfoType
  client: ClientType
  projectTeam: ProjectTeamType[]
}

export type VersionHistoryType = {
  id: number
  version: number
  email: string
  downloadedAt: string
  history: HistoryType
}
