import {
  getClientBillingAddress,
  getClientOfficeList,
  getClientPaymentFile,
  getClientPaymentInfo,
} from '@src/apis/payment/client-payment.api'
import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetClientOffice = (clientId: number) => {
  return useQuery(
    ['get/client/office', clientId],
    () => {
      return getClientOfficeList(clientId)
    },
    {
      suspense: true,
      useErrorBoundary: true,
      staleTime: 60 * 1000,
      keepPreviousData: true,
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}

export const useGetClientPaymentInfo = (clientId: number) => {
  return useQuery(
    ['get/client/payment', clientId],
    () => {
      return getClientPaymentInfo(clientId)
    },
    {
      suspense: true,
      useErrorBoundary: true,
      staleTime: 60 * 1000,
      keepPreviousData: true,
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}

export const useGetClientBillingAddress = (clientId: number) => {
  return useQuery(
    ['get/client/billingAddress', clientId],
    () => {
      return getClientBillingAddress(clientId)
    },
    {
      suspense: true,
      useErrorBoundary: true,
      staleTime: 60 * 1000,
      keepPreviousData: true,
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}

export const useGetClientPaymentFile = (clientId: number) => {
  return useQuery(
    ['get/client/payment/file', clientId],
    () => {
      return getClientPaymentFile(clientId)
    },
    {
      suspense: true,
      useErrorBoundary: true,
      staleTime: 60 * 1000,
      keepPreviousData: true,
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}
