import {
  getInvoiceClient,
  getInvoiceDetail,
  getInvoiceLanguageItems,
  getInvoiceProjectTeam,
  getInvoiceReceivableCalendarData,
  getInvoiceVersionHistory,
  getReceivableList,
} from '@src/apis/invoice/receivable.api'
import { InvoiceReceivableFilterType } from '@src/types/invoice/receivable.type'
import { useQuery } from 'react-query'

export const useGetReceivableList = (
  filter: InvoiceReceivableFilterType | null,
) => {
  return useQuery(
    ['invoice/receivable/list', filter],
    () => getReceivableList(filter!),
    {
      staleTime: 10 * 1000, // 1

      suspense: false,
      keepPreviousData: true,
      enabled: !!filter,
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
      staleTime: 10 * 1000,
      keepPreviousData: true,
    },
  )
}

export const useGetReceivableInvoiceDetail = (id: number) => {
  return useQuery(
    ['invoiceReceivableDetail', { type: 'project' }, id],
    () => getInvoiceDetail(id),
    {
      staleTime: 10 * 1000, // 1

      suspense: false,
    },
  )
}

export const useGetReceivableInvoicePrices = (id: number) => {
  return useQuery(
    ['invoiceReceivableDetail', { type: 'price' }, id],
    () => getInvoiceLanguageItems(id),
    {
      staleTime: 10 * 1000, // 1

      suspense: false,
    },
  )
}

export const useGetReceivableClient = (id: number) => {
  return useQuery(
    ['invoiceReceivableDetail', { type: 'client' }, id],
    () => getInvoiceClient(id),
    {
      staleTime: 10 * 1000, //

      suspense: false,
    },
  )
}

export const useGetReceivableTeam = (id: number) => {
  return useQuery(
    ['invoiceReceivableDetail', { type: 'team' }, id],
    () => getInvoiceProjectTeam(id),
    {
      staleTime: 10 * 1000, //

      suspense: false,
    },
  )
}

export const useGetReceivableHistory = (id: number) => {
  return useQuery(
    ['invoiceReceivableDetail', { type: 'history' }, id],
    () => getInvoiceVersionHistory(id),
    {
      staleTime: 10 * 1000, //

      suspense: false,
    },
  )
}
