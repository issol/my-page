import axios from '@src/configs/axios'
import { JobListFilterType } from '@src/pages/jobs/requested-ongoing-list'

import {
  FilterPostType,
  FilterType,
} from '@src/pages/orders/job-list/list-view/list-view'
import { DetailFilterResponseType, DetailFilterType } from '@src/pages/orders/job-list/tracker-view/[id]'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import {
  CreateJobParamsType,
  JobHistoryType,
  JobsListType,
  JobsTrackerDetailType,
  JobsTrackerListType,
  ProJobListType,
} from '@src/types/jobs/jobs.type'

export const getJobsList = async (
  filter: FilterPostType,
): Promise<{ data: JobsListType[]; totalCount: number }> => {
  console.log(filter)

  try {
    const res =
      filter.startedAt && filter.startedAt[0] !== null
        ? {
            ...filter,
            startedAt: filter.startedAt.map(value => value?.toISOString()),
          }
        : filter.dueAt && filter.dueAt[0] !== null
        ? {
            ...filter,
            dueAt: filter.dueAt.map(value => value?.toISOString()),
          }
        : filter

    const { data } = await axios.get(`/api/enough/u/job?${makeQuery(res)}`)
    return data
  } catch (error) {
    return {
      data: [],
      totalCount: 0,
    }
  }
}
export const getJobsTrackerList = async (
  filter: FilterType,
): Promise<{ data: JobsTrackerListType[]; totalCount: number }> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/job/tracker?${makeQuery(filter)}`,
    )
    return data
  } catch (error) {
    return {
      data: [],
      totalCount: 0,
    }
  }
}
export const getJobsTrackerDetail = async (
  filter: DetailFilterResponseType,
): Promise<{
  workName: string
  data: JobsTrackerDetailType[]
  totalCount: number
}> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/job/tracker/detail?${makeQuery(filter)}`,
    )
    return data

  } catch (error) {
    return {
      workName: '',
      data: [],
      totalCount: 0,
    }
  }
}

export const updateIsDelivered = async (
  isDelivered: boolean,
  trackerId: number, // => jobId로 보내기
) => {
  try {
    // const { data } = await axios.get(
    //   `/api/enough/u/order/list?${makeQuery(filter)}`,
    // )
    // return data
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getJobHistory = async (
  id: number,
  filter: { skip: number; take: number },
): Promise<{ data: JobHistoryType[]; totalCount: number }> => {
  try {
    // const data = axios.get(`/api/enough/u/order/list?${makeQuery(filter)}`)
    // const data = axios.get(`/api/enough/u/job/${id}/history`)
    const { data } = await axios.get(
      `/api/enough/u/job/${id}/history?${makeQuery(filter)}`,
    )
    return data
    // return {
    //   data: [
    //     {
    //       id: 1,
    //       version: 1,
    //       requestor: 'bon@glozinc.com',
    //       createdAt: Date(),
    //       jobInfo: {
    //         id: 1,
    //         corporationId: 'DTP-000001',
    //         description: 'Test',
    //         name: 'Episode 1 - Translation',
    //         status: 'In preparation',
    //         contactPersonId: 5,
    //         serviceType: 'Translation',
    //         sourceLanguage: 'en',
    //         targetLanguage: 'ko',
    //         startedAt: '2022-05-17T14:13:15Z',
    //         dueAt: '2022-05-20T14:13:15Z',
    //         startTimezone: {
    //           code: 'KR',
    //           label: 'Korea, Republic of',
    //           phone: '82',
    //         },
    //         dueTimezone: {
    //           code: 'KR',
    //           label: 'Korea, Republic of',
    //           phone: '82',
    //         },

    //         isShowDescription: true,
    //         files: [
    //           {
    //             name: 'test-file',
    //             size: 100000,
    //             file: 'https://gloground.com',
    //             type: 'SAMPLE',
    //           },
    //           {
    //             name: 'test-file2',
    //             size: 100500,
    //             file: 'https://gloground.com',
    //             type: 'TARGET',
    //           },
    //         ],
    //       },
    //       assignPro: {
    //         data: [
    //           {
    //             id: '1',
    //             firstName: 'Kim',
    //             middleName: 'Minji',
    //             lastName: 'Leriel',
    //             email: 'leriel@glozinc.com',
    //             status: 'Onboard',
    //             responseRate: 20,
    //             assignmentStatus: 'Request accepted',
    //             assignmentDate: '2022-05-17T14:13:15Z',
    //           },
    //         ],
    //         totalCount: 1,
    //       },
    //       prices: {
    //         id: 27,
    //         priceId: 24,
    //         sourceLanguage: 'en',
    //         targetLanguage: 'ko',
    //         priceName: 'Test',
    //         currency: 'KRW',
    //         totalPrice: 150,
    //         datas: [
    //           {
    //             quantity: 1,
    //             priceUnitTitle: 'CAT discount',
    //             priceUnitId: 53,
    //             unitPrice: 150,
    //             prices: 150,
    //           },
    //         ],
    //       },
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

export const createJob = async (params: CreateJobParamsType) => {
  await axios.post(`/api/enough/u/job`, { ...params })
}

export const getProJobList = async (
  filter: JobListFilterType,
): Promise<{
  data: ProJobListType[]
  totalCount: number
  count: number
}> => {
  const { data } = await axios.get(
    `/api/enough/u/pro/job/list?${makeQuery(filter)}`,
  )

  return data
}

export const getProJobClientList = async (filter: {
  filterType: 'client' | 'contactPerson'
}): Promise<
  {
    id: number
    name: string
  }[]
> => {
  const { data } = await axios.get(
    `/api/enough/u/pro/job/filter-option?${makeQuery(filter)}`,
  )

  return data
}
