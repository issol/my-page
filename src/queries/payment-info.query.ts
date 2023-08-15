import {
  getPaymentInfoRequest,
  getTaxCodeList,
} from './../apis/payment-info.api'
import { useQuery } from 'react-query'
import { toast } from 'react-hot-toast'

export const useGetTaxCodeList = () => {
  return useQuery(
    'taxCodeList',
    () => {
      return getTaxCodeList()
    },
    {
      staleTime: 60 * 10000,
      keepPreviousData: false,
      suspense: true,
      useErrorBoundary: true,
    },
  )
}
export const useGetUserPaymentInfo = (
  id: number,
  isManagerRequest: boolean,
) => {
  return useQuery(
    ['get-payment-info', isManagerRequest, id],
    () => {
      return getPaymentInfoRequest(id, isManagerRequest)
    },
    {
      staleTime: 60 * 10000,
      keepPreviousData: false,
      suspense: true,
      useErrorBoundary: true,
    },
  )
}
