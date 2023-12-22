import {
  JobPostingDetailType,
  getJobPostingDetail,
} from '@src/apis/jobPosting.api'
import {
  getJobOpeningDetail,
  getJobOpenings,
} from '@src/apis/pro/pro-job-openings.api'
import {
  JobOpeningDetailType,
  JobOpeningListFilterType,
  JobOpeningListType,
} from '@src/types/pro/pro-job-openings'
import { useQuery } from 'react-query'

export const useGetJobOpeningList = (filters: JobOpeningListFilterType) => {
  return useQuery<{ data: JobOpeningListType[]; totalCount: number }>(
    ['pro-job-opening-list', filters],
    () => getJobOpenings(filters),
    {
      staleTime: 60 * 1000, // 1
      keepPreviousData: true,
      suspense: true,

      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useGetJobOpeningDetail = (id: number) => {
  return useQuery<JobOpeningDetailType>(
    ['pro-job-opening-detail', id],
    () => getJobOpeningDetail(id),
    {
      staleTime: 60 * 1000, // 1
      keepPreviousData: true,
      suspense: true,
      enabled: !!id,

      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}
