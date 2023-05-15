import {
  getJobsList,
  getJobsTrackerDetail,
  getJobsTrackerList,
} from '@src/apis/jobs.api'
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

export const useGetJobsTrackeDetail = (
  id: number,
  filter: DetailFilterType,
) => {
  return useQuery(
    ['jobTrackerDetail', filter],
    () => getJobsTrackerDetail(id, filter),
    {
      staleTime: 60 * 1000, // 1
      suspense: false,
      keepPreviousData: true,
    },
  )
}
