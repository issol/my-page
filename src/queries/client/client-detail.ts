import {
  getClientDetail,
  getClientProjectList,
  getClientProjectsCalendarData,
} from '@src/apis/client.api'
import { ClientDetailType } from '@src/types/client/client'
import {
  ClientProjectFilterType,
  ClientProjectListType,
} from '@src/types/client/client-projects.type'
import toast from 'react-hot-toast'
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

export const useGetClientProjectsCalendar = (id: number, date: string) => {
  return useQuery(
    'get-project-calendar',
    () => {
      return getClientProjectsCalendarData(id, date)
    },
    {
      suspense: true,
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}
