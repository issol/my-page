import {
  getAssignableProList,
  getJobAssignProRequests,
  getJobDetails,
  getJobInfo,
  getJobPriceHistory,
  getJobPrices,
  getJobRequestHistory,
  getMessageList,
  getRequestedProHistory,
  getSourceFileToPro,
} from '@src/apis/jobs/job-detail.api'
import { AssignProFilterPostType } from '@src/types/orders/job-detail'
import toast from 'react-hot-toast'
import { useQueries, useQuery } from 'react-query'

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
      enabled: !!jobId,
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
    select: data => {
      return {
        ...data,
        items: data.items
          .sort((a, b) => a.sortingOrder - b.sortingOrder)
          .map(value => ({
            ...value,
            jobs: value.jobs.sort((a, b) => a.sortingOrder - b.sortingOrder),
          })),
      }
    },
  })
}

export const useGetJobInfo = (jobId: number[] | number, isHistory: boolean) => {
  if (typeof jobId === 'number') {
    return useQuery(
      ['jobInfo', jobId, isHistory],
      () => getJobInfo(jobId, isHistory),
      {
        staleTime: 10 * 1000, // 1

        suspense: false,
      },
    )
  } else {
    return useQueries(
      jobId.map(id => {
        return {
          queryKey: ['jobInfo', id, isHistory],
          queryFn: () => getJobInfo(id, isHistory),

          staleTime: 10 * 1000, // 1

          suspense: false,
        }
      }),
    )
  }
}

export const useGetJobPrices = (
  jobId: number[] | number,
  isHistory: boolean,
) => {
  if (typeof jobId === 'number') {
    return useQuery(
      ['jobPrices', jobId, isHistory],
      () => getJobPrices(jobId, isHistory),
      {
        staleTime: 10 * 1000, // 1
        suspense: false,
      },
    )
  } else {
    return useQueries(
      jobId.map(id => {
        return {
          queryKey: ['jobPrices', id, isHistory],
          queryFn: () => getJobPrices(id, isHistory),
          staleTime: 10 * 1000, // 1
          suspense: false,
        }
      }),
    )
  }
}

export const useGetJobAssignProRequests = (jobId: number[] | number) => {
  if (typeof jobId === 'number') {
    return useQuery(
      ['jobAssignProRequests', jobId],
      () => getJobAssignProRequests(jobId),
      {
        staleTime: 10 * 1000, // 1
        suspense: false,
        refetchInterval: 1 * 60 * 1000, // 1분마다 리프레시
      },
    )
  } else {
    return useQueries(
      jobId.map(id => {
        return {
          queryKey: ['jobAssignProRequests', id],
          queryFn: () => getJobAssignProRequests(id),
          staleTime: 10 * 1000, // 1
          suspense: false,
          refetchInterval: 1 * 60 * 1000, // 1분마다 리프레시
        }
      }),
    )
  }
}

export const useGetJobPriceHistory = (jobId: number) => {
  return useQuery(['jobPriceHistory', jobId], () => getJobPriceHistory(jobId), {
    staleTime: 10 * 1000, // 1
    enabled: !!jobId,
    suspense: false,
  })
}

export const useGetMessage = (jobId: number, proId: number, type: string) => {
  return useQuery(
    ['message', proId],
    () => getMessageList(jobId, proId, type),
    {
      staleTime: 10 * 100, // 1

      suspense: false,
    },
  )
}
export const useGetJobRequestHistory = (jobId: number | number[]) => {
  if (typeof jobId === 'number') {
    return useQuery(
      ['jobRequestHistory', jobId],
      () => getJobRequestHistory(jobId),
      {
        staleTime: 10 * 1000, // 1
        suspense: false,
        refetchInterval: 1 * 60 * 1000, // 1분마다 리프레시
      },
    )
  } else {
    return useQueries(
      jobId.map(id => {
        return {
          queryKey: ['jobRequestHistory', id],
          queryFn: () => getJobRequestHistory(id),
          staleTime: 10 * 1000, // 1
          suspense: false,
          refetchInterval: 1 * 60 * 1000, // 1분마다 리프레시
        }
      }),
    )
  }
}

export const useGetSourceFile = (jobId: number) => {
  return useQuery(['sourceFile', jobId], () => getSourceFileToPro(jobId), {
    staleTime: 10 * 1000,
    suspense: false,
    enabled: !!jobId,
  })
}

export const useGetRequestedProHistory = (historyId: number) => {
  return useQuery(
    ['requestedProHistory', historyId],
    () => getRequestedProHistory(historyId),
    {
      staleTime: 10 * 1000, // 1
      suspense: false,
    },
  )
}
