export type QuotesFilterType = {
  take: number
  skip: number
  search?: string
  quoteDate?: Date[]
  quoteDeadline?: Date[]
  quoteExpiryDate: Date[]
  hideCompletedQuotes?: boolean
  seeMyQuotes?: boolean
  status?: string[]
  client?: string[]
  category: string[]
  serviceType: string[]
  idOrder?: string
  quoteDateOrder?: string
  quoteDeadlineOrder?: string
  quoteExpiryDateOrder?: string
}
