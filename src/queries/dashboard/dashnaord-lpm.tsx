import { useQuery } from 'react-query'

import { getReport, getRequest } from '@src/apis/dashboard/lpm'
import type { DashboardQuery } from '@src/types/dashboard'
import { DashboardPaginationQuery } from '@src/types/dashboard'

const DEFAULT_QUERY_NAME = 'dashboard'
export const useDashboardReport = (query: DashboardQuery) => {
  return useQuery(
    [`${DEFAULT_QUERY_NAME}-report`],
    () => {
      return getReport(query)
    },
    {
      staleTime: 60 * 1000, // 1
      suspense: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useDashboardRequest = (query: DashboardPaginationQuery) => {
  return useQuery(
    [`${DEFAULT_QUERY_NAME}-request`],
    () => {
      return getRequest(query)
    },
    {
      staleTime: 60 * 1000, // 1
      suspense: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}
