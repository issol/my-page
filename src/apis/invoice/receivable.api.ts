import { CurrencyType } from '@src/types/common/standard-price'
import { InvoiceReceivableStatusType } from '@src/types/invoice/common.type'
import {
  InvoiceReceivableFilterType,
  InvoiceReceivableListType,
} from '@src/types/invoice/receivable.type'
import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export const getReceivableList = async (
  filter: InvoiceReceivableFilterType,
): Promise<{ data: InvoiceReceivableListType[]; totalCount: number }> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/invoice/list?${makeQuery(filter)}`,
    )
    return data
  } catch (e: any) {
    return {
      data: [],
      totalCount: 0,
    }
  }
}

function getColor(status: InvoiceReceivableStatusType) {
  return status === 'In preparation'
    ? '#F572D8'
    : status === 'Checking in progress'
    ? '#FDB528'
    : status === 'Accepted by client'
    ? '#64C623'
    : status === 'Tax invoice issued'
    ? '#46A4C2'
    : status === 'Paid'
    ? '#267838'
    : status === 'Overdue'
    ? '#FF4D49'
    : status === 'Canceled'
    ? '#FF4D49'
    : status === 'Overdue (Reminder sent)'
    ? '#FF4D49'
    : ''
}

export const getInvoiceReceivableCalendarData = async (
  year: number,
  month: number,
  filter: InvoiceReceivableFilterType,
): Promise<{
  data: Array<InvoiceReceivableListType>
  totalCount: number
}> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/invoice/calendar?year=${year}&month=${
        month + 1
      }&${makeQuery(filter)}`,
    )
    // const data = {
    //   data: [
    //     {
    //       id: 2,
    //       corporationId: 'IR-000005',
    //       createdAt: '2023-06-01T05:15:15.710Z',
    //       adminCompanyName: 'GloZ',
    //       invoiceStatus: 'Checking in progress',
    //       authorId: 5,
    //       salesCategory: null,
    //       description: 'this is a description',
    //       notes: null,
    //       setReminder: false,
    //       reminderSentAt: null,
    //       invoicedAt: '2023-06-01T05:06:31.182Z',
    //       payDueAt: '2023-06-01T05:06:31.183Z',
    //       payDueTimezone: {
    //         code: 'test code',
    //         label: 'test label',
    //         phone: 'test phone',
    //       },
    //       invoiceConfirmedAt: '2023-06-01T05:06:31.183Z',
    //       invoiceConfirmTimezone: {
    //         code: 'test code',
    //         label: 'test label',
    //         phone: 'test phone',
    //       },
    //       taxInvoiceDueAt: '2023-06-01T05:06:31.183Z',
    //       taxInvoiceDueTimezone: {
    //         code: 'test code',
    //         label: 'test label',
    //         phone: 'test phone',
    //       },
    //       taxInvoiceIssuedAt: null,
    //       taxInvoiceIssuedDateTimezone: null,
    //       paidAt: null,
    //       paidDateTimezone: null,
    //       salesCheckedAt: null,
    //       salesCheckedDateTimezone: null,
    //       downloadedAt: null,
    //       order: {
    //         id: 13,
    //         createdAt: '2023-05-12T09:04:05.120Z',
    //         updatedAt: '2023-05-12T09:59:15.516Z',
    //         corporationId: 'O-000013',
    //         adminCompanyName: 'GloZ',
    //         workName: 'The Glory',
    //         projectName: '1321',
    //         projectDescription: '₩12₩',
    //         category: 'Webcomics',
    //         serviceType: ['QC review'],
    //         expertise: ['Horror/Thriller'],
    //         status: 'Completed',
    //         operatorId: 5,
    //         supervisorId: 7687,
    //         projectManagerId: 5,
    //         members: null,
    //         revenueFrom: 'Singapore',
    //         addressType: 'shipping',
    //         version: 1,
    //         tax: 120,
    //         parentOrderId: null,
    //         orderedAt: null,
    //         orderTimezone: null,
    //         projectDueAt: '2023-05-26T09:30:00.000Z',
    //         projectDueTimezone: {
    //           code: 'AD',
    //           label: 'Andorra',
    //           phone: '376',
    //         },
    //         downloadedAt: '2023-05-12T09:59:15.000Z',
    //         deletedAt: null,
    //         client: {
    //           clientId: 3,
    //           corporationId: 'C-000003',
    //           authorId: 5,
    //           adminCompanyName: 'GloZ',
    //           clientType: 'Company',
    //           name: '쌔거',
    //           email: 'sdflk@sf.com',
    //           phone: '',
    //           mobile: '',
    //           fax: '',
    //           websiteLink: 'https://naver.com',
    //           status: 'New',
    //           timezone: {
    //             code: 'AE',
    //             label: 'United Arab Emirates',
    //             phone: '971',
    //           },
    //           deletedAt: null,
    //         },
    //       },
    //     },
    //     {
    //       id: 1,
    //       corporationId: 'IR-000003',
    //       adminCompanyName: 'GloZ',
    //       invoiceStatus: 'In preparation',
    //       authorId: 5,
    //       salesCategory: null,
    //       description: 'this is a description',
    //       notes: null,
    //       setReminder: false,
    //       reminderSentAt: null,
    //       invoicedAt: '2023-06-01T05:06:31.182Z',
    //       payDueAt: '2023-06-01T05:06:31.183Z',
    //       payDueTimezone: {
    //         code: 'test code',
    //         label: 'test label',
    //         phone: 'test phone',
    //       },
    //       invoiceConfirmedAt: '2023-06-01T05:06:31.183Z',
    //       invoiceConfirmTimezone: {
    //         code: 'test code',
    //         label: 'test label',
    //         phone: 'test phone',
    //       },
    //       taxInvoiceDueAt: '2023-06-01T05:06:31.183Z',
    //       taxInvoiceDueTimezone: {
    //         code: 'test code',
    //         label: 'test label',
    //         phone: 'test phone',
    //       },
    //       taxInvoiceIssuedAt: null,
    //       taxInvoiceIssuedDateTimezone: null,
    //       paidAt: null,
    //       paidDateTimezone: null,
    //       salesCheckedAt: null,
    //       salesCheckedDateTimezone: null,
    //       downloadedAt: null,
    //       order: {
    //         id: 11,
    //         createdAt: '2023-05-12T07:49:01.966Z',
    //         updatedAt: '2023-05-12T08:59:05.279Z',
    //         corporationId: 'O-000011',
    //         adminCompanyName: 'GloZ',
    //         workName: 'The Glory 2',
    //         projectName: 'project',
    //         projectDescription: '',
    //         category: 'Dubbing',
    //         serviceType: ['Dubbing audio QC'],
    //         expertise: ['Energy and raw materials'],
    //         status: 'Completed',
    //         operatorId: 5,
    //         supervisorId: 58,
    //         projectManagerId: 60,
    //         members: null,
    //         revenueFrom: 'Korea',
    //         addressType: 'billing',
    //         version: 1,
    //         tax: 20,
    //         parentOrderId: null,
    //         orderedAt: null,
    //         orderTimezone: null,
    //         projectDueAt: '2023-05-23T06:00:00.000Z',
    //         projectDueTimezone: {
    //           code: 'KR',
    //           label: 'Korea, Republic of',
    //           phone: '82',
    //         },
    //         downloadedAt: null,
    //         deletedAt: null,
    //         client: {
    //           clientId: 9,
    //           corporationId: 'C-000009',
    //           authorId: 5,
    //           adminCompanyName: 'GloZ',
    //           clientType: 'Company',
    //           name: '3',
    //           email: 'sdldjsf@sdf.com',
    //           phone: '01063611055',
    //           mobile: null,
    //           fax: null,
    //           websiteLink: null,
    //           status: 'New',
    //           timezone: {
    //             code: 'AE',
    //             label: 'United Arab Emirates',
    //             phone: '971',
    //           },
    //           deletedAt: null,
    //         },
    //       },
    //     },
    //   ],

    //   totalCount: 0,
    // }
    return {
      data: data.data?.map((item: InvoiceReceivableListType) => {
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

export const createInvoice = async (data: any) => {
  await axios.post('/api/enough/u/invoice', data)
}
