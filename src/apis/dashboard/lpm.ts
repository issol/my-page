import { ClientDetailType } from '@src/types/client/client'
import axios from '@src/configs/axios'
import {
  DashboardPaginationQuery,
  DashboardQuery,
  RatioQuery,
  ReportItem,
} from '@src/types/dashboard'

export const getReport = async (
  params: DashboardQuery,
): Promise<ReportItem> => {
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
