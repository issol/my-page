import {
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
