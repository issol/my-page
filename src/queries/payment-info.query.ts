import { useQuery } from 'react-query'
import { toast } from 'react-hot-toast'
import {
  getUserPaymentInfo,
  getUserPaymentInfoForManager,
} from '@src/apis/payment-info.api'

export const useGetUserPaymentInfo = (
  id: number,
  detailId: number | null,
  setDetailId: (val: number | null) => void,
) => {
  return useQuery(
    'get-payment-info',
    () => {
      console.log(detailId)
      if (!detailId) {
        console.log('일반')
        return getUserPaymentInfo(id)
      } else {
        console.log('전부')
        return getUserPaymentInfoForManager(detailId)
      }
    },
    {
      cacheTime: 0,
      keepPreviousData: false,
      suspense: true,
      useErrorBoundary: true,
      onSuccess: () => {
        setDetailId(null)
      },
    },
  )
}
