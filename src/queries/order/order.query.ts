import {
  getClient,
  getLangItems,
  getProjectInfo,
  getProjectTeam,
  getVersionHistory,
} from '@src/apis/order-detail.api'
import {
  getOrderList,
  getOrderListCalendar,
  getOrderListForInvoice,
  getOrderListInJob,
} from '@src/apis/order-list.api'
import { OrderListFilterType } from '@src/types/orders/order-list'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetOrderList = (
  filter: OrderListFilterType,
  type: 'invoice' | 'order',
) => {
  return useQuery(
    ['orderList', { type: 'list' }, filter, type],
    () => {
      if (type === 'order') {
        return getOrderList(filter)
      }
      return getOrderListForInvoice(filter)
    },
    {},
  )
}

export const useGetOrderListInJob = (filter: OrderListFilterType) => {
  return useQuery(['orderListInJob', filter], () => getOrderListInJob(filter), {
    staleTime: 60 * 1000, // 1

    suspense: false,
    keepPreviousData: true,
  })
}

export const useGetOrderListCalendar = (
  year: number,
  month: number,
  filter: { mine: '0' | '1'; hideCompleted: '0' | '1' },
) => {
  return useQuery(
    ['orderList', filter, year, month],
    () => getOrderListCalendar(year, month, filter),

    {
      staleTime: 60 * 1000,
      suspense: true,
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}

export const useGetProjectInfo = (id: number) => {
  return useQuery(
    [`orderDetail`, { type: 'project' }, id],
    () => getProjectInfo(id),
    {
      staleTime: 60 * 1000, // 1

      suspense: true,
      enabled: !!id && !isNaN(id),
    },
  )
}

export const useGetProjectTeam = (id: number) => {
  return useQuery(
    [`orderDetail`, { type: 'team' }, id],
    () => getProjectTeam(id),
    {
      staleTime: 60 * 1000, // 1

      suspense: false,
      enabled: !!id,
      // select: data => {
      //   return data.map(value => ({ ...value, id: uuidv4() }))
      // },
    },
  )
}

export const useGetClient = (id: number) => {
  return useQuery(
    [`orderDetail`, { type: 'client' }, id],
    () => getClient(id),
    {
      staleTime: 60 * 1000, // 1

      suspense: true,
    },
  )
}

export const useGetLangItem = (id: number) => {
  return useQuery(
    [`orderDetail`, { type: 'items' }, id],
    () => getLangItems(id),
    {
      staleTime: 60 * 1000, // 1

      suspense: false,
    },
  )
}

export const useGetVersionHistory = (id: number) => {
  return useQuery(
    [`orderDetail`, { type: 'history' }, id],
    () => getVersionHistory(id),
    {
      staleTime: 60 * 1000, // 1

      suspense: true,
    },
  )
}
