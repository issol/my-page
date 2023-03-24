import { useQuery } from 'react-query'
import { toast } from 'react-hot-toast'
import { getUserPaymentInfo } from '@src/apis/payment-info.api'

export const useGetUserPaymentInfo = (id: number) => {
  return useQuery(
    'get-payment-info',
    () => {
      return getUserPaymentInfo(id)
    },
    {
      suspense: true,
      useErrorBoundary: true,
    },
  )
}
