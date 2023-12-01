import { useQuery } from 'react-query'

import { getRatio, getReport, getRequest } from '@src/apis/dashboard/lpm'
import type { DashboardQuery } from '@src/types/dashboard'
import {
  Currency,
  DashboardPaginationQuery,
  RatioItem,
  RatioQuery,
  RatioResponse,
} from '@src/types/dashboard'

const DEFAULT_QUERY_NAME = 'dashboard'
export const useDashboardReport = (query: DashboardQuery) => {
  return useQuery(
    [`${DEFAULT_QUERY_NAME}-report`, query.from, query.to],
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

export const useDashboardRequest = (
  query: DashboardPaginationQuery,
  skip: number,
) => {
  return useQuery(
    [`${DEFAULT_QUERY_NAME}-request`, skip],
    () => {
      return getRequest({ ...query, skip })
    },
    {
      suspense: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useDashboardRatio = <T extends RatioItem>(
  query: Omit<RatioQuery, 'currency'>,
  currency: Currency,
) => {
  return useQuery<RatioResponse<T>>(
    [`${DEFAULT_QUERY_NAME}-ratio-${query.type}`, currency],
    () => {
      return getRatio({ ...query, currency: currency })
    },
    {
      suspense: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}
