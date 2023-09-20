import { StatusType, getStatusList } from '@src/apis/common.api'
import { getClientUserInfo } from '@src/apis/user.api'
import { useQuery } from 'react-query'

export const useGetStatusList = (type: StatusType) => {
  return useQuery(
    [`${type}-status-list`],
    () => {
      return getStatusList(type)
    },
    {
      suspense: true,
      staleTime: 60 * 30000, //status는 자주 업데이트 되는 정보가 아니므로 staleTime을 늘려둠.
      keepPreviousData: true,
    },
  )
}

export const useGetClientUserInfo = () => {
  return useQuery(
    [`clientUserInfo`],
    () => {
      return getClientUserInfo()
    },
    {
      enabled: false,
      suspense: true,
      staleTime: 60 * 10000,
      keepPreviousData: true,
    },
  )
}
