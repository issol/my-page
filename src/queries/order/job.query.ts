import { getAssignProList, getJobDetails } from '@src/apis/job-detail.api'
import { AssignProFilterPostType } from '@src/types/orders/job-detail'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetAssignProList = (filter: AssignProFilterPostType) => {
  return useQuery(['assignProList', filter], () => getAssignProList(filter), {
    staleTime: 60 * 1000, // 1

    suspense: false,
    keepPreviousData: true,
  })
}

export const useGetJobDetails = (orderId: number) => {
  return useQuery(['jobDetails', orderId], () => getJobDetails(orderId), {
    staleTime: 60 * 1000, // 1

    suspense: false,
    keepPreviousData: true,
  })
}
