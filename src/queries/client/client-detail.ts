import { getClientDetail, getClientProjectList } from '@src/apis/client.api'
import { ClientDetailType } from '@src/types/client/client'
import {
  ClientProjectFilterType,
  ClientProjectListType,
} from '@src/types/client/client-projects.type'
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

export const useGetClientProjectList = (filter: ClientProjectFilterType) => {
  return useQuery<{ data: ClientProjectListType[]; totalCount: number }>(
    ['client-projects', filter],
    () => {
      return getClientProjectList(filter)
    },
    {
      staleTime: 60 * 1000, // 1

      suspense: true,

      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}
