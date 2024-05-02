import {
  getLinguistTeamDetail,
  getLinguistTeamList,
} from '@src/apis/pro/linguist-team'
import { FilterType } from '@src/pages/pro/linguist-team'
import { useQuery } from 'react-query'

export const useGetLinguistTeam = (filter: FilterType | null) => {
  return useQuery(
    ['linguistTeam', filter],
    () => {
      return getLinguistTeamList(filter!)
    },
    {
      staleTime: 60 * 1000, // 1
      keepPreviousData: true,
      enabled: !!filter,
    },
  )
}

export const useGetLinguistTeamDetail = (id: number) => {
  return useQuery(
    ['linguistTeamDetail', id],
    () => {
      return getLinguistTeamDetail(id)
    },
    {
      enabled: id !== 0,
      staleTime: 60 * 1000, // 1
    },
  )
}
