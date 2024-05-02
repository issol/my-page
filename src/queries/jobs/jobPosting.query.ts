import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'
import { getJobPostingDetail, getJobPostingList } from 'src/apis/jobPosting.api'
import { FilterType } from 'src/pages/jobPosting'

export const useGetJobPostingList = (filter: FilterType | null) => {
  return useQuery(
    ['get-jobPosting/list', filter],
    () => {
      return getJobPostingList(filter!)
    },
    {
      suspense: true,
      staleTime: 60 * 1000,
      keepPreviousData: true,
      enabled: !!filter,
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}

export const useGetJobPostingDetail = (id: number, enabled: boolean) => {
  return useQuery(
    'get-jobPosting/detail',
    () => {
      return getJobPostingDetail(id)
    },
    {
      enabled: enabled,
      suspense: true,
      useErrorBoundary: false,
    },
  )
}
