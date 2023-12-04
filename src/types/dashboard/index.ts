import { OrderStatusType } from '@src/types/common/orders.type'

export type ViewMode = 'company' | 'personal'
export interface ViewModeQuery {
  userId: number | null
  view: ViewMode
}

export interface DashboardQuery extends Partial<ViewModeQuery> {
  from: string // 시작 날짜
  to: string // 종료날짜
}

export interface DashboardPaginationQuery extends Partial<ViewModeQuery> {
  take: number
  skip: number
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

export type Currency =
  | 'convertedToJPY'
  | 'convertedToKRW'
  | 'convertedToSGD'
  | 'convertedToUSD'
  | 'onlyJPY'
  | 'onlyKRW'
  | 'onlySGD'
  | 'onlyUSD'

export interface RatioQuery extends DashboardQuery, Partial<ViewModeQuery> {
  type: string
  currency: Currency
}

export interface RatioItem {
  count: number
  name?: string
  ratio: number
  sortingOrder: number
  sum: number
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

export type ViewType = 'created' | 'invoiced' | 'canceled' | 'ongoing'
export type SortType = 'status' | 'clientName' | 'projectName' | 'category'
export interface OrderQuery
  extends DashboardQuery,
    DashboardPaginationQuery,
    Partial<ViewModeQuery> {
  type: ViewType
  sort: SortType
}
