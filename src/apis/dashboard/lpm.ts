import { ClientDetailType } from '@src/types/client/client'
import axios from '@src/configs/axios'
import {
  DashboardMemberQuery,
  DashboardPaginationQuery,
  DashboardQuery,
  OrderQuery,
  RatioQuery,
  ReportItem,
} from '@src/types/dashboard'

export const getReport = async (
  params: DashboardQuery,
): Promise<ReportItem> => {
  console.log('23423423234234', params)
  const { data } = await axios.get(`/api/enough/u/dashboard/summary`, {
    params,
  })
  return data
}

export const getRequest = async (params: DashboardPaginationQuery) => {
  const { data } = await axios.get(
    `/api/enough/u/dashboard/client-request/list/new`,
    {
      params,
    },
  )
  return data
}

export const getRatio = async (params: RatioQuery) => {
  const { type, ...props } = params
  const { data } = await axios.get(`/api/enough/u/dashboard/ratio/${type}`, {
    params: { ...props },
  })
  return data
}

export const getOrders = async (params: OrderQuery) => {
  const { data } = await axios.get(`/api/enough/u/dashboard/order/list`, {
    params,
  })
  return data
}

export const getCount = async (params: DashboardQuery) => {
  const { data } = await axios.get(`/api/enough/u/dashboard/order/count`, {
    params: params,
  })
  return data
}

export const getMemberList = async (params: DashboardMemberQuery) => {
  const { data } = await axios.get('api/enough/a/role/us', { params })
  return data
}
