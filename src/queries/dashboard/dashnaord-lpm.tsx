import { useQuery } from 'react-query'

import {
  getCount,
  getOrders,
  getRatio,
  getReport,
  getRequest,
} from '@src/apis/dashboard/lpm'
import type { DashboardQuery, ViewMode } from '@src/types/dashboard'
import {
  Currency,
  DashboardPaginationQuery,
  OrderQuery,
  RatioItem,
  RatioQuery,
  RatioResponse,
} from '@src/types/dashboard'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { dashboardState } from '@src/states/dashboard'
import { useRouter } from 'next/router'

const DEFAULT_QUERY_NAME = 'dashboard'

const getUserViewModeInfo = (): { userId: number | null; view: ViewMode } => {
  const auth = JSON.parse(window.sessionStorage.getItem('userData') || '')
  const role = JSON.parse(window.sessionStorage.getItem('currentRole') || '')

  if (role?.type === 'Master' || role?.type === 'Manager') {
    return { userId: auth.userId, view: 'company' }
  }
  return { userId: auth.userId, view: 'mine' }
}

export const useDashboardReport = (query: DashboardQuery) => {
  const { userId, view } = getUserViewModeInfo()

  return useQuery(
    [`${DEFAULT_QUERY_NAME}-report`, query.from, query.to],
    () => {
      return getReport({ ...query, userId, view })
    },
    {
      staleTime: 60 * 1000, // 1
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useDashboardRequest = (
  query: DashboardPaginationQuery,
  skip: number,
) => {
  const { userId, view } = getUserViewModeInfo()
  return useQuery(
    [`${DEFAULT_QUERY_NAME}-request`, skip],
    () => {
      return getRequest({ ...query, skip, userId, view })
    },
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useDashboardRatio = <T extends RatioItem>({
  currency,
  from,
  to,
  ...props
}: RatioQuery) => {
  const { userId, view } = getUserViewModeInfo()

  return useQuery<RatioResponse<T>>(
    [`${DEFAULT_QUERY_NAME}-ratio-${props.type}`, currency, from, to],
    () => {
      return getRatio({
        ...props,
        currency,
        from,
        to,
        userId,
        view,
      })
    },
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useDashboardOrders = ({
  from,
  to,
  type,
  skip,
  sort,
  ...props
}: OrderQuery) => {
  const { userId, view } = getUserViewModeInfo()

  return useQuery(
    [`${DEFAULT_QUERY_NAME}-count`, from, to, type, skip, sort],
    () => getOrders({ ...props, from, to, type, skip, sort, userId, view }),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useDashboardCount = () => {
  const { userId, view } = getUserViewModeInfo()

  return useQuery(
    [`${DEFAULT_QUERY_NAME}-count`],
    () => getCount({ from: '2023-10-10', to: '2023-11-30', userId, view }),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}
