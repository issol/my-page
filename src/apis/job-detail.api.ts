import axios from '@src/configs/axios'
import { JobItemType, JobType } from '@src/types/common/item.type'
import { JobPricesDetailType } from '@src/types/jobs/jobs.type'
import {
  AssignProFilterPostType,
  AssignProListType,
  SaveJobInfoParamsType,
  SaveJobPricesParamsType,
} from '@src/types/orders/job-detail'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export const getAssignProList = async (
  id: number,
  filters: AssignProFilterPostType,
): Promise<{ totalCount: number; data: AssignProListType[] }> => {
  // const { data } = await axios.get(
  //   `/api/enough/u/pro/job?${makeQuery(filters)}`,
  // )

  const { data } = await axios.get(
    `/api/enough/u/pro/job/${id}?${makeQuery(filters)}`,
  )

  // const res: AssignProListType[] = [
  //   {
  //     id: '1',
  //     firstName: 'Kim',
  //     middleName: 'Minji',
  //     lastName: 'Leriel',
  //     email: 'leriel@glozinc.com',
  //     status: 'Onboard',
  //     responseRate: 20,
  //     assignmentStatus: 'Request accepted',
  //     assignmentDate: '2022-05-17T14:13:15Z',
  //     message: {
  //       id: 0,
  //       unReadCount: 1,
  //       contents: [
  //         {
  //           id: 0,
  //           firstName: 'Kim',
  //           middleName: null,
  //           lastName: 'Minji',
  //           email: 'leriel@glozinc.com',
  //           role: 'Pro',
  //           content: 'Hello',
  //           createdAt: '2022-05-17T14:13:15Z',
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     id: '2',
  //     firstName: 'Kim',
  //     middleName: 'Minji',
  //     lastName: 'Leriel',
  //     email: 'leriel@glozinc.com',
  //     status: 'Onboard',
  //     responseRate: 30,
  //     assignmentStatus: 'Assigned',
  //     assignmentDate: '2022-05-17T14:13:15Z',
  //     message: {
  //       id: 0,
  //       unReadCount: 2,
  //       contents: null,
  //     },
  //   },
  // ]

  // const data = {
  //   totalCount: res.length,
  //   data: res,
  // }

  return data
}

export const getJobDetails = async (
  id: number,
): Promise<{
  id: number
  cooperationId: string
  items: JobItemType[]
}> => {
  try {
    const { data } = await axios.get(`/api/enough/u/job/detail?orderId=${id}`)
    console.log(data)

    return data
  } catch (e: any) {
    return {
      id: 0,
      cooperationId: '0',
      items: [],
    }
  }
}

export const getJobInfo = async (id: number): Promise<JobType> => {
  try {
    const { data } = await axios.get(`/api/enough/u/job/${id}/info`)
    console.log(data)

    return data
  } catch (e: any) {
    return {
      id: 0,
      corporationId: '',
      name: '',
      status: 'In preparation',
      contactPersonId: 0,
      serviceType: '',
      sourceLanguage: '',
      targetLanguage: '',
      startedAt: '',
      dueAt: '',
      startTimezone: {
        code: '',
        label: '',
        phone: '',
      },
      dueTimezone: { code: '', label: '', phone: '' },
      description: '',
      isShowDescription: false,
      contactPerson: null,
    }
  }
}

export const saveJobInfo = async (id: number, data: SaveJobInfoParamsType) => {
  await axios.patch(`/api/enough/u/job/${id}`, { ...data })
}

export const deleteJob = async (id: number) => {
  await axios.delete(`/api/enough/u/job/${id}`)
}

export const getJobPrices = async (
  id: number,
): Promise<JobPricesDetailType> => {
  try {
    const { data } = await axios.get(`/api/enough/u/job/${id}/price`)
    return data
  } catch (e: any) {
    return {
      id: 0,
      sourceLanguage: '',
      targetLanguage: '',
      priceId: 0,
      totalPrice: 0,
      currency: 'USD',
      priceName: '',
      datas: [],
    }
  }
}

export const saveJobPrices = async (
  id: number,
  data: SaveJobPricesParamsType,
) => {
  axios.patch(`/api/enough/u/job/${id}/price`, { ...data })
}
