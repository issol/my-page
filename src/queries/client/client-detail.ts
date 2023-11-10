import {
  getClientDetail,
  getClientInvoiceList,
  getClientInvoicesCalendarData,
  getClientProjectList,
  getClientProjectsCalendarData,
} from '@src/apis/client.api'
import { ClientDetailType } from '@src/types/client/client'
import {
  ClientInvoiceFilterType,
  ClientInvoiceListType,
  ClientProjectFilterType,
  ClientProjectListType,
} from '@src/types/client/client-projects.type'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetClientDetail = (id: number) => {
  return useQuery(
    ['client-detail'],
    () => {
      return getClientDetail(id)
    },
    {
      staleTime: 60 * 1000, // 1

      suspense: true,

      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useGetClientProjectList = (
  id: number,
  filter: ClientProjectFilterType,
) => {
  return useQuery<{ data: ClientProjectListType[]; count: number }>(
    ['client-projects', filter],
    () => {
      return getClientProjectList(id, filter)
    },
    {
      staleTime: 60 * 1000, // 1

      suspense: true,

      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useGetClientProjectsCalendar = (
  id: number,
  year: number,
  month: number,
  selectedType: 'order' | 'quote',
) => {
  return useQuery(
    ['projectList', { type: 'calendar' }, { year, month, selectedType }],
    () => {
      return getClientProjectsCalendarData(id, year, month, selectedType)
    },
    {
      suspense: true,

      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}

export const useGetClientInvoiceList = (
  id: number,
  filter: ClientInvoiceFilterType,
) => {
  return useQuery<{ data: ClientInvoiceListType[]; totalCount: number }>(
    [`client-invoices`, filter],
    () => {
      return getClientInvoiceList(id, filter)
    },
    {
      staleTime: 60 * 1000, // 1

      suspense: true,

      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useGetClientInvoicesCalendar = (
  id: number,
  year: number,
  month: number,
  // filter: ClientInvoiceFilterType,
) => {
  return useQuery(
    'get-client-invoices-calendar',
    () => {
      return getClientInvoicesCalendarData(id, year, month)
    },
    {
      suspense: true,
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}
