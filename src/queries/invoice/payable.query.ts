import {
  getInvoicePayableCalendarData,
  getPayableList,
} from '@src/apis/invoice/payable.api'
import { InvoicePayableFilterType } from '@src/types/invoice/payable.type'
import { useQuery } from 'react-query'

export const useGetPayableList = (filter: InvoicePayableFilterType) => {
  return useQuery(
    ['invoice/payable/list', filter],
    () => getPayableList(filter),
    {
      staleTime: 60 * 1000, // 1

      suspense: false,
      keepPreviousData: true,
    },
  )
}

export const useGetPayableCalendar = (
  year: number,
  month: number,
  filter: InvoicePayableFilterType,
) => {
  return useQuery(
    ['invoice/payable/calendar', year, month, filter],
    () => {
      return getInvoicePayableCalendarData(year, month, filter)
    },
    {
      suspense: true,
      staleTime: 60 * 1000,
      keepPreviousData: true,
    },
  )
}
