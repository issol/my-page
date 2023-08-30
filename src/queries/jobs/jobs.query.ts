import {
  getJobHistory,
  getJobsList,
  getJobsTrackerDetail,
  getJobsTrackerList,
  getProJobList,
} from '@src/apis/jobs.api'
import { JobListFilterType } from '@src/pages/jobs'
import { FilterType as ListFilterType } from '@src/pages/orders/job-list/list-view/list-view'
import { DetailFilterType } from '@src/pages/orders/job-list/tracker-view/[id]'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetJobsList = (filter: ListFilterType) => {
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

export const useGetJobsTrackerDetail = (filter: DetailFilterType) => {
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
  return useQuery(['jobHistory', filter], () => getJobHistory(id, filter), {
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
