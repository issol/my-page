import { getInvoiceStatusList } from '@src/apis/invoice/common.api'
import { useQuery } from 'react-query'

export const useGetInvoiceStatus = () => {
  return useQuery(['invoice/status'], () => getInvoiceStatusList(), {
    staleTime: 60 * 1000, // 1

    suspense: false,
    keepPreviousData: true,
  })
}
