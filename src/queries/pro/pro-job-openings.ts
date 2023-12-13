import { getJobOpenings } from '@src/apis/pro/pro-job-openings.api'
import {
  JobOpeningListFilterType,
  JobOpeningListType,
} from '@src/types/pro/pro-job-openings'
import { useQuery } from 'react-query'

export const useGetJobOpeningList = (filters: JobOpeningListFilterType) => {
  return useQuery<{ data: JobOpeningListType[]; totalCount: number }>(
    ['Applied-roles', filters],
    () => getJobOpenings(filters),
    {
      staleTime: 60 * 1000, // 1
      keepPreviousData: true,
      suspense: true,

      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}
