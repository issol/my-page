//https://api-dev.gloground.com/api/fcm
import { makeQuery } from '@src/shared/transformer/query.transformer'
import { NotificationType } from '@src/types/common/notification.type'
import { NotificationCenterFilterType } from '@src/types/my-page/notification-center/notification.type'
import axios from 'src/configs/axios'

export const notificationTest = async () => {
  const { data } = await axios.post(`/api/fcm`, {
    accessToken:
      'e8Ax1SNzxPrIdkLG1PMjtn:APA91bG7U0ZpURRI-dyb-ts3JBZwLdXT81WZsXZ1WpD1c7TtAsGcml4T2qvwscizjZ6A44bU8g9agYU6tlMovE9G8rJ6mDjG9jxxDqwDjCFID5xNx9KOWGRISzxKgFIQh5UaHeTmfvnv',
    title: 'title',
    body: 'desc',
  })

  return data
}

export const getNotificationList = async (
  filter: NotificationCenterFilterType,
): Promise<{ data: Array<NotificationType>; count: number }> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/notification?${makeQuery(filter)}`,
    )

    return data
  } catch (e: any) {
    return {
      data: [],
      count: 0,
    }
  }
}

export const markAsRead = async (id: number[]) => {
  try {
    await axios.patch(`/api/enough/u/notification`, {
      notificationId: id,
    })
  } catch (e: any) {
    throw new Error(e)
  }
}
