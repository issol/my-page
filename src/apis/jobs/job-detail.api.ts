import axios from '@src/configs/axios'
import { FileType } from '@src/types/common/file.type'
import { JobItemType, JobType } from '@src/types/common/item.type'
import { ItemResType } from '@src/types/common/orders-and-quotes.type'
import { ProJobStatusType } from '@src/types/jobs/common.type'
import {
  JobAssignProRequestsType,
  JobBulkRequestFormType,
  JobPricesDetailType,
  JobRequestFormType,
  ProJobDeliveryType,
  ProJobDetailType,
  ProJobFeedbackType,
  jobPriceHistoryType,
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
      clientId: 0,
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
      pro: null,
      historyAt: null,
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

export const deleteJobFile = async (fileId: number) => {
  await axios.delete(`/api/enough/u/job/file/${fileId}`)
}

export const getJobPrices = async (
  id: number,
  isHistory: boolean,
): Promise<JobPricesDetailType | jobPriceHistoryType> => {
  const { data } = isHistory
    ? await axios.get(`/api/enough/u/job/history/${id}/price`)
    : await axios.get(`/api/enough/u/job/${id}/price`)
  // console.log(data)

  // return {
  //   ...data,
  //   source: data.sourceLanguage,
  //   target: data.targetLanguage,
  //   datas:
  //     data?.datas?.map((item: ItemResType) => ({
  //       ...item,
  //       name: item?.itemName,
  //       source: data.sourceLanguage,
  //       target: data.sourceLanguage,
  //       totalPrice: item.totalPrice ? Number(item.totalPrice) : 0,
  //     })) || [],
  // }
  return data
}

export const getJobPriceHistory = async (
  id: number,
): Promise<Array<jobPriceHistoryType>> => {
  const { data } = await axios.get(`/api/enough/u/job/${id}/price/history`)
  // const { data } = await axios.get(`/api/enough/u/job/${id}/price`)
  // console.log(data)

  // return [
  //   ...data,
  //   source: data.sourceLanguage,
  //   target: data.targetLanguage,
  //   datas:
  //     data?.datas?.map((item: ItemResType) => ({
  //       ...item,
  //       name: item?.itemName,
  //       source: data.sourceLanguage,
  //       target: data.sourceLanguage,
  //       totalPrice: item.totalPrice ? Number(item.totalPrice) : 0,
  //     })) || [],
  // ]
  return data
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
  role: 'lpm' | 'pro',
) => {
  if (role === 'pro') {
    await axios.patch(`/api/enough/u/job/request/${jobId}/reply`, {
      proId: proId,
      status: status,
    })
  } else if (role === 'lpm') {
    await axios.patch(`/api/enough/u/job/request/${jobId}/set-status`, {
      proId: proId,
      status: status,
    })
  }
}

export const handleJobReAssign = async (
  jobId: number,
): Promise<{ id: number }> => {
  try {
    const { data } = await axios.patch(
      `/api/enough/u/job/${jobId}/request/re-assign`,
      {
        jobId: jobId,
      },
    )
    return data
  } catch (e: any) {
    return {
      id: jobId,
    }
  }
}

export const getMessageList = async (
  jobId: number,
  proId: number,
): Promise<{
  unReadCount: number
  members: {
    userId: number
    firstName: string
    middleName: string
    lastName: string
    role: string // lpm | pro
  }[]
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
        isPro: boolean
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
      members: [],
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

export const readMessage = async (jobId: number, proId: number) => {
  await axios.patch(`/api/enough/u/job/${jobId}/message`, {
    jobId: jobId,
    proId: proId,
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
  isHistory: boolean,
): Promise<ProJobDetailType> => {
  const { data } = isHistory
    ? await axios.get(`/api/enough/u/job/history/${id}`)
    : await axios.get(`/api/enough/u/job/${id}/info`)

  return data
  // return {
  //   ...data,

  //   guideLines: {
  //     id: 1,
  //     version: 1,
  //     userId: 1,
  //     title: 'Test Guideline',
  //     writer: 'John Doe',
  //     email: 'johndoe@example.com',
  //     client: 'Example Client',
  //     category: 'Translation',
  //     serviceType: 'Document',
  //     updatedAt: '2022-01-01T00:00:00.000Z',
  //     content: {
  //       blocks: [
  //         {
  //           key: '33kfr',
  //           data: {},
  //           text: 'TEST GUIDELINE',
  //           type: 'unstyled',
  //           depth: 0,
  //           entityRanges: [],
  //           inlineStyleRanges: [],
  //         },
  //       ],
  //       entityMap: {},
  //     },
  //     files: [
  //       {
  //         id: 1,
  //         name: 'file1.txt',
  //         size: 1024,
  //         type: 'text/plain',
  //         file: 'https://example.com/files/file1.txt',
  //         createdAt: '2022-01-01T00:00:00.000Z',
  //       },
  //       {
  //         id: 2,
  //         name: 'file2.jpg',
  //         size: 2048,
  //         type: 'image/jpeg',
  //         file: 'https://example.com/files/file2.jpg',
  //         createdAt: '2022-01-02T00:00:00.000Z',
  //       },
  //     ],
  //   },
  // }
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

export const addJobFeedback = async (
  jobId: number,
  feedbackData: string,
): Promise<{ job: { id: number } }> => {
  try {
    const { data } = await axios.post(`/api/enough/u/job/${jobId}/feedback`, {
      feedback: feedbackData,
    })
    return data
  } catch (e: any) {
    return {
      job: { id: jobId },
    }
  }
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

const testData: JobAssignProRequestsType[] = Array.from(
  { length: 2 },
  (_, i) => ({
    type:
      i % 3 === 0
        ? 'relayRequest'
        : i % 3 === 1
          ? 'bulkAutoAssign'
          : 'bulkManualAssign',
    round: i + 1,
    interval: 60,
    requestCompleted: false,
    pros: [
      {
        userId: i === 0 ? 20 : 34,
        firstName: `FirstName${i + 1}`,
        lastName: `LastName${i + 1}`,
        email: `user${i + 1}@example.com`,
        assignmentStatus: 70000,

        isOnboarded: i % 2 === 0,
        isActive: i % 2 === 1,
        assignmentStatusUpdatedAt: new Date().toISOString(),
        responseLight: i % 3 === 0 ? 'Red' : i % 3 === 1 ? 'Yellow' : 'Green',
        ongoingJobCount: i,
        order: i,
        messages: [
          {
            writer: {
              userId: i + 1,
              email: `user${i + 1}@example.com`,
              firstName: `FirstName${i + 1}`,
              lastName: `LastName${i + 1}`,
            },
            message: `Test message ${i + 1}`,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }),
)

export const getJobAssignProRequests = async (
  id: number,
): Promise<{
  requests: Array<JobAssignProRequestsType>
  id: number
  round: number
}> => {
  console.log(id)

  const { data } = await axios.get(`/api/enough/u/job/${id}/request/list`)
  return data
}

export const createRequestJobToPro = async (params: JobRequestFormType) => {
  const { data } = await axios.post(`/api/enough/u/job/request/relay`, {
    ...params,
  })
  // const { data } = await axios.post(`/api/enough/u/job/request`, {
  //   ...params,
  // })

  // return data
  return data
}

export const createBulkRequestJobToPro = async (
  params: JobBulkRequestFormType,
) => {
  const { data } = await axios.post(
    `/api/enough/u/job/${params.jobId}/request/bulk`,
    {
      ...params,
    },
  )
  // const { data } = await axios.post(`/api/enough/u/job/request`, {
  //   ...params,
  // })

  // return data
  return data
}
