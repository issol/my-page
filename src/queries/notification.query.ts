import { getNotificationList } from '@src/apis/notification.api'
import { useQuery } from 'react-query'

export const useGetNotificationList = () => {
  return useQuery(['notificationList'], () => getNotificationList(), {
    staleTime: 60 * 1000, // 1
    suspense: true,
    keepPreviousData: true,
  })
}
