import { getJobsList } from '@src/apis/jobs.api'
import { FilterType } from '@src/pages/orders/job-list/list-view/list-view'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetJobsList = (filter: FilterType) => {
  return useQuery(['jobList', filter], () => getJobsList(filter), {
    staleTime: 60 * 1000, // 1
    suspense: false,
    keepPreviousData: true,
  })
}
