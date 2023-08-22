import { getClientNotes } from '@src/apis/client.api'
import {
  getClientBillingAddress,
  getClientBillingAddressRequest,
  getClientOfficeList,
  getClientPaymentFile,
  getClientPaymentInfo,
  getClientPaymentInfoRequest,
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

export const useGetClientPaymentInfo = (
  clientId: number,
  isAccountManager: boolean,
) => {
  return useQuery(
    ['get/client/payment', clientId],
    () => {
      return getClientPaymentInfoRequest(clientId, isAccountManager)
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

export const useGetClientBillingAddress = (
  clientId: number,
  isAccountManager: boolean,
) => {
  return useQuery(
    ['get/client/billingAddress', clientId],
    () => {
      return getClientBillingAddressRequest(clientId, isAccountManager)
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

export const useGetClientNotes = (clientId: number) => {
  return useQuery(
    [`clientPaymentInfo`, { type: 'notes' }, clientId],
    () => {
      return getClientNotes(clientId)
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
