import { ItemResType } from '@src/types/common/orders-and-quotes.type'
import { CurrencyType } from '@src/types/common/standard-price'
import {
  InvoiceProjectInfoFormType,
  InvoiceReceivableStatusType,
} from '@src/types/invoice/common.type'
import {
  CreateInvoiceReceivableRes,
  InvoiceReceivableDetailType,
  InvoiceReceivableFilterType,
  InvoiceReceivableListType,
  InvoiceReceivablePatchParamsType,
  InvoiceVersionHistoryResType,
  InvoiceVersionHistoryType,
} from '@src/types/invoice/receivable.type'
import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'
import {
  ClientType,
  LanguageAndItemType,
  ProjectInfoType,
  ProjectTeamListType,
  VersionHistoryType,
} from '@src/types/orders/order-detail'

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

export const createInvoice = async (
  data: InvoiceReceivablePatchParamsType,
): Promise<CreateInvoiceReceivableRes> => {
  return await axios.post('/api/enough/u/invoice', data)
}

export const getInvoiceDetail = async (
  id: number,
): Promise<InvoiceReceivableDetailType> => {
  try {
    const { data } = await axios.get(`/api/enough/u/invoice/${id}`)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getInvoiceLanguageItems = async (
  id: number,
): Promise<LanguageAndItemType> => {
  try {
    const { data } = await axios.get(`/api/enough/u/invoice/${id}/items`)

    // return {
    //   id: 8,
    //   languagePairs: [
    //     {
    //       id: 5,

    //       source: 'en',
    //       target: 'ko',
    //       price: {
    //         id: 30,

    //         name: 'new price for test',
    //         isStandard: true,
    //         category: 'Dubbing',
    //         serviceType: ['Dubbing', 'Dubbing audio QC'],
    //         currency: 'USD',
    //         calculationBasis: 'Words',
    //         rounding: 0,
    //         numberPlace: 2,
    //         authorId: 5,
    //       },
    //     },
    //     {
    //       id: 245,

    //       source: 'ar',
    //       target: 'ab',
    //       price: null,
    //     },
    //   ],
    //   items: [
    //     {
    //       id: 31,

    //       contactPersonId: 5,
    //       name: '1',
    //       dueAt: '2023-05-29T15:00:00.000Z',
    //       source: 'ko',
    //       target: 'en',
    //       priceId: 25,
    //       description: null,
    //       totalPrice: Number('0.00000'),
    //       detail: [
    //         {
    //           quantity: 1,
    //           priceUnitId: 200,
    //           unitPrice: Number('3.00000'),
    //           prices: '3.00000',
    //           unit: 'Graphics',
    //           currency: 'USD',
    //           priceUnit: null,
    //         },
    //         {
    //           quantity: 1,
    //           priceUnitId: 200,
    //           unitPrice: Number('2.40000'),
    //           prices: '0.00000',
    //           unit: 'Graphics',
    //           currency: 'USD',
    //           priceUnit: null,
    //         },
    //         {
    //           quantity: 1,
    //           priceUnitId: 200,
    //           unitPrice: Number('1.50000'),
    //           prices: '0.00000',
    //           unit: 'Graphics',
    //           currency: 'USD',
    //           priceUnit: null,
    //         },
    //         {
    //           quantity: 1,
    //           priceUnitId: 200,
    //           unitPrice: Number('1.50000'),
    //           prices: '0.00000',
    //           unit: 'Graphics',
    //           currency: 'USD',
    //           priceUnit: null,
    //         },
    //       ],
    //     },
    //     {
    //       id: 33,

    //       contactPersonId: 5,
    //       name: '1',
    //       dueAt: '2023-05-29T15:00:00.000Z',
    //       source: 'ko',
    //       target: 'en',
    //       priceId: 25,
    //       description: null,
    //       totalPrice: Number('0.00000'),
    //       detail: [
    //         {
    //           quantity: 1,
    //           priceUnitId: 200,
    //           unitPrice: Number('3.00000'),
    //           prices: '3.00000',
    //           unit: 'Graphics',
    //           currency: 'USD',
    //           priceUnit: null,
    //         },
    //         {
    //           quantity: 1,
    //           priceUnitId: 200,
    //           unitPrice: Number('2.40000'),
    //           prices: '0.00000',
    //           unit: 'Graphics',
    //           currency: 'USD',
    //           priceUnit: null,
    //         },
    //         {
    //           quantity: 1,
    //           priceUnitId: 200,
    //           unitPrice: Number('1.50000'),
    //           prices: '0.00000',
    //           unit: 'Graphics',
    //           currency: 'USD',
    //           priceUnit: null,
    //         },
    //         {
    //           quantity: 1,
    //           priceUnitId: 200,
    //           unitPrice: Number('1.50000'),
    //           prices: '0.00000',
    //           unit: 'Graphics',
    //           currency: 'USD',
    //           priceUnit: null,
    //         },
    //       ],
    //     },
    //   ],
    // }
    return {
      ...data,
      items: data.items.map((item: ItemResType) => ({
        ...item,
        name: item?.itemName,
        source: item?.sourceLanguage,
        target: item?.targetLanguage,
        totalPrice: item.totalPrice ? Number(item.totalPrice) : 0,
      })),
    }
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getInvoiceClient = async (id: number): Promise<ClientType> => {
  try {
    const { data } = await axios.get(`/api/enough/u/invoice/${id}/client`)
    return data
    // return {
    //   addressType: 'billing',
    //   client: {
    //     taxable: true,
    //     tax: 10,
    //     clientId: 3,

    //     name: '쌔거',
    //     email: 'sdflk@sf.com',
    //     phone: '',
    //     mobile: '',
    //     fax: '',

    //     timezone: {
    //       code: 'AE',
    //       label: 'United Arab Emirates',
    //       phone: '971',
    //     },
    //   },
    //   clientAddress: [
    //     {
    //       createdAt: '2023-04-17T21:05:51.771Z',
    //       updatedAt: '2023-05-10T01:48:39.977Z',
    //       addressType: 'billing',
    //       name: null,
    //       baseAddress: '영동대로 106길',
    //       detailAddress: '패스트파이브 3층',
    //       city: '강남구',
    //       state: '서울특별시',
    //       country: 'Korea, Republic of',
    //       zipCode: '06170',
    //       isSelected: false,
    //     },
    //     {
    //       createdAt: '2023-04-17T21:05:51.771Z',
    //       updatedAt: '2023-05-10T01:48:39.974Z',
    //       addressType: 'shipping',
    //       name: null,
    //       baseAddress: '영동대로 106길',
    //       detailAddress: '패스트파이브 3층',
    //       city: '강남구',
    //       state: '서울특별시',
    //       country: 'Korea, Republic of',
    //       zipCode: '06170',
    //       isSelected: true,
    //     },
    //   ],
    //   contactPerson: {
    //     id: 5,

    //     personType: 'Mr.',
    //     firstName: 'Gayeon',
    //     middleName: null,
    //     lastName: 'Kim',
    //     department: null,
    //     jobTitle: '매니죠',
    //     timezone: {
    //       code: 'AF',
    //       label: 'Afghanistan',
    //       phone: '93',
    //     },
    //     phone: null,
    //     mobile: '01063611055',
    //     fax: null,
    //     email: 'dsfsdf@com.com',
    //     memo: 'sdfsdf',
    //     isReferred: true,
    //   },
    // }
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getInvoiceProjectTeam = async (
  id: number,
): Promise<ProjectTeamListType[]> => {
  try {
    const { data } = await axios.get(`/api/enough/u/invoice/${id}/team`)
    return data.members
    // return [
    //   {
    //     userId: 58,
    //     // permissionGroups: ['TAD-General'],
    //     firstName: 'tester',
    //     middleName: null,
    //     lastName: 'lee',
    //     email: 'platform-qa@glozinc.com',
    //     jobTitle: 'tester',
    //     // type: 'General',

    //     position: 'supervisor',
    //   },
    //   {
    //     userId: 60,
    //     // permissionGroups: ['TAD-General'],
    //     firstName: 'risha',
    //     middleName: null,
    //     lastName: 'park',
    //     email: 'risha@glozinc.com',
    //     jobTitle: '',
    //     // type: 'General',

    //     position: 'projectManager',
    //   },
    // ]
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getInvoiceVersionHistory = async (
  id: number,
): Promise<InvoiceVersionHistoryType[]> => {
  try {
    const { data } = await axios.get(`/api/enough/u/invoice/${id}/history`)
    // const res: InvoiceVersionHistoryType[] = [
    //   {
    //     id: 1,
    //     version: 1,
    //     email: 'leriel@glozinc.com',
    //     downloadedAt: '2023-03-21T08:20:46.678Z',

    //     invoiceInfo: {
    //       id: 2,
    //       corporationId: 'IR-000005',
    //       createdAt: '2023-06-01T05:15:15.710Z',
    //       updatedAt: '2023-06-01T05:15:15.710Z',
    //       deletedAt: null,
    //       orderId: 13,
    //       adminCompanyName: 'GloZ',
    //       invoiceStatus: 'In preparation',
    //       authorId: 5,

    //       salesCategory: '',
    //       description: 'this is a description',
    //       notes: '',
    //       setReminder: false,
    //       taxInvoiceIssued: false,
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
    //       orderCorporationId: 'O-000013',
    //       projectName: '1321',
    //       workName: 'The Glory',
    //       category: 'Webcomics',
    //       serviceType: ['QC review'],
    //       expertise: ['Horror/Thriller'],
    //       revenueFrom: 'Singapore',
    //       isTaxable: false,
    //       tax: 120,
    //     },
    //     client: {
    //       addressType: 'billing',
    //       client: {
    //         taxable: true,
    //         tax: 10,
    //         clientId: 3,

    //         name: '쌔거',
    //         email: 'sdflk@sf.com',
    //         phone: '',
    //         mobile: '',
    //         fax: '',

    //         timezone: {
    //           code: 'AE',
    //           label: 'United Arab Emirates',
    //           phone: '971',
    //         },
    //       },
    //       clientAddress: [
    //         {
    //           createdAt: '2023-04-17T21:05:51.771Z',
    //           updatedAt: '2023-05-10T01:48:39.977Z',
    //           addressType: 'billing',
    //           name: null,
    //           baseAddress: '영동대로 106길',
    //           detailAddress: '패스트파이브 3층',
    //           city: '강남구',
    //           state: '서울특별시',
    //           country: 'Korea, Republic of',
    //           zipCode: '06170',
    //           isSelected: false,
    //         },
    //         {
    //           createdAt: '2023-04-17T21:05:51.771Z',
    //           updatedAt: '2023-05-10T01:48:39.974Z',
    //           addressType: 'shipping',
    //           name: null,
    //           baseAddress: '영동대로 106길',
    //           detailAddress: '패스트파이브 3층',
    //           city: '강남구',
    //           state: '서울특별시',
    //           country: 'Korea, Republic of',
    //           zipCode: '06170',
    //           isSelected: true,
    //         },
    //       ],
    //       contactPerson: {
    //         id: 5,

    //         personType: 'Mr.',
    //         firstName: 'Gayeon',
    //         middleName: null,
    //         lastName: 'Kim',
    //         department: null,
    //         jobTitle: '매니죠',
    //         timezone: {
    //           code: 'AF',
    //           label: 'Afghanistan',
    //           phone: '93',
    //         },
    //         phone: null,
    //         mobile: '01063611055',
    //         fax: null,
    //         email: 'dsfsdf@com.com',
    //         memo: 'sdfsdf',
    //         isReferred: true,
    //       },
    //     },
    //     projectTeam: [
    //       {
    //         userId: 58,
    //         // permissionGroups: ['TAD-General'],
    //         firstName: 'tester',
    //         middleName: null,
    //         lastName: 'lee',
    //         email: 'platform-qa@glozinc.com',
    //         jobTitle: 'tester',
    //         // type: 'General',

    //         position: 'supervisor',
    //       },
    //       {
    //         userId: 60,
    //         // permissionGroups: ['TAD-General'],
    //         firstName: 'risha',
    //         middleName: null,
    //         lastName: 'park',
    //         email: 'risha@glozinc.com',
    //         jobTitle: '',
    //         // type: 'General',

    //         position: 'projectManager',
    //       },
    //     ],
    //     items: {
    //       id: 8,
    //       languagePairs: [
    //         {
    //           id: 5,

    //           source: 'en',
    //           target: 'ko',
    //           price: {
    //             id: 30,

    //             name: 'new price for test',
    //             isStandard: true,
    //             category: 'Dubbing',
    //             serviceType: ['Dubbing', 'Dubbing audio QC'],
    //             currency: 'USD',
    //             calculationBasis: 'Words',
    //             rounding: 0,
    //             numberPlace: 2,
    //             authorId: 5,
    //           },
    //         },
    //         {
    //           id: 245,

    //           source: 'ar',
    //           target: 'ab',
    //           price: null,
    //         },
    //       ],
    //       items: [
    //         {
    //           id: 31,

    //           contactPersonId: 5,
    //           name: '1',
    //           dueAt: '2023-05-29T15:00:00.000Z',
    //           source: 'ko',
    //           target: 'en',
    //           priceId: 25,
    //           description: null,
    //           totalPrice: Number('0.00000'),
    //           detail: [
    //             {
    //               quantity: 1,
    //               priceUnitId: 200,
    //               unitPrice: Number('3.00000'),
    //               prices: '3.00000',
    //               unit: 'Graphics',
    //               currency: 'USD',
    //               priceUnit: null,
    //             },
    //             {
    //               quantity: 1,
    //               priceUnitId: 200,
    //               unitPrice: Number('2.40000'),
    //               prices: '0.00000',
    //               unit: 'Graphics',
    //               currency: 'USD',
    //               priceUnit: null,
    //             },
    //             {
    //               quantity: 1,
    //               priceUnitId: 200,
    //               unitPrice: Number('1.50000'),
    //               prices: '0.00000',
    //               unit: 'Graphics',
    //               currency: 'USD',
    //               priceUnit: null,
    //             },
    //             {
    //               quantity: 1,
    //               priceUnitId: 200,
    //               unitPrice: Number('1.50000'),
    //               prices: '0.00000',
    //               unit: 'Graphics',
    //               currency: 'USD',
    //               priceUnit: null,
    //             },
    //           ],
    //         },
    //         {
    //           id: 33,

    //           contactPersonId: 5,
    //           name: '1',
    //           dueAt: '2023-05-29T15:00:00.000Z',
    //           source: 'ko',
    //           target: 'en',
    //           priceId: 25,
    //           description: null,
    //           totalPrice: Number('0.00000'),
    //           detail: [
    //             {
    //               quantity: 1,
    //               priceUnitId: 200,
    //               unitPrice: Number('3.00000'),
    //               prices: '3.00000',
    //               unit: 'Graphics',
    //               currency: 'USD',
    //               priceUnit: null,
    //             },
    //             {
    //               quantity: 1,
    //               priceUnitId: 200,
    //               unitPrice: Number('2.40000'),
    //               prices: '0.00000',
    //               unit: 'Graphics',
    //               currency: 'USD',
    //               priceUnit: null,
    //             },
    //             {
    //               quantity: 1,
    //               priceUnitId: 200,
    //               unitPrice: Number('1.50000'),
    //               prices: '0.00000',
    //               unit: 'Graphics',
    //               currency: 'USD',
    //               priceUnit: null,
    //             },
    //             {
    //               quantity: 1,
    //               priceUnitId: 200,
    //               unitPrice: Number('1.50000'),
    //               prices: '0.00000',
    //               unit: 'Graphics',
    //               currency: 'USD',
    //               priceUnit: null,
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   },
    // ]
    // return res
    return data.map((value: InvoiceVersionHistoryResType) => ({
      ...value,
      items: {
        ...value.items,
        items: value.items.items.map((item: ItemResType) => ({
          ...item,
          name: item?.itemName,
          source: item?.sourceLanguage,
          target: item?.targetLanguage,
          totalPrice: item.totalPrice ? Number(item.totalPrice) : 0,
        })),
      },
      members: value.projectTeam.members,
    }))
  } catch (e: any) {
    throw new Error(e)
  }
}

export const patchInvoiceInfo = async (
  id: number,
  form: InvoiceReceivablePatchParamsType,
): Promise<{ id: number }> => {
  try {
    const { data } = await axios.patch(`/api/enough/u/invoice/${id}`, {
      ...form,
    })
    console.log(data)

    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const deleteInvoice = async (id: number) => {
  await axios.delete(`/api/enough/u/invoice/${id}`)
}

export const checkEditable = async (id: number): Promise<boolean> => {
  try {
    const { data } = await axios.get(`/api/enough/u/invoice/${id}/editable`)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}
