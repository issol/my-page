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
  pageParam: number,
  filter: NotificationCenterFilterType,
): Promise<{
  data: Array<NotificationType>
  page: number
  isLast: boolean
  totalCount: number
}> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/notification/unread?${makeQuery(filter)}`,
    )

    const isLast =
      Math.min(6 * (pageParam + 1), data.totalCount) === data.totalCount

    return { ...data, page: pageParam, isLast: isLast }
  } catch (e: any) {
    return {
      data: [],
      page: 0,
      totalCount: 0,
      isLast: true,
    }
  }
}

export const getNotificationCenterList = async (
  filter: NotificationCenterFilterType,
): Promise<{ data: Array<NotificationType>; totalCount: number }> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/notification?${makeQuery(filter)}`,
    )

    return data
  } catch (e: any) {
    return {
      data: [],
      totalCount: 0,
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

export const markAllAsRead = async () => {
  try {
    await axios.patch(`/api/enough/u/notification/setAllRead`)
  } catch (e: any) {
    throw new Error(e)
  }
}
