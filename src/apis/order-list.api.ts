import axios from '@src/configs/axios'
import { getOrderStatusColor } from '@src/shared/helpers/colors.helper'
import { makeQuery } from '@src/shared/transformer/query.transformer'

import {
  OrderListFilterType,
  OrderListForJobType,
  OrderListType,
} from '@src/types/orders/order-list'

export type OrderListCalendarEventType = OrderListType & {
  extendedProps?: { calendar: string }
  allDay?: boolean
}

export const getOrderList = async (
  filter: OrderListFilterType,
): Promise<{ data: OrderListType[]; count: number; totalCount: number }> => {
  try {
    const { data } = await axios.get<{
      data: OrderListType[]
      count: number
      totalCount: number
    }>(`/api/enough/u/order/list?${makeQuery(filter)}`)

    return data
  } catch (error) {
    return {
      data: [],
      count: 0,
      totalCount: 0,
    }
  }
}

export const getOrderListForInvoice = async (
  filter: OrderListFilterType,
): Promise<{ data: OrderListType[]; count: number; totalCount: number }> => {
  try {
    const { data } = await axios.get<{
      data: OrderListType[]
      count: number
      totalCount: number
    }>(`/api/enough/u/order/invoice-available?${makeQuery(filter)}`)

    return data
  } catch (error) {
    return {
      data: [],
      count: 0,
      totalCount: 0,
    }
  }
}

export const getOrderListInJob = async (
  filter: OrderListFilterType,
): Promise<{
  data: OrderListForJobType[]
  count: number
  totalCount: number
}> => {
  try {
    const { data } = await axios.get<{
      data: OrderListForJobType[]
      count: number
      totalCount: number
    }>(`/api/enough/u/order/job?${makeQuery(filter)}`)

    const result = {
      data: data.data.map(item => ({
        ...item,
        isItems: item.items.length > 0 ? true : false,
      })),
      count: data.count,
      totalCount: data.totalCount,
    }

    return result
  } catch (error) {
    return {
      data: [],
      count: 0,
      totalCount: 0,
    }
  }
}

export const getOrderListCalendar = async (
  year: number,
  month: number,
  filter: OrderListFilterType,
): Promise<{ data: OrderListCalendarEventType[]; totalCount: number }> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/order/calendar?year=${year}&month=${month}&${makeQuery(
        filter,
      )}`,
    )

    // return data
    // console.log(data)

    return {
      data: data?.map((item: OrderListType, idx: number) => {
        return {
          ...item,
          extendedProps: {
            calendar: getOrderStatusColor(item.status),
          },
          allDay: true,
        }
      }),
      totalCount: data?.length ?? 0,
    }

    // const data: OrderListType[] = [
    //   {
    //     id: 1,
    //     orderId: 'O-000001',
    //     status: 'In preparation',
    //     clientName: 'Naver Webtoon',
    //     clientEmail: 'naverwebtoon@naver.com',
    //     projectName: 'The Remarried Empress 1-10',
    //     category: 'OTT/Subtitle',
    //     serviceType: ['Subtitle', 'Translation'],
    //     orderDate: '2023-04-01',
    //     projectDueDate: '2023-04-30',
    //     totalPrice: 500,
    //     currency: 'USD',
    //   },
    // ]
    // return {
    //   data: data.map((item: OrderListType, idx: number) => {
    //     return {
    //       ...item,
    //       extendedProps: {
    //         calendar:
    //           item.status === 'Canceled'
    //             ? color_overdue
    //             : colors[idx % colors.length],
    //       },
    //       allDay: true,
    //     }
    //   }),
    //   totalCount: data?.length ?? 0,
    // }
  } catch (e: any) {
    return {
      data: [],
      totalCount: 0,
    }
  }
}
