import axios from '@src/configs/axios'
import { FileType } from '@src/types/common/file.type'
import { JobItemType, JobType } from '@src/types/common/item.type'

import {
  JobAddProsFormType,
  JobAssignProRequestsType,
  JobBulkRequestFormType,
  JobPrevNextItem,
  jobPriceHistoryType,
  JobPricesDetailType,
  JobRequestedProHistoryType,
  JobRequestFormType,
  JobRequestHistoryType,
  ProJobDeliveryType,
  ProJobDetailType,
  ProJobFeedbackType,
} from '@src/types/jobs/jobs.type'
import {
  AssignProFilterPostType,
  AssignProListType,
  JobRequestReviewListType,
  JobRequestReviewParamsType,
  SaveJobInfoParamsType,
  SaveJobPricesParamsType,
} from '@src/types/orders/job-detail'
import { makeQuery } from 'src/shared/transformer/query.transformer'
import { JobStatus } from '@src/types/common/status.type'

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
  const { data } = isHistory
    ? await axios.get(`/api/enough/u/job/history/${id}`)
    : await axios.get(`/api/enough/u/job/${id}/info`)
  // console.log(data)

  const result: JobType = {
    ...data,
  }

  // return data
  return result
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

// TODO: api url 수정 필요
export const setJobStatus = async (id: number, status: number) => {
  await axios.patch(`/api/enough/u/job/${id}/set-status`, { status: status })
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
    await axios.patch(
      `/api/enough/u/job/request/${jobId}/reply?status=${status}`,
    )
  } else if (role === 'lpm') {
    await axios.patch(`/api/enough/u/job/request/${jobId}/set-status`, {
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

type MessageItem = {
  id: number
  content: string
  createdAt: string
  firstName: string
  middleName: string | null
  lastName: string
  email: string
  role: string
  isPro: boolean
  messageType: string // 시스템 메세지인지 사용자 메세지인지 구분용도
}

export type Member = {
  userId: number
  firstName: string
  middleName: string
  lastName: string
  role?: string // lpm | pro
  email: string
}

export const getMessageList = async (
  jobId: number,
  proId: number,
  type: string,
): Promise<{
  unReadCount: number
  proInfo: Member
  contents: MessageItem[] | null
}> => {
  try {
    const { data } = await axios.get(
      // `/api/enough/u/job/${jobId}/message?proId=${proId}`,
      `/api/enough/u/job/message?type=${type}&jobId=${jobId}&proId=${proId}`,
    )
    return data
  } catch (e: any) {
    return {
      unReadCount: 0,
      contents: null,
      proInfo: {
        userId: 0,
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
      },
    }
  }
}

export const sendMessage = async (
  jobId: number,
  jobRequestId: number,
  proId: number,
  message: string,
) => {
  const body: {
    jobId: number
    proId: number
    message: string
    jobRequestId?: number
  } = {
    jobId: jobId,
    proId: proId,
    message: message,
  }

  if (jobRequestId !== 0) {
    body.jobRequestId = jobRequestId
  }

  await axios.post(`/api/enough/u/job/message`, body)
}

export const readMessage = async (
  jobId: number,
  proId: number,
  type: string,
) => {
  await axios.patch(`/api/enough/u/job/message/read`, {
    jobId: jobId,
    proId: proId,
    type: type,
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
}) => {
  const { data } = await axios.post(`/api/enough/u/job/upload`, { ...file })
  return data
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
  params: { status: JobStatus },
) => {
  await axios.patch(`/api/enough/u/job/${id}`, { ...params })
}

export const getProJobDetailDots = async (id: number): Promise<string[]> => {
  const { data } = await axios.get(`/api/enough/u/job/${id}/dot`)
  return data
}

export const getPreviousAndNextJob = async (
  jobId: number,
): Promise<{
  previousJob: JobPrevNextItem | null
  nextJob: JobPrevNextItem | null
}> => {
  const { data } = await axios.get(`/api/enough/u/job/${jobId}/previous-next`)
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

export const getJobAssignProRequests = async (
  id: number,
): Promise<{
  requests: Array<JobAssignProRequestsType>
  id: number
  frontRound: number
}> => {
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

export const addProCurrentRequest = async (params: JobAddProsFormType) => {
  const { data } = await axios.patch(
    `/api/enough/u/job/request/relay/add-pro`,
    {
      ...params,
    },
  )
  return data
}

export const forceAssign = async (jobId: number, proId: number) => {
  const { data } = await axios.patch(
    `/api/enough/u/job/${jobId}/request/assign?proId=${proId}`,
  )
}

export const requestRedelivery = async (params: {
  jobId: number
  deleteReason: string[]
  message?: string
}) => {
  const { data } = await axios.post(`/api/enough/u/job/redelivery`, {
    ...params,
  })
  return data
}

export const setMoveToNextJob = async (params: {
  jobId: number
  autoSharingFile: '1' | '0'
}) => {
  const { data } = await axios.patch(
    `/api/enough/u/job/${params.jobId}/move-to-next`,
    {
      autoSharingFile: params.autoSharingFile,
    },
  )
}

export const saveTriggerOptions = async (params: {
  updateData: {
    jobId: number
    statusCodeForAutoNextJob: number | null
    autoNextJob: '0' | '1'
    autoSharingFile: '0' | '1'
  }[]
  deleteData: { jobId: number[] }
}) => {
  //TODO API endpoint 추가 필요
  await axios.patch(`/api/enough/u/job/edit-trigger-option`, {
    ...params,
  })

  return true
}

export const addTriggerBetweenJobs = async (
  params: {
    jobId: number
    sortingOrder: number
    triggerOrder?: number
  }[],
) => {
  //TODO API endpoint 추가 필요
  await axios.patch(`/api/enough/u/job/add-trigger`, {
    data: params,
  })
}
export const getJobRequestHistory = async (
  jobId: number,
): Promise<{
  data: JobRequestHistoryType[]
  count: number
  totalCount: number
  jobId: number
}> => {
  const { data } = await axios.get(`/api/enough/u/job/${jobId}/history`)

  return data
}

export const getRequestedProHistory = async (
  historyId: number,
): Promise<{
  id: number
  frontRound: number
  requests: Array<JobRequestedProHistoryType>
}> => {
  const { data } = await axios.get(
    `/api/enough/u/job/${historyId}/request/list`,
  )

  return data
}

export const getRequestAttachment = async (jobId: number) => {
  const { data } = await axios.get(
    `/api/enough/u/job/${jobId}/request-attachment`,
  )

  return data
}

export const setFileLock = async (fileId: number) => {
  await axios.patch(`/api/enough/u/job/file/${fileId}/lock`)
}

export const setFileUnlock = async (fileId: number) => {
  await axios.patch(`/api/enough/u/job/file/${fileId}/unlock`)
}

export const importFileFromRequest = async (
  jobId: number,
  files: {
    fileExtension: string
    fileName: string
    filePath: string
    fileSize: number
    downloadAvailable: boolean
  }[],
) => {
  const { data } = await axios.patch(
    `/api/enough/u/job/${jobId}/import-request-attachment`,
    {
      targetFileData: files,
    },
  )

  return data
}

export const getJobRequestReview = async (
  jobId: number,
  assigneeId: number[],
): Promise<Array<JobRequestReviewListType>> => {
  const { data } = await axios.get(
    `/api/enough/u/job-review-request/list?jobId=${jobId}&${makeQuery({ assigneeId: assigneeId })}`,
  )

  return data.data
  // const data: Array<JobRequestReviewListType> = [
  //   {
  //     jobId: jobId,
  //     id: 0,
  //     corporationId: '001',
  //     createdAt: '2022-01-01T00:00:00.000Z',
  //     requestor: 'John Doe',
  //     assignee: 'Jane Doe',
  //     isCompleted: true,
  //     desiredDueAt: '2022-02-01T00:00:00.000Z',
  //     desiredDueTimezone: { label: 'Korea', code: 'KR' },
  //     runtime: '2 hours',
  //     wordCount: '1000',
  //     note: 'This is a note',
  //     reviewedNote: '요청하신 파일 보내드립니다.',
  //     files: [
  //       {
  //         file: 'project/908/source/sample_1280x720_surfing_with_audio.avi',
  //         id: 383,
  //         name: 'sample_960x400_ocean_with_audio.mp4',
  //         size: 17520898,
  //         type: 'SOURCE',
  //         createdAt: '2022-01-01T00:00:00.000Z',
  //       },
  //       {
  //         file: 'project/908/BOYNEXTDOOR_WHATDOOR_EP5_환상의나라캐스트체험1_믹싱용2(번역용re)_240119_ENG_Final.srt',
  //         id: 385,
  //         name: 'BOYNEXTDOOR_WHATDOOR_EP5_환상의나라캐스트체험1_믹싱용2(번역용re)_240119_ENG_Final.srt',
  //         size: 54949,
  //         type: 'TARGET',
  //         createdAt: '2022-01-01T00:00:00.000Z',
  //       },
  //       {
  //         file: 'project/908/BOYNEXTDOOR_WHATDOOR_EP5_환상의나라캐스트체험1_믹싱용2(번역용re)_240119_ENG_Final.srt',
  //         id: 388,
  //         name: 'BOYNEXTDOOR_WHATDOOR_EP5_환상의나라캐스트체험1_믹싱용2(번역용re)_240119_ENG_Final.srt',
  //         size: 54949,
  //         type: 'REVIEWED',
  //         createdAt: '2022-01-01T00:00:00.000Z',
  //       },
  //     ],
  //   },
  //   {
  //     jobId: jobId,
  //     id: 1,
  //     corporationId: '002',
  //     createdAt: '2024-01-01T00:00:00.000Z',
  //     requestor: 'John Doe',
  //     assignee: 'Jane Doe',
  //     isCompleted: true,
  //     desiredDueAt: '2022-02-01T00:00:00.000Z',
  //     desiredDueTimezone: { label: 'Korea', code: 'KR' },
  //     runtime: '2 hours',
  //     wordCount: '1000',
  //     note: 'This is a note',
  //     reviewedNote: '요청하신 파일 보내드립니다.',
  //     files: [
  //       {
  //         file: 'project/908/BOYNEXTDOOR_WHATDOOR_EP5_환상의나라캐스트체험1_믹싱용2(번역용re)_240119_ENG_Final.srt',
  //         id: 387,
  //         name: 'BOYNEXTDOOR_WHATDOOR_EP5_환상의나라캐스트체험1_믹싱용2(번역용re)_240119_ENG_Final.srt',
  //         size: 54949,
  //         type: 'TARGET',
  //         createdAt: '2022-01-01T00:00:00.000Z',
  //       },
  //     ],
  //   },
  //   {
  //     jobId: jobId,
  //     id: 2,
  //     corporationId: '003',
  //     createdAt: '2023-01-01T00:00:00.000Z',
  //     requestor: 'Leriel Kim',
  //     assignee: 'Jane Doe',
  //     isCompleted: false,
  //     desiredDueAt: '2022-02-01T00:00:00.000Z',
  //     desiredDueTimezone: { label: 'Korea', code: 'KR' },
  //     runtime: '2 hours',
  //     wordCount: '1000',
  //     note: 'This is a note',
  //     reviewedNote: '요청하신 파일 보내드립니다.',
  //     files: [],
  //   },
  // ]
  // return {
  //   jobId: jobId,
  //   data: data,
  // }
  // const {data} = await axios.get(`/api/enough/u/job/${jobId}/request/review`)
}

export const createRequestReview = async (
  params: JobRequestReviewParamsType,
) => {
  const { data } = await axios.post(`/api/enough/u/job-review-request`, {
    ...params,
  })
  return data
}

export const updateRequestReview = async (
  params: JobRequestReviewParamsType,
  id: number,
) => {
  const { data } = await axios.patch(`/api/enough/u/job-review-request/${id}`, {
    ...params,
  })
  return data
}

export const completeRequestReview = async (id: number, type: boolean) => {
  await axios.patch(
    `/api/enough/u/job-review-request/${id}/${type ? 'complete' : 'incomplete'}`,
  )
}

export const saveReviewedFile = async (
  params: {
    noteFromAssignee?: string
    files?: Array<{
      name: string
      path: string
      extension: string
      size: number
      type: 'SAMPLE' | 'SOURCE' | 'TARGET' | 'REVIEWED'
      jobFileId?: number
    }>
  },
  id: number,
) => {
  await axios.patch(`/api/enough/u/job-review-request/${id}/submit`, {
    ...params,
  })
}
