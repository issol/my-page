import { useQuery } from 'react-query'

import {
  getCount,
  getLongStanding,
  getMemberList,
  getOrders,
  getRatio,
  getReport,
  getRequest,
} from '@src/apis/dashboard/lpm'
import type {
  DashboardQuery,
  RequestQuery,
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
      query.type,
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

  return useQuery(
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
