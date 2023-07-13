import { getNotificationList } from '@src/apis/notification.api'
import { NotificationCenterFilterType } from '@src/types/my-page/notification-center/notification.type'
import { useQuery } from 'react-query'

export const useGetNotificationList = (
  pageParam: number,
  filter: NotificationCenterFilterType,
) => {
  return useQuery(
    ['notificationList'],
    () => getNotificationList(pageParam, filter),
    {
      staleTime: 60 * 1000, // 1
      suspense: true,
      keepPreviousData: true,
    },
  )
}
