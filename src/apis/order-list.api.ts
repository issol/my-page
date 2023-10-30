import axios from '@src/configs/axios'
import { getOrderStatusColor } from '@src/shared/helpers/colors.helper'
import { makeQuery } from '@src/shared/transformer/query.transformer'

import {
  InvoiceOrderListFilterType,
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
  filter: InvoiceOrderListFilterType,
): Promise<{ data: OrderListType[]; count: number; totalCount: number }> => {
  try {
    console.log(filter)

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

    console.log(data)

    return {
      data: data?.map((item: OrderListType, idx: number) => {
        console.log(item.status)

        return {
          ...item,
          extendedProps: {
            calendar: getOrderStatusColor(item.status, item.status),
          },
          allDay: true,
        }
      }),
      totalCount: data?.length ?? 0,
    }
  } catch (e: any) {
    return {
      data: [],
      totalCount: 0,
    }
  }
}
