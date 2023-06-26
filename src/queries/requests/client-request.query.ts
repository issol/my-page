import {
  getClientRequestCalendarData,
  getClientRequestList,
} from '@src/apis/requests/client-request.api'
import { RequestFilterType } from '@src/types/requests/filters.type'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetClientRequestList = (filter: RequestFilterType) => {
  return useQuery(
    ['request/client/list', filter],
    () => getClientRequestList(filter),
    {
      staleTime: 60 * 1000, // 1
      suspense: false,
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
      staleTime: 60 * 1000, // 1
      suspense: false,
      keepPreviousData: true,
    },
  )
}
