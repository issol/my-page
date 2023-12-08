import axios from '@src/configs/axios'
import {
  CountQuery,
  DashboardMemberQuery,
  DashboardPaginationQuery,
  DashboardQuery,
  LongStandingQuery,
  RatioQuery,
  ReportItem,
  RequestQuery,
} from '@src/types/dashboard'

export const getReport = async (
  params: DashboardQuery,
): Promise<ReportItem> => {
  const { data } = await axios.get(`/api/enough/u/dashboard/summary`, {
    params,
  })
  return data
}

export const getRequest = async ({ type, ...params }: RequestQuery) => {
  const { data } = await axios.get(
    `/api/enough/u/dashboard/client-request/list/${type}`,
    {
      params,
    },
  )
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
