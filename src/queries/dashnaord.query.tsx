import { useQuery } from 'react-query'

import {
  getAccountData,
  getAccountPaymentType,
  getCount,
  getDeadlineCompliance,
  getExpectedIncome,
  getInvoiceOverview,
  getJobOverView,
  getJobType,
  getLanguagePool,
  getLongStanding,
  getMemberList,
  getOnboardingOverview,
  getOngoing,
  getPaidThisMonth,
  getProJobCalendar,
  getRatio,
  getReport,
  getRequest,
  getTotalAmount,
  getTotalPrice,
  getUpcomingDeadline,
} from '@src/apis/dashboard.api'
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
  ExpectedIncome,
  ExpectedIncomeQuery,
  InvoiceOverviewItem,
  JobTypeAndRole,
  LongStandingQuery,
  PaymentType,
  RatioItem,
  RatioQuery,
  RatioResponse,
  ReportItem,
  TotalAmountItem,
  TotalAmountQuery,
  ViewType,
} from '@src/types/dashboard'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { dashboardState } from '@src/states/dashboard'
import { authState } from '@src/states/auth'
import { getCurrentRole } from '@src/shared/auth/storage'

export const DEFAULT_QUERY_NAME = 'dashboard'

const getUserViewModeInfo = (): { userId: number | null; view: ViewMode } => {
  const auth = useRecoilValueLoadable(authState).getValue().user
  const role = getCurrentRole()
  // const auth = JSON.parse(window.sessionStorage.getItem('userData') || '')
  // const role = JSON.parse(window.sessionStorage.getItem('currentRole') || '')

  if (auth && role) {
    if (role?.type === 'Master' || role?.type === 'Manager') {
      return { userId: auth.userId, view: 'company' }
    }
    return { userId: auth.userId, view: 'personal' }
  } else {
    return { userId: auth?.userId ?? null, view: 'personal' }
  }
}

export const useDashboardReport = (query: DashboardQuery) => {
  const { userId: initUserId, view: initView } = getUserViewModeInfo()
  const { view: changeView, userId: changeUserId } =
    useRecoilValue(dashboardState)
  const view = changeView ? changeView : initView
  const userId = changeUserId ? changeUserId : initUserId

  return useQuery<ReportItem>(
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
      { from, to },
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
  ordering,
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
      type,
      view,
      userId,
      countType,
      { from, to },
      skip,
      sort,
      ordering,
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
        ordering,
      }),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export type DashboardCountResult = Record<Partial<ViewType>, number>
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
    [DEFAULT_QUERY_NAME, `ongoingCount`, countType, userId, { to, from }, view],
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
      params.dataType,
      view,
      userId,
      params.skip,
      params.sort,
      params.ordering,
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
    [DEFAULT_QUERY_NAME, 'Onboarding'],
    () => getOnboardingOverview(),
  )
}

/* LPM Query*/

/**
 * Receivables/Payables - Paid this month
 * @param type
 * @param currency
 */

export type PaidThisMonthAmount = {
  totalPrice: number
  currency: Currency
  count: number
}
export const usePaidThisMonthAmount = (
  type: 'payable' | 'receivable',
  currency: Currency,
) => {
  const { userId: initUserId, view: initView } = getUserViewModeInfo()
  const { view: changeView, userId: changeUserId } =
    useRecoilValue(dashboardState)
  const view = changeView ? changeView : initView
  const userId = changeUserId ? changeUserId : initUserId

  return useQuery<PaidThisMonthAmount>(
    [DEFAULT_QUERY_NAME, 'PaidThisMonth', type, currency],
    () => getPaidThisMonth({ type, currency, userId, view }),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export interface TotalPriceResult {
  totalPrice: number
  totalCount: number
  currency: Currency
  report: Array<TotalItem>
}

export const useTotalPrice = (
  type: 'payable' | 'receivable',
  currency: Currency,
) => {
  return useQuery<TotalPriceResult>(
    [DEFAULT_QUERY_NAME, 'totalPrice', type, currency],
    () => getTotalPrice(type, currency),
    {
      retry: 1,
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
    [DEFAULT_QUERY_NAME, 'LanguagePool', base],
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
  }>([DEFAULT_QUERY_NAME, 'JobTypeAndRole', base], () => getJobType(base), {
    suspense: true,
    keepPreviousData: true,
    useErrorBoundary: (error: any) => error.response?.status >= 500,
  })
}

/* Pros */
export interface JobOverViewResult {
  requested: number
  inProgress: number
}

export const useJobOverview = () => {
  return useQuery<JobOverViewResult>(
    [DEFAULT_QUERY_NAME, 'JobOverview'],
    () => getJobOverView(),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useUpcomingDeadline = () => {
  return useQuery(
    [DEFAULT_QUERY_NAME, 'UpcomingDeadline'],
    () => getUpcomingDeadline(),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useExpectedIncome = (params: ExpectedIncomeQuery) => {
  return useQuery<{ report: Array<ExpectedIncome> }>(
    [
      DEFAULT_QUERY_NAME,
      'ExpectedIncome',
      { year: params.year, sort: params.sort, month: params.month },
    ],
    () => getExpectedIncome(params),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useTotalAmount = (params: TotalAmountQuery) => {
  return useQuery<TotalAmountItem>(
    [
      DEFAULT_QUERY_NAME,
      'TotalAmount',
      params.amountType,
      params.month,
      params.year,
    ],
    () => getTotalAmount(params),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useInvoiceOverview = (
  params: Omit<TotalAmountQuery, 'amountType'>,
) => {
  return useQuery<Array<InvoiceOverviewItem>>(
    [DEFAULT_QUERY_NAME, 'InvoiceOverview', params.month, params.year],
    () => getInvoiceOverview(params),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

type DeadlineAverageTime = {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

interface DeadlineComplianceResult {
  delayedCount: number
  delayedRatio: number
  onTimeCount: number
  onTimeRatio: number
  delayedAverage?: DeadlineAverageTime
  onTimeAverage?: DeadlineAverageTime
}

export const useDeadlineCompliance = (
  params: Omit<TotalAmountQuery, 'amountType'>,
) => {
  return useQuery<DeadlineComplianceResult>(
    [DEFAULT_QUERY_NAME, 'DeadlineCompliance', params.month, params.year],
    () => getDeadlineCompliance(params),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export type ProJobCalendarResult = {
  id: number
  corporationId: string
  name: string
  status: number
  statusUpdatedAt: string
  invoiceId: number | null
}

export const useProJonCalendar = (
  params: Omit<TotalAmountQuery, 'amountType'>,
) => {
  return useQuery<Array<ProJobCalendarResult>>(
    [DEFAULT_QUERY_NAME, 'ProJonCalendar', params.month, params.year],
    () => getProJobCalendar(params),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export type AccountItem = {
  currency: Currency
  count?: number
  prices: number
}

interface AccountCountResult {
  report: Array<AccountItem>
}

export const useAccountCount = (path: string, params: DashboardQuery) => {
  return useQuery<AccountCountResult | null>(
    [
      DEFAULT_QUERY_NAME,
      'AccountCount',
      path,
      { from: params.from, to: params.to },
    ],
    () => getAccountData(path, params),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export type AccountRatio = {
  count: number
  paymentMethod?: string
  type?: string
  ratio: number
}

export interface AccountRatioResult {
  totalCount: number
  report: Array<AccountRatio>
}

export const useAccountRatio = ({ office, userType }: PaymentType) => {
  return useQuery<AccountRatioResult>(
    [DEFAULT_QUERY_NAME, 'AccountRatio', userType, office],
    () => getAccountPaymentType({ office, userType }),
    {
      suspense: true,
      keepPreviousData: true,
      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}
