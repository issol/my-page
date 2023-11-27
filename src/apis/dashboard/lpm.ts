import { ClientDetailType } from '@src/types/client/client'
import axios from '@src/configs/axios'
import { DashboardQuery, ReportItem } from '@src/types/dashboard'

export const getReport = async (
  params: DashboardQuery,
): Promise<ReportItem> => {
  const { data } = await axios.get(`/api/enough/u/dashboard/summary`, {
    params,
  })
  return data
}
