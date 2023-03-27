import { getPaymentInfoRequest } from './../apis/payment-info.api'
import { useQuery } from 'react-query'
import { toast } from 'react-hot-toast'

export const useGetUserPaymentInfo = (
  id: number,
  isManagerRequest: boolean,
) => {
  return useQuery(
    'get-payment-info',
    () => {
      return getPaymentInfoRequest(id, isManagerRequest)
    },
    {
      cacheTime: 0,
      keepPreviousData: false,
      suspense: true,
      useErrorBoundary: true,
    },
  )
}
