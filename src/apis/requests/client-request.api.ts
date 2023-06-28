import axios from '@src/configs/axios'

import { makeQuery } from '@src/shared/transformer/query.transformer'
import { ClientRequestListType } from '@src/types/options.type'
import {
  RequestFormType,
  RequestStatusType,
} from '@src/types/requests/common.type'
import {
  CancelReasonType,
  RequestDetailType,
} from '@src/types/requests/detail.type'
import { RequestFilterType } from '@src/types/requests/filters.type'
import { RequestListType } from '@src/types/requests/list.type'

export const getRequestStatusList = async (): Promise<
  ClientRequestListType[]
> => {
  try {
    const { data } = await axios.get(`/api/enough/u/request/status/list`)
    return data
  } catch (error: any) {
    return []
  }
}

export const createClientRequest = async (
  form: RequestFormType,
): Promise<RequestFormType & { id: number }> => {
  try {
    const { data } = await axios.post(`/api/enough/u/request`, form)
    return data
  } catch (error: any) {
    throw new Error(error)
  }
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
  try {
    const { data } = await axios.get(`/api/enough/u/request/${id}`)
    return data
    // return {
    //   id: 1,
    //   corporationId: '2123',
    //   lsp: { id: 2, name: 'Bon', email: 'bon@gloz.con' },
    //   status: 'Request created',
    //   contactPerson: {
    //     id: 1,
    //     personType: 'Mr.',
    //     firstName: 'Hop',
    //     lastName: 'Risha',
    //     jobTitle: 'Manager',
    //     timezone: {
    //       code: '',
    //       label: '',
    //       phone: '',
    //     },
    //     email: 'leriel@gloz.com',
    //   },
    //   items: [
    //     {
    //       id: 1,
    //       name: 'Item',
    //       sourceLanguage: 'ko',
    //       targetLanguage: 'en',
    //       category: 'OTT/Subtitle',
    //       serviceType: ['DTP'],
    //       unit: 'Percent',
    //       quantity: 0,
    //       desiredDueDate: Date(),
    //       desiredDueTimezone: {
    //         code: '',
    //         label: '',
    //         phone: '',
    //       },
    //     },
    //   ],
    //   requestedAt: Date(),
    //   statusUpdatedAt: Date(),
    //   notes: '',
    // }
  } catch (e: any) {
    throw new Error(e)
  }
}

export const updateRequest = async (
  id: number,
  form: Omit<RequestDetailType, 'lsp'> & { lspId: string },
): Promise<RequestDetailType> => {
  try {
    const { data } = await axios.put(`/api/enough/u/request/${id}`, form)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}
