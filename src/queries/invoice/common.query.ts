import {
  getInvoicePayableStatusList,
  getInvoiceStatusList,
} from '@src/apis/invoice/common.api'
import { checkEditable } from '@src/apis/invoice/receivable.api'
import { useQuery } from 'react-query'

export const useGetInvoiceStatus = () => {
  return useQuery(['invoice/status'], () => getInvoiceStatusList(), {
    staleTime: 60 * 1000, // 1

    suspense: false,
    keepPreviousData: true,
  })
}

export const useGetInvoicePayableStatus = () => {
  return useQuery(
    ['invoice/payable/status'],
    () => getInvoicePayableStatusList(),
    {
      staleTime: 60 * 1000, // 1

      suspense: false,
      keepPreviousData: true,
    },
  )
}
export const useCheckInvoiceEditable = (id: number) => {
  return useQuery(['invoice/editable', id], () => checkEditable(id), {
    staleTime: 60 * 1000, // 1
    enabled: !!id,
    suspense: false,
    keepPreviousData: true,
  })
}
