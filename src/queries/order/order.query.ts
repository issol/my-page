import {
  getClient,
  getProjectInfo,
  getProjectTeam,
} from '@src/apis/order-detail.api'
import { getOrderList, getOrderListCalendar } from '@src/apis/order-list.api'
import { OrderListFilterType } from '@src/types/orders/order-list'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetOrderList = (filter: OrderListFilterType) => {
  return useQuery(['orderList', filter], () => getOrderList(filter), {
    staleTime: 60 * 1000, // 1

    suspense: false,
    keepPreviousData: true,
  })
}

export const useGetOrderListCalendar = (date: string) => {
  return useQuery(
    'get-client-invoices-calendar',
    () => {
      return getOrderListCalendar(date)
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

export const useGetProjectInfo = (id: number) => {
  return useQuery([`projectInfo-${id}`, id], () => getProjectInfo(id), {
    staleTime: 60 * 1000, // 1

    suspense: true,
    keepPreviousData: true,
  })
}

export const useGetProjectTeam = (id: number) => {
  return useQuery([`projectTeam-${id}`, id], () => getProjectTeam(id), {
    staleTime: 60 * 1000, // 1

    suspense: true,
    keepPreviousData: true,
  })
}

export const useGetClient = (id: number) => {
  return useQuery([`Client-${id}`, id], () => getClient(id), {
    staleTime: 60 * 1000, // 1

    suspense: true,
    keepPreviousData: true,
  })
}
