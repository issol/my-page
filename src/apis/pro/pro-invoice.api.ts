import { getReceivableStatusColor } from '@src/shared/helpers/colors.helper'
import {
  ProInvoiceListFilterType,
  ProInvoiceListType,
} from '@src/types/invoice/common.type'

export type ProInvoiceListCalendarEventType = ProInvoiceListType & {
  extendedProps?: { calendar: string }
  allDay?: boolean
}

export const getProInvoiceList = async (
  id: number,
  filters: ProInvoiceListFilterType,
): Promise<{ data: Array<ProInvoiceListType>; totalCount: number }> => {
  return {
    data: [
      {
        id: 1,
        corporationId: 'I-000001',
        createdAt: '2021-08-31T07:00:00.000Z',
        status: 30100,
        invoicedAt: '2021-08-31T07:00:00.000Z',
        payDueAt: '2021-08-31T07:00:00.000Z',
        payDueTimezone: {
          code: 'KR',
          label: 'Korea, Republic of',
          phone: '82',
        },
        paidAt: '2021-08-31T07:00:00.000Z',
        paidDateTimezone: {
          code: 'KR',
          label: 'Korea, Republic of',
          phone: '82',
        },
      },
    ],
    totalCount: 1,
  }
}

export const getProInvoiceListCalendar = async (
  year: number,
  month: number,
  filter: ProInvoiceListFilterType,
): Promise<{ data: ProInvoiceListCalendarEventType[]; totalCount: number }> => {
  try {
    // const { data } = await axios.get(
    //   `/api/enough/u/order/list?year=${year}&month=${month}`,
    // )

    // // return data

    // return {
    //   data: data.data?.map((item: OrderListType, idx: number) => {
    //     return {
    //       ...item,
    //       extendedProps: {
    //         calendar: getColor(item.status),
    //       },
    //       allDay: true,
    //     }
    //   }),
    //   totalCount: data?.totalCount ?? 0,
    // }

    const data: ProInvoiceListType[] = [
      {
        id: 1,
        corporationId: 'I-000001',
        createdAt: '2023-06-29T07:00:00.000Z',
        status: 30100,
        invoicedAt: '2023-06-29T07:00:00.000Z',
        payDueAt: '2023-07-01T07:00:00.000Z',
        payDueTimezone: {
          code: 'KR',
          label: 'Korea, Republic of',
          phone: '82',
        },
        paidAt: '2023-07-01T07:00:00.000Z',
        paidDateTimezone: {
          code: 'KR',
          label: 'Korea, Republic of',
          phone: '82',
        },
      },
    ]
    return {
      data: data.map((item: ProInvoiceListType, idx: number) => {
        return {
          ...item,
          status: item.status,
          extendedProps: {
            calendar: getReceivableStatusColor(item.status),
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
