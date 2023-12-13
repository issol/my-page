import { useQuery } from 'react-query'

import {
  getCount,
  getJobType,
  getLanguagePool,
  getLongStanding,
  getMemberList,
  getOnboardingOverview,
  getOngoing,
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
  DashboardOngoingCountQuery,
  JobTypeAndRole,
  LongStandingQuery,
  RatioItem,
  RatioQuery,
  RatioResponse,
  ViewType,
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

  return useQuery<Record<string, number>>(
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
    [DEFAULT_QUERY_NAME, 'request', view, userId, query.path, skip],
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
  filter,
  from,
  to,
  title,
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
      'ratio',
      title,
      view,
      userId,
      currency,
      filter,
      from,
      to,
    ],
    () => {
      return getRatio({
        ...props,
        filter,
        currency,
        from,
        to,
        userId,
        view,
        title,
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
      'countList',
      view,
      userId,
      type,
      countType,
      from,
      to,
      skip,
      sort,
    ],
    () =>
      getOngoing({
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

export type DashboardCountResult = Record<ViewType, number>
export const useDashboardCount = ({
  to,
  from,
  countType,
}: DashboardOngoingCountQuery) => {
  const { userId: initUserId, view: initView } = getUserViewModeInfo()
  const { view: changeView, userId: changeUserId } =
    useRecoilValue(dashboardState)
  const view = changeView ? changeView : initView
  const userId = changeUserId ? changeUserId : initUserId

  return useQuery<DashboardCountResult>(
    [DEFAULT_QUERY_NAME, `ongoingCount`, userId, to, from, view, countType],
    () => getCount({ to, from, userId, view, countType }),
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
export type TADOnboardingResult = Record<OverviewType, number>
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
    totalCount: number
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

/* TAD Query*/
export interface LanguagePoolResult {
  totalCount: number
  report: Array<{
    sourceLanguage?: string
    targetLanguage?: string
    count: number
    ratio: number
    sortingOrder: number
  }>
}
export const useLanguagePool = (base: 'source' | 'target' | 'pair') => {
  return useQuery<LanguagePoolResult>(
    [DEFAULT_QUERY_NAME, NO_DATE_EFFECT, 'LanguagePool', base],
    () => getLanguagePool(base),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export interface JobTypeAndRoleResult {
  totalCount: number
  report: Array<JobTypeAndRole>
}
export const useJobType = (base: 'jobType' | 'role' | 'pair') => {
  return useQuery<{
    count: number
    totalCount: number
    report: Array<JobTypeAndRole>
  }>(
    [DEFAULT_QUERY_NAME, NO_DATE_EFFECT, 'JobTypeAndRole', base],
    () => getJobType(base),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}
