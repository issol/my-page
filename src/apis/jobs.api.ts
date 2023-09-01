import axios from '@src/configs/axios'
import { JobListFilterType } from '@src/pages/jobs'

import { FilterType } from '@src/pages/orders/job-list/list-view/list-view'
import { DetailFilterType } from '@src/pages/orders/job-list/tracker-view/[id]'
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
  filter: FilterType,
): Promise<{ data: JobsListType[]; totalCount: number }> => {
  try {
    const { data } = await axios.get(`/api/enough/u/job?${makeQuery(filter)}`)
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
  filter: DetailFilterType,
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
    // const { data } = await axios.get(
    //   `/api/enough/u/order/list?${makeQuery(filter)}`,
    // )
    // return data
    // return {
    //   workName: 'job Name',
    //   data: [
    //     {
    //       id: 1,
    //       isDelivered: true,
    //       name: 'Jobs',
    //       itemDueDate: Date(),
    //       contactPerson: { id: 12, name: 'bon' },
    //       jobDueDate: Date(),
    //       assignedPro: {
    //         id: 1,
    //         name: 'Kitty',
    //         jobTitle: 'Manager',
    //         email: 'bon@glozinc.com',
    //         isActive: true,
    //         isOnboarded: true,
    //       },
    //       serviceType: 'DTP',
    //       source: 'en',
    //       target: 'ko',
    //     },
    //   ],
    //   totalCount: 1,
    // }
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
  try {
    await axios.post(`/api/enough/u/job`, { ...params })
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getProJobList = async (
  filter: JobListFilterType,
): Promise<{
  data: ProJobListType[]
  totalCount: number
}> => {
  try {
    // const { data } = await axios.get(`/api/enough/u/job/pro?${makeQuery(filter)}`)
    // return data
    return {
      data: [
        {
          id: 1,
          corporationId: 'corporation1',
          serviceType: 'service1',
          name: 'job1',
          jobDueDate: '2023-08-30T14:13:15Z',
          status: 'Job overdue',
          message: {
            unReadCount: 1,
            contents: [
              {
                id: 1,
                content: 'message1',
                createdAt: '2023-08-31T14:13:15Z',
                firstName: 'John',
                middleName: null,
                lastName: 'Doe',
                email: 'john.doe@example.com',
                role: 'role1',
              },
            ],
          },
        },
        {
          id: 2,
          corporationId: 'corporation2',
          serviceType: 'service2',
          name: 'job2',
          jobDueDate: '2023-08-29T14:13:15Z',
          status: 'Invoiced',
          message: {
            unReadCount: 2,
            contents: [
              {
                id: 2,
                content: 'message2',
                createdAt: '2023-08-30T14:13:15Z',
                firstName: 'Jane',
                middleName: null,
                lastName: 'Doe',
                email: 'jane.doe@example.com',
                role: 'role2',
              },
              {
                id: 3,
                content: 'message3',
                createdAt: '2023-08-30T17:13:15Z',
                firstName: 'Bob',
                middleName: 'A.',
                lastName: 'Smith',
                email: 'bob.smith@example.com',
                role: 'role3',
              },
            ],
          },
        },
      ],
      totalCount: 2,
    }
  } catch (error: any) {
    throw new Error(error)
  }
}
