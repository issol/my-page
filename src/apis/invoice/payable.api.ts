import { CurrencyType } from '@src/types/common/standard-price'
import { InvoicePayableStatusType } from '@src/types/invoice/common.type'
import {
  InvoicePayableFilterType,
  InvoicePayableListType,
} from '@src/types/invoice/payable.type'
import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export const getPayableList = async (
  filter: InvoicePayableFilterType,
): Promise<{ data: InvoicePayableListType[]; totalCount: number }> => {
  try {
    // const { data } = await axios.get(
    //   `/api/enough/u/invoice/status/list?${makeQuery(filter)}`,
    // )
    // return data.data
    return {
      data: [
        {
          id: 1,
          corporationId: '11sdlfk',
          status: 'Invoice created',
          pro: { name: 'bonKim', email: 'bon@glozinc.com' },
          invoiceDate: Date(),
          paymentDue: Date(),
          paymentDate: Date(),
          totalPrice: 123,
          currency: 'USD',
        },
        {
          id: 2,
          corporationId: '11sdlfk',
          status: 'Paid',
          pro: { name: 'bonKim', email: 'bon@glozinc.com' },
          invoiceDate: Date(),
          paymentDue: Date(),
          paymentDate: Date(),
          totalPrice: 123,
          currency: 'USD',
        },
        {
          id: 3,
          corporationId: '11sdlfk',
          status: 'Invoice created',
          pro: { name: 'bonKim', email: 'bon@glozinc.com' },
          invoiceDate: Date(),
          paymentDue: Date(),
          paymentDate: Date(),
          totalPrice: 123,
          currency: 'USD',
        },
      ],
      totalCount: 1,
    }
  } catch (e: any) {
    return {
      data: [],
      totalCount: 0,
    }
  }
}

function getColor(status: InvoicePayableStatusType) {
  return status === 'Invoice created'
    ? '#F572D8'
    : status === 'Invoice accepted'
    ? '#9B6CD8'
    : status === 'Paid'
    ? '#FF4D49'
    : status === 'Overdue'
    ? '#FF4D49'
    : status === 'Canceled'
    ? '#FF4D49'
    : ''
}

export const getInvoicePayableCalendarData = async (
  date: string,
  filter: InvoicePayableFilterType,
): Promise<{ data: Array<InvoicePayableListType>; totalCount: number }> => {
  try {
    // const { data } = await axios.get(
    //   `/api/enough/u/quote?calendarDate=${date}?${makeQuery(filter)}`,
    // )
    const data = {
      data: [
        {
          id: 1,
          corporationId: '11sdlfk',
          status: 'Invoice created' as InvoicePayableStatusType,
          pro: { name: 'bonKim', email: 'bon@glozinc.com' },
          invoiceDate: '2023-06-18T18:58:01.727Z',
          paymentDue: '2023-06-20T18:58:01.727Z',
          paymentDate: '2023-06-20T18:58:01.727Z',
          totalPrice: 123,
          currency: 'USD' as CurrencyType,
        },
        {
          id: 2,
          corporationId: '11sdlfk',
          status: 'Paid' as InvoicePayableStatusType,
          pro: { name: 'bonKim', email: 'bon@glozinc.com' },
          invoiceDate: '2023-05-18T18:58:01.727Z',
          paymentDue: '2023-05-20T18:58:01.727Z',
          paymentDate: '2023-05-20T18:58:01.727Z',
          totalPrice: 123,
          currency: 'USD' as CurrencyType,
        },
        {
          id: 3,
          corporationId: '11sdlfk',
          status: 'Invoice created' as InvoicePayableStatusType,
          pro: { name: 'bongbong', email: 'bon@glozinc.com' },
          invoiceDate: '2023-06-14T18:58:01.727Z',
          paymentDue: '2023-06-20T18:58:01.727Z',
          paymentDate: '2023-06-20T18:58:01.727Z',
          totalPrice: 123,
          currency: 'USD' as CurrencyType,
        },
      ],
      totalCount: 0,
    }
    return {
      data: data.data?.map((item: InvoicePayableListType) => {
        return {
          ...item,
          extendedProps: {
            calendar: getColor(item.status),
          },
          allDay: true,
        }
      }),
      totalCount: data?.totalCount ?? 0,
    }
  } catch (e: any) {
    return {
      data: [],
      totalCount: 0,
    }
  }
}
