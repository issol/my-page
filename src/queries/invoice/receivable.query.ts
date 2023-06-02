import { getReceivableList } from '@src/apis/invoice/receivable.api'
import { InvoiceReceivableFilterType } from '@src/types/invoice/receivable.type'
import { useQuery } from 'react-query'

export const useGetReceivableList = (filter: InvoiceReceivableFilterType) => {
  return useQuery(
    ['invoice/receivable/list', filter],
    () => getReceivableList(filter),
    {
      staleTime: 60 * 1000, // 1

      suspense: false,
      keepPreviousData: true,
    },
  )
}

// export const useGetPayableCalendar = (
//   date: string,
//   filter: InvoicePayableFilterType,
// ) => {
//   return useQuery(
//     ['invoice/payable/calendar', date, filter],
//     () => {
//       return getInvoicePayableCalendarData(date, filter)
//     },
//     {
//       suspense: true,
//       staleTime: 60 * 1000,
//       keepPreviousData: true,
//     },
//   )
// }
