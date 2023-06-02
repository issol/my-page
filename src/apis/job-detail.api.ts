import axios from '@src/configs/axios'
import { FileType } from '@src/types/common/file.type'
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
): Promise<{
  totalCount: number
  data: AssignProListType[]
  count: number
}> => {
  const { data } = await axios.get(
    `/api/enough/u/pro/job/${id}?${makeQuery(filters)}`,
  )

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
      totalPrice: 0,
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
  await axios.patch(`/api/enough/u/job/${id}/price`, { ...data })
}

export const requestJobToPro = async (ids: number[], jobId: number) => {
  await axios.post(`/api/enough/u/job/${jobId}/request`, { proIds: ids })
}

export const getMessageList = async (
  jobId: number,
  proId: number,
): Promise<{
  unReadCount: number
  contents:
    | {
        id: number
        content: string
        createdAt: string
        firstName: string
        middleName: string | null
        lastName: string
        email: string
        role: string
      }[]
    | null
}> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/job/${jobId}/message?proId=${proId}`,
    )
    return data
  } catch (e: any) {
    return {
      unReadCount: 0,
      contents: null,
    }
  }
}

export const sendMessageToPro = async (
  jobId: number,
  proId: number,
  message: string,
) => {
  await axios.post(`/api/enough/u/job/${jobId}/message`, {
    proId: proId,
    message: message,
  })
}

export const uploadFile = async (file: {
  jobId: number
  size: number
  name: string
  type: 'SAMPLE' | 'SOURCE' | 'TARGET'
}) => {
  await axios.post(`/api/enough/u/job/upload`, { ...file })
}

export const getSourceFileToPro = async (
  jobId: number,
): Promise<FileType[]> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/job/source-file?jobId=${jobId}`,
    )
    return data
  } catch (e: any) {
    return []
  }
}
