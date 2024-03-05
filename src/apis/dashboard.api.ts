import axios from '@src/configs/axios'
import {
  CountQuery,
  Currency,
  DashboardMemberQuery,
  DashboardOngoingCountQuery,
  DashboardQuery,
  ExpectedIncomeQuery,
  LongStandingQuery,
  PaymentType,
  RatioQuery,
  ReportItem,
  RequestQuery,
  TotalAmountQuery,
  ViewModeQuery,
} from '@src/types/dashboard'

export const getReport = async (
  params: DashboardQuery,
): Promise<ReportItem> => {
  const { data } = await axios.get(`/api/enough/u/dashboard/summary`, {
    params,
  })
  return data
}

export const getRequest = async ({ path, ...params }: RequestQuery) => {
  const { data } = await axios.get(`/api/enough/${path}`, {
    params,
  })
  return data
}

export const getRatio = async ({ filter, ...params }: RatioQuery) => {
  const { type, apiType, path, ...props } = params
  const fullPath = path || `ratio/${type}`
  const { data } = await axios.get(
    `/api/enough/${apiType}/dashboard/${fullPath}`,
    {
      params: { ...props, type: filter },
    },
  )
  return data
}

export const getOngoing = async ({ countType, ...props }: CountQuery) => {
  const apiType = countType === 'application' ? 'cert' : 'u'

  const { data } = await axios.get(
    `/api/enough/${apiType}/dashboard/${countType}/list`,
    {
      params: { ...props },
    },
  )
  return data
}

export const getCount = async ({
  countType,
  ...params
}: DashboardOngoingCountQuery) => {
  const apiType = countType === 'application' ? 'cert' : 'u'

  const { data } = await axios.get(
    `/api/enough/${apiType}/dashboard/${countType}/count`,
    {
      params: { ...params, type: params?.filter },
    },
  )
  return data
}

export const getMemberList = async (params: DashboardMemberQuery) => {
  const { data } = await axios.get('/api/enough/a/role/us', { params })
  return data
}

export const getJobRolePool = async () => {
  const { data } = await axios.get('/api/enough/cert/dashboard/job-type/count')
  return data
}

export const getLongStanding = async ({
  dataType,
  ...params
}: LongStandingQuery) => {
  const { data } = await axios.get(
    `/api/enough/u/dashboard/invoice/${dataType}/list/long-standing`,
    { params },
  )
  return data
}

export const getOnboardingOverview = async () => {
  const { data } = await axios.get(`/api/enough/cert/dashboard/onboard/count`)
  return data
}

/* LPM */
interface PaidThisMonthQuery extends ViewModeQuery {
  type: 'payable' | 'receivable'
  currency: Currency
}
export const getPaidThisMonth = async ({
  type,
  currency,
  ...props
}: PaidThisMonthQuery) => {
  const { data } = await axios.get(
    `/api/enough/u/dashboard/invoice/${type}/paid/total-price`,
    { params: { ...props, currency } },
  )
  return data
}

export const getTotalPrice = async (
  type: 'payable' | 'receivable',
  currency: Currency,
) => {
  const { data } = await axios.get(
    `/api/enough/u/dashboard/invoice/${type}/count`,
    { params: { currency } },
  )
  return data
}

/* TAD */
export type LanguagePoolBase = 'source' | 'target' | 'pair'
export const getLanguagePool = async (base: 'source' | 'target' | 'pair') => {
  const { data } = await axios.get(
    `/api/enough/cert/dashboard/language/count`,
    { params: { base } },
  )
  return data
}

export type JonAndRoleBase = 'jobType' | 'role' | 'pair'
export const getJobType = async (base: JonAndRoleBase) => {
  const { data } = await axios.get(
    `/api/enough/cert/dashboard/job-type/count`,
    { params: { base } },
  )
  return data
}

/* Pros */
export const getJobOverView = async () => {
  const { data } = await axios.get(`/api/enough/u/dashboard/job/overview`)
  return data
}

// NOTE 상위 다섯개 고정값
export const getUpcomingDeadline = async () => {
  const { data } = await axios.get(
    `/api/enough/u/dashboard/job/list/upcoming-deadline`,
    { params: { take: 5, skip: 0 } },
  )
  return data
}

///api/enough/u/dashboard/job/expected-income
export const getExpectedIncome = async (params: ExpectedIncomeQuery) => {
  const { data } = await axios.get(
    `/api/enough/u/dashboard/job/expected-income`,
    { params },
  )
  return data
}

export const getTotalAmount = async ({
  amountType,
  ...params
}: TotalAmountQuery) => {
  const { data } = await axios.get(
    `/api/enough/u/dashboard/invoice/payable/total-amount/pro/${amountType}`,
    { params },
  )
  return data
}

export const getInvoiceOverview = async (
  params: Omit<TotalAmountQuery, 'amountType'>,
) => {
  const { data } = await axios.get(
    `/api/enough/u/dashboard/invoice/payable/overview/pro`,
    { params },
  )
  return data
}

export const getDeadlineCompliance = async (
  params: Omit<TotalAmountQuery, 'amountType'>,
) => {
  const { data } = await axios.get(
    `/api/enough/u/dashboard/job/deadline-compliance-rate`,
    { params },
  )
  return data
}

export const getProJobCalendar = async (
  params: Omit<TotalAmountQuery, 'amountType'>,
) => {
  const { data } = await axios.get(`/api/enough/u/dashboard/job/calendar`, {
    params,
  })

  return data
}

export const getAccountData = async (path: string, params: DashboardQuery) => {
  const { data } = await axios.get(
    `/api/enough/u/dashboard/accounting/${path}`,
    { params },
  )

  return data
}

export const getAccountPaymentType = async ({
  office,
  userType,
}: PaymentType) => {
  const { data } = await axios.get(
    `/api/enough/u/dashboard/accounting/${userType}/payment-type/count`,
    { params: { office } },
  )

  return data
}

export const getAccountOrderJobDataToCSV = async () => {
  const { data } = await axios.get(
    `/api/enough/u/account-report`,
  )

  return data
}

