import logger from '@src/@core/utils/logger'
import {
  FilterType,
  getProProjectList,
  getWorkNameFilterList,
} from './../../apis/pro-projects.api'
import { getProjectCalendarData } from '@src/apis/pro-projects.api'
import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetWorkNameList = () => {
  return useQuery(
    'get-project/workname',
    () => {
      return getWorkNameFilterList()
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
    'get-project-calendar',
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
