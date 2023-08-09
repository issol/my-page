import { StatusType, getStatusList } from '@src/apis/common.api'
import { useQuery } from 'react-query'

export const useGetStatusList = (type: StatusType) => {
  return useQuery(
    [`${type}-status-list`],
    () => {
      return getStatusList(type)
    },
    {
      suspense: true,
      staleTime: 60 * 10000, //status는 자주 업데이트 되는 정보가 아니므로 staleTime을 늘려둠.
      keepPreviousData: true,
    },
  )
}
