import { getNotificationList } from '@src/apis/notification.api'
import { useQuery } from 'react-query'

export const useGetNotificationList = (allList: boolean) => {
  return useQuery(['notificationList'], () => getNotificationList(allList), {
    staleTime: 60 * 1000, // 1
    suspense: true,
    keepPreviousData: true,
  })
}
