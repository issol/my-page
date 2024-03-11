import {
  StatusType,
  getServiceType,
  getSimpleClientList,
  getStatusList,
} from '@src/apis/common.api'
import { getClientUserInfo } from '@src/apis/user.api'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetStatusList = (
  type: StatusType,
  isSelectable?: '1' | '0',
) => {
  return useQuery(
    [`${type}-status-list`, isSelectable],
    () => {
      return getStatusList(isSelectable ? type : type, isSelectable)
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

export const useGetServiceType = () => {
  return useQuery([`serviceType`], () => {
    return getServiceType()
  })
}

export const useGetSimpleClientList = () => {
  return useQuery(
    ['clientList'],
    () => {
      return getSimpleClientList()
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
