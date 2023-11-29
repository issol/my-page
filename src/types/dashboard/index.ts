export interface DashboardQuery {
  from: string // 시작 날짜
  to: string // 종료날짜
}

export interface DashboardPaginationQuery {
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

export type Currency = 'USD' | 'JPY' | 'KRW' | 'SGD'
export interface RatioQuery extends DashboardQuery {
  type: string
  currency: Currency
}

export type RatioItem = {
  count: number
  name: string
  ratio: number
  sortingOrder: number
  sum: number
}

export type RatioResponse = {
  totalOrderCount: number
  totalOrderPrice: number
  currency: Currency
  reportByClient: Array<RatioItem>
}
