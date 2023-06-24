import {
  getAssignProList,
  getJobDetails,
  getJobInfo,
  getJobPrices,
  getMessageList,
  getSourceFileToPro,
} from '@src/apis/job-detail.api'
import { getClientRequestList } from '@src/apis/requests/client-request.api'
import { AssignProFilterPostType } from '@src/types/orders/job-detail'
import { RequestFilterType } from '@src/types/requests/filters'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetClientRequestList = (filter: RequestFilterType) => {
  return useQuery(
    ['request/client/list', filter],
    () => getClientRequestList(filter),
    {
      staleTime: 60 * 1000, // 1
      suspense: false,
      keepPreviousData: true,
    },
  )
}
