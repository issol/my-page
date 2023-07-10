//https://api-dev.gloground.com/api/fcm
import { NotificationType } from '@src/types/common/notification.type'
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
  allList: boolean,
): Promise<Array<NotificationType>> => {
  try {
    const { data } = await axios.get(`/api/enough/u/notification`)

    return data.data
  } catch (e: any) {
    return []
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
