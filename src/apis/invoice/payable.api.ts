import { CurrencyType } from '@src/types/common/standard-price'
import { InvoicePayableStatusType } from '@src/types/invoice/common.type'
import {
  InvoicePayableDetailType,
  InvoicePayableFilterType,
  InvoicePayableListType,
  PayableFormType,
} from '@src/types/invoice/payable.type'
import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export const getPayableList = async (
  filter: InvoicePayableFilterType,
): Promise<{ data: InvoicePayableListType[]; totalCount: number }> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/invoice/payable/list?${makeQuery(filter)}`,
    )
    return data
    // return {
    //   data: [
    //     {
    //       id: 1,
    //       corporationId: '12sdlfk',
    //       adminCompanyName: 'Gloz',
    //       invoiceStatus: 'Invoice created',
    //       pro: { name: 'bonKim', email: 'bon@glozinc.com' },
    //       invoicedAt: Date(),
    //       payDueAt: Date(),
    //       payDueTimezone: {
    //         code: 'KR',
    //         label: 'Korea, Republic of',
    //         phone: '82',
    //       },
    //       paidAt: null,
    //       paidDateTimezone: null,
    //       totalPrice: 123,
    //       currency: 'USD',
    //       statusUpdatedAt: '2023-06-20T18:58:01.727Z',
    //     },
    //     {
    //       id: 2,
    //       corporationId: '11sdlfk',
    //       adminCompanyName: 'Gloz',
    //       invoiceStatus: 'Paid',
    //       pro: { name: 'bonKim', email: 'bon@glozinc.com' },
    //       invoicedAt: Date(),
    //       payDueAt: Date(),
    //       payDueTimezone: {
    //         code: 'KR',
    //         label: 'Korea, Republic of',
    //         phone: '82',
    //       },
    //       paidAt: Date(),
    //       paidDateTimezone: {
    //         code: 'KR',
    //         label: 'Korea, Republic of',
    //         phone: '82',
    //       },
    //       totalPrice: 123,
    //       currency: 'USD',
    //       statusUpdatedAt: '2023-06-20T18:58:01.727Z',
    //     },
    //     {
    //       id: 3,
    //       corporationId: '11sdlfk',
    //       adminCompanyName: 'Gloz',
    //       invoiceStatus: 'Invoice created',
    //       pro: { name: 'bonKim', email: 'bon@glozinc.com' },
    //       invoicedAt: Date(),
    //       payDueAt: Date(),
    //       payDueTimezone: {
    //         code: 'KR',
    //         label: 'Korea, Republic of',
    //         phone: '82',
    //       },
    //       paidAt: Date(),
    //       paidDateTimezone: {
    //         code: 'KR',
    //         label: 'Korea, Republic of',
    //         phone: '82',
    //       },
    //       totalPrice: 123000000,
    //       currency: 'USD',
    //       statusUpdatedAt: '2023-06-20T18:58:01.727Z',
    //     },
    //   ],
    //   totalCount: 1,
    // }
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
  year: number,
  month: number,
  filter: InvoicePayableFilterType,
): Promise<{ data: Array<InvoicePayableListType>; totalCount: number }> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/invoice/payable/calendar?year=${year}&month=${month}&${makeQuery(
        filter,
      )}`,
    )
    // const data = {
    //   data: [
    //     {
    //       id: 1,
    //       corporationId: '11sdlfk',
    //       adminCompanyName: 'Gloz',
    //       invoiceStatus: 'Invoice created' as InvoicePayableStatusType,
    //       pro: { name: 'bonKim', email: 'bon@glozinc.com' },
    //       invoicedAt: '2023-06-18T18:58:01.727Z',
    //       payDueAt: '2023-06-20T18:58:01.727Z',
    //       payDueTimezone: {
    //         code: 'KR',
    //         label: 'Korea, Republic of',
    //         phone: '82',
    //       },
    //       paidAt: '2023-06-20T18:58:01.727Z',
    //       paidDateTimezone: {
    //         code: 'KR',
    //         label: 'Korea, Republic of',
    //         phone: '82',
    //       },
    //       totalPrice: 123,
    //       currency: 'USD' as CurrencyType,
    //       statusUpdatedAt: '2023-06-20T18:58:01.727Z',
    //     },
    //     {
    //       id: 2,
    //       corporationId: '11sdlfk',
    //       adminCompanyName: 'Gloz',
    //       invoiceStatus: 'Paid' as InvoicePayableStatusType,
    //       pro: { name: 'bonKim', email: 'bon@glozinc.com' },
    //       invoicedAt: '2023-05-18T18:58:01.727Z',
    //       payDueAt: '2023-05-20T18:58:01.727Z',
    //       payDueTimezone: {
    //         code: 'KR',
    //         label: 'Korea, Republic of',
    //         phone: '82',
    //       },
    //       paidAt: '2023-05-20T18:58:01.727Z',
    //       paidDateTimezone: {
    //         code: 'KR',
    //         label: 'Korea, Republic of',
    //         phone: '82',
    //       },
    //       totalPrice: 123,
    //       currency: 'USD' as CurrencyType,
    //       statusUpdatedAt: '2023-06-20T18:58:01.727Z',
    //     },
    //     {
    //       id: 3,
    //       corporationId: '11sdlfk',
    //       adminCompanyName: 'Gloz',
    //       invoiceStatus: 'Invoice created' as InvoicePayableStatusType,
    //       pro: { name: 'bongbong', email: 'bon@glozinc.com' },
    //       invoicedAt: '2023-06-14T18:58:01.727Z',
    //       payDueAt: '2023-06-20T18:58:01.727Z',
    //       payDueTimezone: {
    //         code: 'KR',
    //         label: 'Korea, Republic of',
    //         phone: '82',
    //       },
    //       paidAt: '2023-06-20T18:58:01.727Z',
    //       paidDateTimezone: {
    //         code: 'KR',
    //         label: 'Korea, Republic of',
    //         phone: '82',
    //       },
    //       totalPrice: 123,
    //       currency: 'USD' as CurrencyType,
    //       statusUpdatedAt: '2023-06-20T18:58:01.727Z',
    //     },
    //   ],
    //   totalCount: 0,
    // }
    return {
      data: data.data?.map((item: InvoicePayableListType) => {
        return {
          ...item,
          status: item.invoiceStatus,
          extendedProps: {
            calendar: getColor(item.invoiceStatus),
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

export const getInvoicePayableDetail = async (
  id: number,
): Promise<InvoicePayableDetailType> => {
  try {
    // const { data } = await axios.get(`/api/enough/u/invoice/payable/${id}`)
    // return data
    return {
      id: 1,
      corporationId: 'sdf-1122',
      invoicedAt: Date(),
      invoicedAtTimezone: {
        code: 'KR',
        label: 'Korea, Republic of',
        phone: '82',
      },
      invoiceStatus: 'Invoice created',
      pro: { name: 'bon kim', email: 'bon@gloz.com' },
      taxInfo: 'Korea resident',
      taxRate: 10,
      payDueAt: Date(),
      payDueTimezone: {
        code: 'KR',
        label: 'Korea, Republic of',
        phone: '82',
      },
      paidAt: null,
      paidDateTimezone: null,
      description: '',
      currency: 'KRW',
      subtotal: 100,
      totalPrice: 1000,
      tax: 10,
      jobs: {
        count: 12,
        totalCount: 112,
        data: [
          {
            id: 1,
            corporationId: 'KR-100',
            serviceType: 'Editing',
            name: 'bon',
            totalPrice: 100000,
            contactPerson: 'Bon',
            deletedAt: null,
            priceUnits: [
              {
                title: 'Price',
                unitPrice: 1000,
                quantity: 3,
                prices: 100000,
              },
            ],
          },
        ],
      },
    }
  } catch (e: any) {
    throw Error(e)
  }
}

export const updateInvoicePayable = async (form: PayableFormType) => {
  try {
    // const { data } = await axios.get(`/api/enough/u/invoice/payable/${id}`)
    // return data
  } catch (e: any) {
    throw Error(e)
  }
}
