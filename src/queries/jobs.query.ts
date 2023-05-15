import {
  getJobsList,
  getJobsTrackerDetail,
  getJobsTrackerList,
} from '@src/apis/jobs.api'
import { FilterType as listFilterType } from '@src/pages/orders/job-list/list-view/list-view'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetJobsList = (filter: listFilterType) => {
  return useQuery(['jobList', filter], () => getJobsList(filter), {
    staleTime: 60 * 1000, // 1
    suspense: false,
    keepPreviousData: true,
  })
}
export const useGetJobsTrackerList = (filter: listFilterType) => {
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

export const useGetJobsTrackeDetail = (filter: listFilterType) => {
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
