import {
  getInvoiceDetail,
  getInvoiceReceivableCalendarData,
  getReceivableList,
} from '@src/apis/invoice/receivable.api'
import { InvoiceReceivableFilterType } from '@src/types/invoice/receivable.type'
import { useQuery } from 'react-query'

export const useGetReceivableList = (filter: InvoiceReceivableFilterType) => {
  return useQuery(
    ['invoice/receivable/list', filter],
    () => getReceivableList(filter),
    {
      staleTime: 60 * 1000, // 1

      suspense: false,
      keepPreviousData: true,
    },
  )
}

export const useGetReceivableCalendar = (
  year: number,
  month: number,
  filter: InvoiceReceivableFilterType,
) => {
  return useQuery(
    ['invoice/receivable/calendar', year, month, filter],
    () => {
      return getInvoiceReceivableCalendarData(year, month, filter)
    },
    {
      suspense: true,
      staleTime: 60 * 1000,
      keepPreviousData: true,
    },
  )
}

export const useGetReceivableInvoiceDetail = (id: number) => {
  return useQuery(['invoiceReceivableDetail', id], () => getInvoiceDetail(id), {
    staleTime: 60 * 1000, // 1

    suspense: false,
  })
}
