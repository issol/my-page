import {
  getAssignProList,
  getJobDetails,
  getJobInfo,
  getJobPrices,
  getMessageList,
  getSourceFileToPro,
} from '@src/apis/job-detail.api'
import { AssignProFilterPostType } from '@src/types/orders/job-detail'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetAssignProList = (
  jobId: number,
  filter: AssignProFilterPostType,
) => {
  return useQuery(
    ['assignProList', filter],
    () => getAssignProList(jobId, filter),
    {
      staleTime: 60 * 1000, // 1

      suspense: false,
      keepPreviousData: true,
    },
  )
}

export const useGetJobDetails = (orderId: number) => {
  return useQuery(['jobDetails', orderId], () => getJobDetails(orderId), {
    staleTime: 60 * 1000, // 1

    suspense: false,
    keepPreviousData: true,
  })
}

export const useGetJobInfo = (jobId: number) => {
  return useQuery(['jobInfo', jobId], () => getJobInfo(jobId), {
    staleTime: 60 * 1000, // 1

    suspense: false,
  })
}

export const useGetJobPrices = (jobId: number) => {
  return useQuery(['jobPrices', jobId], () => getJobPrices(jobId), {
    staleTime: 60 * 1000, // 1

    suspense: false,
  })
}

export const useGetMessage = (jobId: number, proId: number) => {
  return useQuery(['message', proId], () => getMessageList(jobId, proId), {
    staleTime: 60 * 1000, // 1

    suspense: false,
  })
}

export const useGetSourceFile = (jobId: number) => {
  return useQuery(['sourceFile', jobId], () => getSourceFileToPro(jobId), {
    staleTime: 60 * 1000,
    suspense: false,
  })
}
