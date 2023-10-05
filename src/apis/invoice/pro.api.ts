import {
  InvoiceProDetailType,
  InvoiceProFilterType,
  InvoiceProListType,
} from '@src/types/invoice/pro.type'
import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export const getProInvoiceList = async (
  filter: InvoiceProFilterType,
): Promise<{
  data: InvoiceProListType[]
  totalCount: number
  count: number
}> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/invoice/receivable/list?${makeQuery(filter)}`,
    )
    return data
  } catch (e: any) {
    return {
      data: [
        {
          id: 1,
          corporationId: 'I-000001',
          adminCompanyName: 'GloZ',
          invoiceStatus: 'Invoiced',
          invoicedAt: '2021-08-31T07:00:00.000Z',
          statusUpdatedAt: '2021-08-31T07:00:00.000Z',
          paidAt: '2021-08-31T07:00:00.000Z',
          paidDateTimezone: {
            code: 'KR',
            label: 'Korea, Republic of',
            phone: '82',
          },
          totalPrice: 10000,
          currency: 'KRW',
        },
      ],
      totalCount: 1,
      count: 1,
    }
  }
}

export const getProInvoiceDetail = async (
  id: number,
): Promise<InvoiceProDetailType> => {
  try {
    const { data } = await axios.get(`/api/enough/u/invoice/payable/${id}`)
    const temp: InvoiceProDetailType = {
      id: 1,
      corporationId: 'KR-100',
      invoicedAt: '2022-01-01',
      invoicedAtTimezone: {
        code: 'KR',
        label: 'Korea, Republic of',
        phone: '82',
      },
      invoiceStatus: 'Invoiced',

      taxInfo: '123-45-67890',
      taxRate: 0.1,

      paidAt: '2022-01-15',
      paidDateTimezone: {
        code: 'KR',
        label: 'Korea, Republic of',
        phone: '82',
      },
      description: 'Consulting services',
      currency: 'USD',
      subtotal: 1000,
      totalPrice: 1100,
      tax: 100,
      invoiceConfirmedAt: '2022-01-15',
    }
    return temp
  } catch (e: any) {
    throw new Error(e)
  }
}
