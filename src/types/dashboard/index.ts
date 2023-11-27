export interface DashboardQuery {
  from: string // 시작 날짜
  to: string // 종료날짜
}

export type ReportItem = {
  requests: number
  quotes: number
  orders: number
  receivables: number
  payables: number
  canceled: number
}
