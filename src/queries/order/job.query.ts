import {
  getAssignableProList,
  getJobDetails,
  getJobInfo,
  getJobPriceHistory,
  getJobPrices,
  getMessageList,
  getSourceFileToPro,
} from '@src/apis/jobs/job-detail.api'
import { AssignProFilterPostType } from '@src/types/orders/job-detail'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetAssignableProList = (
  jobId: number,
  filter: AssignProFilterPostType,
  isHistory: boolean,
) => {
  return useQuery(
    ['assignProList', jobId, filter],
    () => getAssignableProList(jobId, filter, isHistory),
    {
      staleTime: 0,

      suspense: false,
      keepPreviousData: false,
    },
  )
}

export const useGetJobDetails = (orderId: number, enabled: boolean) => {
  return useQuery(['jobDetails', orderId], () => getJobDetails(orderId), {
    staleTime: 10 * 1000, // 1

    suspense: false,
    keepPreviousData: true,
    enabled: !!orderId && enabled,
  })
}

export const useGetJobInfo = (jobId: number, isHistory: boolean) => {
  return useQuery(
    ['jobInfo', jobId, isHistory],
    () => getJobInfo(jobId, isHistory),
    {
      staleTime: 10 * 1000, // 1

      suspense: false,
    },
  )
}

export const useGetJobPrices = (jobId: number, isHistory: boolean) => {
  return useQuery(
    ['jobPrices', jobId, isHistory],
    () => getJobPrices(jobId, isHistory),
    {
      staleTime: 10 * 1000, // 1

      suspense: false,
    },
  )
}

export const useGetJobPriceHistory = (jobId: number) => {
  return useQuery(['jobPriceHistory', jobId], () => getJobPriceHistory(jobId), {
    staleTime: 10 * 1000, // 1

    suspense: false,
  })
}

export const useGetMessage = (jobId: number, proId: number) => {
  return useQuery(['message', proId], () => getMessageList(jobId, proId), {
    staleTime: 10 * 100, // 1

    suspense: false,
  })
}

export const useGetSourceFile = (jobId: number) => {
  return useQuery(['sourceFile', jobId], () => getSourceFileToPro(jobId), {
    staleTime: 10 * 1000,
    suspense: false,
  })
}
