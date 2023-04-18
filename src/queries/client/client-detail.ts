import { getClientDetail } from '@src/apis/client.api'
import { ClientDetailType } from '@src/types/client/client'
import { useQuery } from 'react-query'

export const useGetClientDetail = (id: number) => {
  return useQuery(
    `client-detail-${id}`,
    () => {
      return getClientDetail(id)
    },
    {
      staleTime: 60 * 1000, // 1

      suspense: true,

      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}
