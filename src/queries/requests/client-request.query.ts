import {
  getClientRequestCalendarData,
  getClientRequestDetail,
  getClientRequestList,
  getRequestStatusList,
} from '@src/apis/requests/client-request.api'
import { RequestFilterType } from '@src/types/requests/filters.type'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetClientRequestStatus = () => {
  return useQuery(['request/client/statuses'], () => getRequestStatusList(), {
    staleTime: 10 * 1000, // 1
    suspense: true,
    keepPreviousData: true,
  })
}

export const useGetClientRequestList = (filter: RequestFilterType) => {
  return useQuery(
    ['request/client/list', filter],
    () => getClientRequestList(filter),
    {
      staleTime: 10 * 1000, // 1
      suspense: true,
      keepPreviousData: true,
    },
  )
}

export const useGetClientRequestCalendarData = (
  year: number,
  month: number,
  filter: RequestFilterType,
) => {
  return useQuery(
    ['request/client/calendar', year, month, filter],
    () => getClientRequestCalendarData(year, month, filter),
    {
      staleTime: 10 * 1000, // 1
      suspense: true,
      keepPreviousData: true,
    },
  )
}
export const useGetClientRequestDetail = (id: number) => {
  return useQuery(
    ['request/client/detail', id],
    () => getClientRequestDetail(id),
    {
      staleTime: 10 * 1000, // 1
      suspense: true,
      useErrorBoundary: true,
      keepPreviousData: true,
      enabled: !!id,
    },
  )
}
