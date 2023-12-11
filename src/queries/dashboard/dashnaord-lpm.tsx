import { useQuery } from 'react-query'

import {
  getCount,
  getLongStanding,
  getMemberList,
  getOnboardingOverview,
  getOrders,
  getPaidThisMonth,
  getRatio,
  getReport,
  getRequest,
  getTotalPrice,
} from '@src/apis/dashboard/lpm'
import type {
  Currency,
  DashboardQuery,
  RequestQuery,
  TotalItem,
  ViewMode,
} from '@src/types/dashboard'
import {
  CountQuery,
  DashboardMemberQuery,
  DashboardPaginationQuery,
  LongStandingQuery,
  RatioItem,
  RatioQuery,
  RatioResponse,
} from '@src/types/dashboard'
import { useRecoilValue } from 'recoil'
import { dashboardState } from '@src/states/dashboard'

export const DEFAULT_QUERY_NAME = 'dashboard'
export const NO_DATE_EFFECT = 'noDateEffect'
export const PAGINATION = 'pagination'

const getUserViewModeInfo = (): { userId: number | null; view: ViewMode } => {
  const auth = JSON.parse(window.sessionStorage.getItem('userData') || '')
  const role = JSON.parse(window.sessionStorage.getItem('currentRole') || '')

  if (role?.type === 'Master' || role?.type === 'Manager') {
    return { userId: auth.userId, view: 'company' }
  }
  return { userId: auth.userId, view: 'personal' }
}

export const useDashboardReport = (query: DashboardQuery) => {
  const { userId: initUserId, view: initView } = getUserViewModeInfo()
  const { view: changeView, userId: changeUserId } =
    useRecoilValue(dashboardState)
  const view = changeView ? changeView : initView
  const userId = changeUserId ? changeUserId : initUserId

  return useQuery(
    [
      DEFAULT_QUERY_NAME,
      `${DEFAULT_QUERY_NAME}-report`,
      { ...query },
      view,
      userId,
    ],
    () => {
      return getReport({
        ...query,
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

export const useDashboardRequest = (query: RequestQuery, skip: number) => {
  const { userId: initUserId, view: initView } = getUserViewModeInfo()
  const { view: changeView, userId: changeUserId } =
    useRecoilValue(dashboardState)
  const view = changeView ? changeView : initView
  const userId = changeUserId ? changeUserId : initUserId

  return useQuery(
    [
      DEFAULT_QUERY_NAME,
      `${DEFAULT_QUERY_NAME}-request`,
      view,
      userId,
      query.path,
      skip,
    ],
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
  const { userId: initUserId, view: initView } = getUserViewModeInfo()
  const { view: changeView, userId: changeUserId } =
    useRecoilValue(dashboardState)
  const view = changeView ? changeView : initView
  const userId = changeUserId ? changeUserId : initUserId

  return useQuery<RatioResponse<T>>(
    [
      DEFAULT_QUERY_NAME,
      `${DEFAULT_QUERY_NAME}-ratio-${props.type}`,
      view,
      userId,
      currency,
      from,
      to,
    ],
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

export const useDashboardCountList = ({
  from,
  to,
  type,
  skip,
  sort,
  countType,
  ...props
}: CountQuery) => {
  const { userId: initUserId, view: initView } = getUserViewModeInfo()
  const { view: changeView, userId: changeUserId } =
    useRecoilValue(dashboardState)
  const view = changeView ? changeView : initView
  const userId = changeUserId ? changeUserId : initUserId

  return useQuery(
    [
      DEFAULT_QUERY_NAME,
      `${DEFAULT_QUERY_NAME}-count`,
      view,
      userId,
      countType,
      type,
      from,
      to,
      skip,
      sort,
    ],
    () =>
      getOrders({
        ...props,
        from,
        to,
        type,
        skip,
        sort,
        userId,
        view,
        countType,
      }),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useDashboardCount = ({ to, from }: DashboardQuery) => {
  const { userId: initUserId, view: initView } = getUserViewModeInfo()
  const { view: changeView, userId: changeUserId } =
    useRecoilValue(dashboardState)
  const view = changeView ? changeView : initView
  const userId = changeUserId ? changeUserId : initUserId

  return useQuery(
    [DEFAULT_QUERY_NAME, `${DEFAULT_QUERY_NAME}-count`, userId, to, from, view],
    () => getCount({ to, from, userId, view }),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useDashboardMemberList = ({
  search,
  take,
  skip,
}: DashboardMemberQuery) => {
  return useQuery(
    ['member', search, take, skip],
    () => getMemberList({ search, take, skip }),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useJobRolePoolList = () => {
  return useQuery([DEFAULT_QUERY_NAME, 'role'], () => {})
}

export const useLongStanding = (params: LongStandingQuery) => {
  const { userId: initUserId, view: initView } = getUserViewModeInfo()
  const { view: changeView, userId: changeUserId } =
    useRecoilValue(dashboardState)
  const view = changeView ? changeView : initView
  const userId = changeUserId ? changeUserId : initUserId

  return useQuery<{ data: Array<any>; count: number; totalCount: number }>(
    [
      DEFAULT_QUERY_NAME,
      NO_DATE_EFFECT,
      PAGINATION,
      view,
      userId,
      params.dataType,
      params.skip,
      { sort: params.sort, ordering: params.ordering },
    ],
    () => getLongStanding({ ...params, view, userId }),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export type OverviewType = 'onboarded' | 'onboarding' | 'failed'
export const useTADOnboarding = () => {
  return useQuery<Record<OverviewType, number>>(
    [DEFAULT_QUERY_NAME, NO_DATE_EFFECT, 'Onboarding'],
    () => getOnboardingOverview(),
  )
}

/* LPM Query*/

/**
 * Receivables/Payables - Paid this month
 * @param type
 * @param currency
 */
export const usePaidThisMonthAmount = (
  type: 'payable' | 'receivable',
  currency: Currency,
) => {
  return useQuery<{ totalPrice: number; currency: Currency; count: number }>(
    [DEFAULT_QUERY_NAME, NO_DATE_EFFECT, 'PaidThisMonth', type, currency],
    () => getPaidThisMonth(type, currency),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useTotalPrice = (
  type: 'payable' | 'receivable',
  currency: Currency,
) => {
  return useQuery<{
    totalPrice: number
    currency: Currency
    report: Array<TotalItem>
  }>(
    [DEFAULT_QUERY_NAME, NO_DATE_EFFECT, 'totalPrice', type, currency],
    () => getTotalPrice(type, currency),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}
