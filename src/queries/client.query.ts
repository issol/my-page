import { getClientList } from '@src/apis/client.api'
import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'
import { FilterType } from 'src/pages/client'

export const useGetClientList = (filter: FilterType) => {
  return useQuery(
    ['get-client/list', filter],
    () => {
      return getClientList(filter)
    },
    {
      suspense: true,
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
