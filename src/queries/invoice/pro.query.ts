import { getProInvoiceList } from '@src/apis/invoice/pro.api'
import { InvoiceProFilterType } from '@src/types/invoice/pro.type'
import { useQuery } from 'react-query'

export const useGetProInvoiceList = (filter: InvoiceProFilterType) => {
  return useQuery(
    ['invoice/pro/list', filter],
    () => getProInvoiceList(filter),
    {
      staleTime: 60 * 1000, // 1

      suspense: false,
      keepPreviousData: true,
    },
  )
}
