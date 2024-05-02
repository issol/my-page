import {
  getClientList,
  getClientMemo,
  getWorkNameList,
} from '@src/apis/client.api'
import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'
import { FilterType } from 'src/pages/client'

export const useGetClientList = (filter: FilterType | null) => {
  return useQuery(
    ['get-client/list', filter],
    () => {
      return getClientList(filter!)
    },
    {
      suspense: true,
      staleTime: 60 * 1000,
      enabled: !!filter,
      keepPreviousData: true,
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}
export const useGetClientMemo = (
  clientId: number,
  filter: { skip?: number; take: number },
) => {
  return useQuery(
    ['get-client/memo', clientId, filter],
    () => {
      return getClientMemo(clientId, filter)
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

export const useGetWorkNameList = (id: number) => {
  return useQuery(
    ['get-client/workname', id],
    () => {
      return getWorkNameList(id)
    },
    {
      suspense: true,
    },
  )
}
