import { StatusType, getStatusList } from '@src/apis/common.api'
import { useQuery } from 'react-query'

export const useGetStatusList = (type: StatusType) => {
  return useQuery(
    `${type}-status-list`,
    () => {
      return getStatusList(type)
    },
    {
      suspense: true,
      staleTime: 60 * 1000,
      keepPreviousData: true,
    },
  )
}
