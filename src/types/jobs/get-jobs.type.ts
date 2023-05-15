import { CurrencyType } from '../common/standard-price'
import { JobStatusType } from './common.type'

export type JobsListType = {
  id: string
  corporationId: string // O-000010-TRA-001
  status: JobStatusType
  client: {
    name: string
    email: string
  }
  jobName: string
  category: string // order의 category
  serviceType: string // job의 serviceType
  startedAt: string
  dueAt: string
  totalPrice: number
  currency: CurrencyType
}
