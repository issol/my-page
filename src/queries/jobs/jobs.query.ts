import {
  getProJobDeliveriesFeedbacks,
  getProJobDetail,
  getProJobDetailDots,
} from '@src/apis/job-detail.api'
import {
  getJobHistory,
  getJobsList,
  getJobsTrackerDetail,
  getJobsTrackerList,
  getProJobClientList,
  getProJobList,
} from '@src/apis/jobs.api'
import { JobListFilterType } from '@src/pages/jobs/requested-ongoing-list'

import {
  FilterPostType,
  FilterType as ListFilterType,
} from '@src/pages/orders/job-list/list-view/list-view'
import {
  DetailFilterResponseType,
  DetailFilterType,
} from '@src/pages/orders/job-list/tracker-view/[id]'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetJobsList = (filter: FilterPostType) => {
  return useQuery(['jobList', filter], () => getJobsList(filter), {
    staleTime: 60 * 1000, // 1
    suspense: false,
    keepPreviousData: true,
  })
}
export const useGetJobsTrackerList = (filter: ListFilterType) => {
  return useQuery(
    ['jobTrackerList', filter],
    () => getJobsTrackerList(filter),
    {
      staleTime: 60 * 1000, // 1
      suspense: false,
      keepPreviousData: true,
    },
  )
}

export const useGetJobsTrackerDetail = (filter: DetailFilterResponseType) => {
  return useQuery(
    ['jobTrackerDetail', filter],
    () => getJobsTrackerDetail(filter),
    {
      staleTime: 60 * 1000, // 1
      suspense: false,
      keepPreviousData: true,
    },
  )
}
export const useGetJobHistory = (
  id: number,
  filter: { skip: number; take: number },
) => {
  return useQuery(['jobHistory', id, filter], () => getJobHistory(id, filter), {
    staleTime: 60 * 1000, // 1
    suspense: false,
    keepPreviousData: true,
  })
}

export const useGetProJobList = (filter: JobListFilterType) => {
  return useQuery(['proJobList', filter], () => getProJobList(filter), {
    staleTime: 60 * 1000, // 1
    suspense: true,
    keepPreviousData: true,
  })
}

export const useGetProJobDetail = (
  id: number,
  isHistory: boolean,
  enabled: boolean,
) => {
  return useQuery(['proJobDetail', id], () => getProJobDetail(id, isHistory), {
    staleTime: 60 * 1000, // 1
    suspense: true,
    keepPreviousData: true,
    enabled: enabled,
  })
}

export const useGetProJobClientList = (filter: {
  filterType: 'client' | 'contactPerson'
}) => {
  return useQuery(
    ['proJobClientList', filter],
    () => getProJobClientList(filter),
    {
      staleTime: 60 * 1000, // 1
      suspense: true,
      keepPreviousData: true,
    },
  )
}

export const useGetProJobDots = (id: number) => {
  return useQuery(['proJobDots', id], () => getProJobDetailDots(id), {
    staleTime: 60 * 1000, // 1
    suspense: true,
    keepPreviousData: true,
  })
}

export const useGetProJobDeliveriesFeedbacks = (id: number) => {
  return useQuery(
    ['proJobDeliveries', id],
    () => getProJobDeliveriesFeedbacks(id),
    {
      staleTime: 60 * 1000, // 1
      suspense: true,
      keepPreviousData: true,
    },
  )
}
