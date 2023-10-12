import axios from '@src/configs/axios'
import { FileType } from '@src/types/common/file.type'
import { JobItemType, JobType } from '@src/types/common/item.type'
import { ItemResType } from '@src/types/common/orders-and-quotes.type'
import { ProJobStatusType } from '@src/types/jobs/common.type'
import {
  JobPricesDetailType,
  ProJobDeliveryType,
  ProJobDetailType,
  ProJobFeedbackType,
} from '@src/types/jobs/jobs.type'
import {
  AssignProFilterPostType,
  AssignProListType,
  SaveJobInfoParamsType,
  SaveJobPricesParamsType,
} from '@src/types/orders/job-detail'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export const getAssignableProList = async (
  id: number,
  filters: AssignProFilterPostType,
  isHistory: boolean,
): Promise<{
  totalCount: number
  data: AssignProListType[]
  count: number
}> => {
  const { data } = isHistory
    ? await axios.get(`/api/enough/u/job/${id}/request/history`)
    : await axios.get(`/api/enough/u/pro/job/${id}?${makeQuery(filters)}`)

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
    // console.log(data)

    return data
  } catch (e: any) {
    return {
      id: 0,
      cooperationId: '0',
      items: [],
    }
  }
}

export const getJobInfo = async (
  id: number,
  isHistory: boolean,
): Promise<JobType> => {
  try {
    const { data } = isHistory
      ? await axios.get(`/api/enough/u/job/history/${id}`)
      : await axios.get(`/api/enough/u/job/${id}/info`)
    // console.log(data)

    return data
  } catch (e: any) {
    return {
      id: 0,
      order: { id: -1 },
      corporationId: '',
      name: '',
      status: 60000,
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
      proId: null,
    }
  }
}

export const saveJobInfo = async (
  id: number,
  jobInfoData: SaveJobInfoParamsType,
): Promise<{ id: number }> => {
  try {
    const { data } = await axios.patch(`/api/enough/u/job/${id}`, {
      ...jobInfoData,
    })
    return data
  } catch (e: any) {
    return {
      id: id,
    }
  }
}

export const deleteJob = async (id: number) => {
  await axios.delete(`/api/enough/u/job/${id}`)
}

export const getJobPrices = async (
  id: number,
  isHistory: boolean,
): Promise<JobPricesDetailType> => {
  const { data } = isHistory
    ? await axios.get(`/api/enough/u/job/history/${id}/price`)
    : await axios.get(`/api/enough/u/job/${id}/price`)
  // console.log(data)

  return {
    ...data,
    source: data.sourceLanguage,
    target: data.targetLanguage,
    datas:
      data?.datas?.map((item: ItemResType) => ({
        ...item,
        name: item?.itemName,
        source: data.sourceLanguage,
        target: data.sourceLanguage,
        totalPrice: item.totalPrice ? Number(item.totalPrice) : 0,
      })) || [],
  }
}

export const getJobPriceHistory = async (
  id: number,
): Promise<JobPricesDetailType> => {
  // TODO: type 맞춘 이후 앤드포인트 교체해야함, price와 타입은 동일해야 함
  // const { data } = await axios.get(`/api/enough/u/job/${id}/price/history`)
  const { data } = await axios.get(`/api/enough/u/job/${id}/price`)
  // console.log(data)

  return {
    ...data,
    source: data.sourceLanguage,
    target: data.targetLanguage,
    datas:
      data?.datas?.map((item: ItemResType) => ({
        ...item,
        name: item?.itemName,
        source: data.sourceLanguage,
        target: data.sourceLanguage,
        totalPrice: item.totalPrice ? Number(item.totalPrice) : 0,
      })) || [],
  }
}

export const saveJobPrices = async (
  id: number,
  jobPriceData: SaveJobPricesParamsType,
): Promise<{ id: number }> => {
  try {
    const { data } = await axios.patch(`/api/enough/u/job/${id}/price`, {
      ...jobPriceData,
    })
    return data
  } catch (e: any) {
    return {
      id: id,
    }
  }
}

export const requestJobToPro = async (ids: number[], jobId: number) => {
  await axios.post(`/api/enough/u/job/${jobId}/request`, { proIds: ids })
}

// export const assignJob = async (jobId: number, proId: number) => {
//   await axios.patch(`/api/enough/u/job/${jobId}/request`, {
//     proId: proId,
//     status: 60500,
//   })
// }

export const handleJobAssignStatus = async (
  jobId: number,
  proId: number,
  status: number,
) => {
  await axios.patch(`/api/enough/u/job/${jobId}/request`, {
    proId: proId,
    status: status,
  })
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
  files: Array<{
    jobId: number
    size: number
    name: string
    type: 'SAMPLE' | 'SOURCE' | 'TARGET'
  }>
}): Promise<{ id: number }> => {
  try {
    const { data } = await axios.post(`/api/enough/u/job/upload`, { ...file })
    return data
  } catch (e: any) {
    return {
      id: file.jobId,
    }
  }
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

export const getProJobDetail = async (
  id: number,
): Promise<ProJobDetailType> => {
  const { data } = await axios.get(`/api/enough/u/job/${id}/info`)

  return {
    ...data,

    guideLines: {
      id: 1,
      version: 1,
      userId: 1,
      title: 'Test Guideline',
      writer: 'John Doe',
      email: 'johndoe@example.com',
      client: 'Example Client',
      category: 'Translation',
      serviceType: 'Document',
      updatedAt: '2022-01-01T00:00:00.000Z',
      content: {
        blocks: [
          {
            key: '33kfr',
            data: {},
            text: 'TEST GUIDELINE',
            type: 'unstyled',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
          },
        ],
        entityMap: {},
      },
      files: [
        {
          id: 1,
          name: 'file1.txt',
          size: 1024,
          type: 'text/plain',
          file: 'https://example.com/files/file1.txt',
          createdAt: '2022-01-01T00:00:00.000Z',
        },
        {
          id: 2,
          name: 'file2.jpg',
          size: 2048,
          type: 'image/jpeg',
          file: 'https://example.com/files/file2.jpg',
          createdAt: '2022-01-02T00:00:00.000Z',
        },
      ],
    },
  }
}

export const patchProJobDetail = async (
  id: number,
  params: { status: ProJobStatusType },
) => {
  await axios.patch(`/api/enough/u/job/${id}`, { ...params })
}

export const getProJobDetailDots = async (id: number): Promise<string[]> => {
  const { data } = await axios.get(`/api/enough/u/job/${id}/dot`)
  return data
}

export const getProJobDeliveriesFeedbacks = async (
  id: number,
): Promise<{
  deliveries: Array<ProJobDeliveryType>
  feedbacks: Array<ProJobFeedbackType>
}> => {
  const { data } = await axios.get(
    `/api/enough/u/job/${id}/deliveries-feedback`,
  )

  return data
  // return {
  //   deliveries: data.deliveries,
  //   feedbacks: [
  //     {
  //       id: 1,
  //       isChecked: true,
  //       name: 'Master (D) K',
  //       email: 'd_master_1@glozinc.com',
  //       createdAt: '2023-09-18T01:44:49.997Z',
  //       feedback: 'rishatest',
  //     },
  //   ],
  // }
}

export const postProJobDeliveries = async (params: {
  jobId: number
  deliveryType: 'partial' | 'final'
  note?: string
  isWithoutFile: boolean
  files?: Array<{
    size: number
    name: string
    type: 'TARGET' | 'SOURCE' | 'SAMPLE'
  }>
}) => {
  const { data } = await axios.post(`/api/enough/u/job/delivery`, {
    ...params,
  })

  return data
}

export const patchProJobFeedbackCheck = async (
  jobId: number,
  feedbackId: number,
) => {
  const { data } = await axios.patch(
    `/api/enough/u/job/${jobId}/feedback?feedbackId=${feedbackId}`,
  )

  return data
}

export const patchProJobSourceFileDownload = async (
  jobId: number,
  fileIds: number[],
) => {
  const { data } = await axios.patch(`/api/enough/u/job/download`, {
    fileIds: fileIds,
  })

  return data
}
