import axios from '@src/configs/axios'

import { makeQuery } from '@src/shared/transformer/query.transformer'
import { ClientRequestListType } from '@src/types/options.type'
import {
  RequestFormPayloadType,
  RequestFormType,
  RequestItemFormPayloadType,
  RequestStatusType,
} from '@src/types/requests/common.type'
import {
  CancelReasonType,
  RequestDetailType,
} from '@src/types/requests/detail.type'
import { RequestFilterType } from '@src/types/requests/filters.type'
import { RequestListType } from '@src/types/requests/list.type'

export const getRequestStatusList = async (): Promise<
  Array<{ value: number; label: string }>
> => {
  try {
    const { data } = await axios.get(`/api/enough/u/request/status/list`)

    const res = data.map((item: any) => ({
      label: item.statusName,
      value: item.statusCode,
    }))
    return res
  } catch (error: any) {
    return []
  }
}

export const createClientRequest = async (
  form: RequestFormPayloadType,
): Promise<RequestFormType & { id: number }> => {
  const { data } = await axios.post(`/api/enough/u/request`, form)
  return data
}

export const getClientRequestList = async (
  filter: RequestFilterType,
): Promise<{ data: RequestListType[]; count: number; totalCount: number }> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/request/list?${makeQuery(filter)}`,
    )
    return data
  } catch (error) {
    return {
      data: [],
      count: 0,
      totalCount: 0,
    }
  }
}

function getColor(status: RequestStatusType) {
  return status === 'Request created'
    ? '#A81988'
    : status === 'In preparation'
    ? '#FDB528'
    : status === 'Changed into quote'
    ? '#64C623'
    : status === 'Changed into order'
    ? '#1A6BBA'
    : status === 'Canceled'
    ? '#FF4D49'
    : ''
}

export const getClientRequestCalendarData = async (
  year: number,
  month: number,
  filter: RequestFilterType,
): Promise<{ data: RequestListType[]; count: number; totalCount: number }> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/request/list?year=${year}&month=${month}&${makeQuery(
        filter,
      )}`,
    )

    console.log(
      data.data?.map((item: RequestListType, idx: number) => {
        return {
          ...item,
          extendedProps: {
            calendar: getColor(item.status),
          },
          allDay: true,
        }
      }),
    )

    return {
      data: data.data?.map((item: RequestListType, idx: number) => {
        return {
          ...item,
          extendedProps: {
            calendar: getColor(item.status),
          },
          allDay: true,
        }
      }),
      count: data?.count ?? 0,
      totalCount: data?.totalCount ?? 0,
    }
  } catch (e: any) {
    return {
      data: [],
      count: 0,
      totalCount: 0,
    }
  }
}

export const getClientRequestDetail = async (
  id: number,
): Promise<RequestDetailType> => {
  const { data } = await axios.get(`/api/enough/u/request/${id}`)
  const testData: RequestDetailType = {
    id: 160,
    corporationId: 'R-000218',
    status: 'Request created',
    statusUpdatedAt: '2024-01-08T02:03:51.282Z',
    notes: 'Notes to LSP',
    sampleFiles: [
      {
        fileName: 'Sample file.txt',
        filePath: '/request/57/sampleFile/Sample file.txt',
        fileSize: 12,
        fileExtension: 'txt',
      },
    ],
    canceledReason: null,
    items: [
      {
        id: 220,

        sourceLanguage: 'ko',
        targetLanguage: ['en', 'ja'],
        quantity: 0,
        desiredDueDate: '2024-01-30T15:00:00.000Z',
        desiredDueTimezone: {
          code: '',
          label: 'Asia/Seoul',
          phone: '',
        },
        sortingOrder: 1,

        name: '[Sample] 클라이언트가 발송한 리퀘스트',
        category: 'Documents/Text',
        serviceType: ['Translation'],
        unit: 'CAT discount',
      },
      {
        id: 221,

        sourceLanguage: 'ko',
        targetLanguage: ['en', 'br'],
        quantity: 0,
        desiredDueDate: '2024-01-30T15:00:00.000Z',
        desiredDueTimezone: {
          code: '',
          label: 'Asia/Seoul',
          phone: '',
        },
        sortingOrder: 1,

        name: '[Sample] 클라이언트가 발송한 리퀘스트',
        category: 'Documents/Text',
        serviceType: ['Translation'],
        unit: 'CAT discount',
      },
    ],
    contactPerson: {
      id: 10,

      userId: 57,
      personType: 'Ms.',
      firstName: 'Olivia',
      middleName: 'Grace',
      lastName: 'Carter',
      department: 'Globalization Coordination',
      jobTitle: 'Cultural Connectivity Manager',
      timezone: {
        label: 'Asia/Seoul',
        code: '',
        phone: '',
      },
      phone: null,
      mobile: '82|0100000000',
      fax: '82|01012341234',
      email: 'enufftestclient@gmail.com',
      memo: '',
      isReferred: true,
    },

    requestedAt: '2024-01-08T02:03:51.282Z',

    lsp: {
      id: '61c8e2ac-1d2e-428e-8654-c05f777b231f',

      name: 'GloZ',

      email: 'gloz@testCompanyEmail.com',
    },
    client: {
      clientId: 10,
      corporationId: 'C-000019',

      name: '[Test] 글로지',
      email: 'gloz@glozinc.com',
      phone: '82|024567890',
      mobile: '82|01012345678',
      fax: '82|023456789',
      websiteLink: '',
      status: 'Contacted',
      timezone: {
        code: '',
        phone: '',
        label: 'Asia/Seoul',
      },

      isTaxable: false,
      tax: null,
    },
  }
  // return data
  return testData
}

export const updateRequest = async (
  id: number,
  form: Omit<RequestDetailType, 'lsp'> & { lspId: string },
): Promise<RequestDetailType> => {
  const { data } = await axios.put(`/api/enough/u/request/${id}`, form)
  return data
}
