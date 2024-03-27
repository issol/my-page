import { getProList } from '@src/apis/pro/pro-list.api'
import { LinguistTeamProListFilterType } from '@src/types/pro/linguist-team'

import { ProListFilterType, ProListType } from '@src/types/pro/list'
import { useQuery } from 'react-query'

export const useGetProList = (
  filters: ProListFilterType | LinguistTeamProListFilterType,
) => {
  return useQuery<{ data: ProListType[]; totalCount: number }>(
    ['pro-list', filters],
    () => getProList(filters),
    {
      staleTime: 60 * 1000, // 1
      keepPreviousData: true,
      suspense: true,

      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}
