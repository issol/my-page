export enum FilterKey {
  JOB_LIST = 'jobListFilter',
  ORDER_LIST = 'orderListFilter',
  LPM_REQUEST_LIST = 'lpmRequestListFilter',
  CLIENT_REQUEST_LIST = 'clientRequestListFilter',
  QUOTE_LIST = 'quoteListFilter',
  JOB_TRACKER_LIST = 'jobTrackerFilter',
  JOB_TEMPLATE_LIST = 'jobTemplateFilter',
  INVOICE_RECEIVABLE_LIST = 'invoiceReceivableListFilter',
  INVOICE_PAYABLE_LIST = 'invoicePayableListFilter',
  PRO_LIST = 'proListFilter',
  LINGUIST_TEAM_LIST = 'linguistTeamListFilter',
  CLIENT_LIST = 'clientListFilter',
}

export function saveUserFilters(key: string, filters: any) {
  if (typeof window === 'object') {
    window.localStorage.setItem(key, JSON.stringify(filters))
  }
}

export function getUserFilters(key: string) {
  if (typeof window === 'object') {
    return window.localStorage.getItem(key)
  }
}

export function removeUserFilters(key: string) {
  if (typeof window === 'object') {
    window.localStorage.removeItem(key)
  }
}
