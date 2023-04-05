import {
  FilterType,
  getProProjectList,
  getWorkNameFilterList,
} from './../../apis/pro-projects.api'
import { getProjectCalendarData } from '@src/apis/pro-projects.api'
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

export const useGetProjectList = (
  id: number,
  filter: FilterType,
  search: boolean,
  setSearch: (v: boolean) => void,
) => {
  return useQuery(
    'get-project/list',
    () => {
      return getProProjectList(id, filter)
    },
    {
      suspense: true,
      enabled: search,
      onSuccess: () => setSearch(false),
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
