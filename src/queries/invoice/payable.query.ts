import {
  getInvoicePayableCalendarData,
  getPayableList,
} from '@src/apis/invoice/payable.api'
import { InvoicePayableFilterType } from '@src/types/invoice/invoice-payable.type'
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
  date: string,
  filter: InvoicePayableFilterType,
) => {
  return useQuery(
    ['invoice/payable/calendar', date, filter],
    () => {
      return getInvoicePayableCalendarData(date, filter)
    },
    {
      suspense: true,
      staleTime: 60 * 1000,
      keepPreviousData: true,
    },
  )
}
