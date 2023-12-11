import axios from '@src/configs/axios'
import {
  CountQuery,
  Currency,
  DashboardMemberQuery,
  DashboardPaginationQuery,
  DashboardQuery,
  LongStandingQuery,
  RatioQuery,
  ReportItem,
  RequestQuery,
} from '@src/types/dashboard'
import {
  usePaidThisMonthAmount,
  useTADOnboarding,
} from '@src/queries/dashboard/dashnaord-lpm'

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

export const getRatio = async (params: RatioQuery) => {
  const { type, apiType, ...props } = params
  const { data } = await axios.get(
    `/api/enough/${apiType}/dashboard/ratio/${type}`,
    {
      params: { ...props },
    },
  )
  return data
}

export const getOrders = async ({ countType, ...props }: CountQuery) => {
  const { data } = await axios.get(
    `/api/enough/u/dashboard/${countType}/list`,
    {
      params: { ...props },
    },
  )
  return data
}

export const getCount = async (params: DashboardQuery) => {
  const { data } = await axios.get(`/api/enough/u/dashboard/order/count`, {
    params: params,
  })
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
export const getPaidThisMonth = async (
  type: 'payable' | 'receivable',
  currency: Currency,
) => {
  const { data } = await axios.get(
    `/api/enough/u/dashboard/invoice/${type}/paid/total-price`,
    { params: { currency } },
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

export const getLanguagePool = async (base: 'source' | 'target' | 'pair') => {
  const { data } = await axios.get(
    `/api/enough/cert/dashboard/language/count`,
    { params: { base } },
  )
  return data
}
