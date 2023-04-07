import {
  getRecruitingList,
  getRecruitingCount,
  getRecruitingDetail,
} from './../apis/recruiting.api'
import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'
import { FilterType } from 'src/pages/recruiting'

export const useGetRecruitingCount = () => {
  return useQuery(
    'get-recruiting/count',
    () => {
      return getRecruitingCount()
    },
    {
      suspense: true,
    },
  )
}
export const useGetRecruitingList = (filter: FilterType) => {
  return useQuery(
    ['get-recruiting/list', filter],
    () => {
      return getRecruitingList(filter)
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

export const useGetRecruitingDetail = (id: number, enabled: boolean) => {
  return useQuery(
    'get-recruiting/detail',
    () => {
      return getRecruitingDetail(id)
    },
    {
      suspense: true,
      useErrorBoundary: false,
      enabled: enabled,
    },
  )
}
