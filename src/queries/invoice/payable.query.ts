import {
  checkPayableEditable,
  getInvoicePayableCalendarData,
  getInvoicePayableDetail,
  getInvoicePayableJobList,
  getPayableHistoryList,
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
export const useGetPayableDetail = (id: number) => {
  return useQuery(
    ['invoice/payable/detail', id],
    () => {
      return getInvoicePayableDetail(id)
    },
    {
      enabled: !!id,
      suspense: true,
      staleTime: 60 * 1000,
      keepPreviousData: true,
    },
  )
}
export const useGetPayableJobList = (payableId: number) => {
  return useQuery(
    ['invoice/payable/detail/jobs', payableId],
    () => {
      return getInvoicePayableJobList(payableId)
    },
    {
      enabled: !!payableId,
      suspense: true,
      staleTime: 60 * 1000,
      keepPreviousData: true,
    },
  )
}
export const useGetPayableHistory = (
  invoiceId: number,
  invoiceCorporationId: string,
) => {
  return useQuery(
    ['invoice/payable/history', invoiceId, invoiceCorporationId],
    () => {
      return getPayableHistoryList(invoiceId, invoiceCorporationId)
    },
    {
      enabled: !!invoiceId && !!invoiceCorporationId,
      suspense: true,
      staleTime: 60 * 1000,
      keepPreviousData: true,
    },
  )
}

export const useCheckInvoicePayableEditable = (id: number) => {
  return useQuery(
    ['invoice/payable/editable', id],
    () => checkPayableEditable(id),
    {
      staleTime: 60 * 1000, // 1
      enabled: !!id,
      suspense: false,
      keepPreviousData: true,
    },
  )
}
