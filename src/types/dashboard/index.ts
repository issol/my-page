import { OrderStatusType } from '@src/types/common/orders.type'
import { RoleType, UserType } from '@src/context/types'

export type ViewMode = 'company' | 'personal'
export interface ViewModeQuery {
  userId: number | null
  view: ViewMode
}

export interface DashboardQuery extends Partial<ViewModeQuery> {
  from: string // 시작 날짜
  to: string // 종료날짜
}

export type RequestType = 'new' | 'recruiting'
export interface DashboardPaginationQuery extends Partial<ViewModeQuery> {
  type: RequestType
  take: number
  skip: number
}

export interface DashboardMemberQuery
  extends Pick<DashboardPaginationQuery, 'take' | 'skip'> {
  search: string
}

export type ReportItem = {
  requests: number
  quotes: number
  orders: number
  receivables: number
  payables: number
  canceled: number
}

export type RequestItem = {
  id: number
  corporationId: string
  client: number
  companyName: string
  category: string
  serviceType: string
  itemCount: number
  desiredDueDate: string
  desiredDueTimezone: {
    code: string
    label: string
    phone: string
  }
}
export type OrderItem = {
  id: number
  projectName: string
  category: string
  serviceType: string
  status: OrderStatusType
  client: {
    id: number
    name: string
    email: string
  }
}

export type JobItem = {
  id: number
  jobName: string
  jobType: string
  status: OrderStatusType
  pro: Partial<MemberItem>
}

export type Currency =
  | 'convertedToJPY'
  | 'convertedToKRW'
  | 'convertedToSGD'
  | 'convertedToUSD'
  | 'onlyJPY'
  | 'onlyKRW'
  | 'onlySGD'
  | 'onlyUSD'

export type APIType = 'u' | 'cert'

export interface RatioQuery extends DashboardQuery, Partial<ViewModeQuery> {
  type: string
  currency: Currency
  apiType?: APIType
}

export interface RatioItem {
  count: number
  name?: string
  ratio: number
  sortingOrder: number
  sum: number
  apiType?: APIType
}

export interface PairRatioItem extends RatioItem {
  sourceLanguage: string
  targetLanguage: string
}

export interface CategoryRatioItem extends RatioItem {
  category: string
}

export interface ServiceRatioItem extends RatioItem {
  serviceType: string
}

export interface ExpertiseRatioItem extends RatioItem {
  expertise: string
}
export interface RatioResponse<T> {
  totalOrderCount: number
  totalOrderPrice: number
  currency: Currency
  report: Array<T>
}

export type MemberItem = {
  userId: number
  permissionGroups: Array<string>
  companyId: string
  firstName: string
  middleName: string | null
  lastName: string
  email: string
  jobTitle: string
  type: UserType
  department: string | null
  createdAt: string | Date
  updatedAt: string | Date
  deletedAt: string | Date
}

export type ViewType = 'created' | 'invoiced' | 'canceled' | 'ongoing'

export type OrderType = 'asc' | 'desc'

export interface CountQuery
  extends DashboardQuery,
    Omit<DashboardPaginationQuery, 'type'>,
    Partial<ViewModeQuery> {
  type: ViewType
  countType: 'job' | 'order'
  sort: string
  ordering: OrderType
}
