import logger from '@src/@core/utils/logger'

import {
  FilterType,
  getProProjectList,
  getProjectCalendarData,
  getWorkNameFilterList,
} from '@src/apis/pro/pro-projects.api'
import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetWorkNameList = (id: number) => {
  return useQuery(
    'get-project/workname',
    () => {
      return getWorkNameFilterList(id)
    },
    {
      suspense: true,
    },
  )
}

export const useGetProjectList = (id: number, filter: FilterType) => {
  return useQuery(
    ['get-project/list', filter],
    () => {
      return getProProjectList(id, filter)
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

export const useGetProjectCalendarData = (id: number, date: string) => {
  return useQuery(
    ['get-project-calendar', id, date],
    () => {
      return getProjectCalendarData(id, date)
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
