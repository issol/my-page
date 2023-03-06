import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'
import { getJobPostingDetail, getJobPostingList } from 'src/apis/jobPosting.api'
import { FilterType } from 'src/pages/jobPosting'

export const useGetJobPostingList = (
  filter: FilterType,
  search: boolean,
  setSearch: (v: boolean) => void,
) => {
  return useQuery(
    'get-jobPosting/list',
    () => {
      return getJobPostingList(filter)
    },
    {
      suspense: true,
      enabled: search,
      onSuccess: () => setSearch(false),
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
