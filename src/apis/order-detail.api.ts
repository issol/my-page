import axios from '@src/configs/axios'
import { updateOrderType } from '@src/pages/orders/order-list/detail/[id]'
import { Row } from '@src/pages/orders/order-list/detail/components/rows'
import { ItemResType } from '@src/types/common/orders-and-quotes.type'
import {
  ClientType,
  JobInfoType,
  LanguageAndItemType,
  ProjectInfoType,
  ProjectTeamListType,
  VersionHistoryType,
} from '@src/types/orders/order-detail'

export const getProjectInfo = async (id: number): Promise<ProjectInfoType> => {
  const { data } = await axios.get(`/api/enough/u/order/${id}/project`)

  return data
}

export const getProjectTeam = async (
  id: number,
): Promise<ProjectTeamListType[]> => {
  const { data } = await axios.get(`/api/enough/u/order/${id}/team`)
  return data.members
}

export const getClient = async (id: number): Promise<ClientType> => {
  const { data } = await axios.get(`/api/enough/u/order/${id}/client`)
  return data
}

export const getLangItems = async (
  id: number,
): Promise<LanguageAndItemType> => {
  const { data } = await axios.get(`/api/enough/u/order/${id}/items`)
  return {
    ...data,
    items: data.items.map((item: ItemResType) => ({
      ...item,
      name: item?.itemName,
      itemName: item?.itemName,
      source: item?.sourceLanguage,
      target: item?.targetLanguage,
      totalPrice: item.totalPrice ? Number(item.totalPrice) : 0,
    })),
  }
}

export const deleteOrder = async (id: number): Promise<void> => {
  await axios.delete(`/api/enough/u/order/${id}`)
}

export const getVersionHistory = async (
  id: number,
): Promise<VersionHistoryType[]> => {
  const { data } = await axios.get(`/api/enough/u/order/${id}/history`)
  return data
}

export const patchOrderProjectInfo = async (
  id: number,
  form: updateOrderType,
) => {
  const { data } = await axios.patch(`/api/enough/u/order/${id}`, { ...form })

  return data
}

export const splitOrder = async (
  id: number,
  items: number[],
): Promise<{ orderId: number }> => {
  const { data } = await axios.put(`/api/enough/u/order/${id}/split`, {
    splitItems: items,
  })

  return data
}

export const deliverySendToClient = async (
  id: number,
  deliveries: {
    filePath: string
    fileName: string
    fileExtension: string
    fileSize?: number
  }[],
) => {
  await axios.patch(`/api/enough/u/order/${id}/deliveries/send`, {
    deliveries: deliveries,
  })
}

export const completeDelivery = async (id: number) => {
  await axios.patch(`/api/enough/u/order/${id}/deliveries/complete`)
}

//TODO API 수정 필요
export const confirmDelivery = async (id: number, feedback?: string) => {
  await axios.patch(`/api/enough/u/order/${id}/deliveries/confirm`, {
    feedback: feedback,
  })
}

export const confirmOrder = async (id: number) => {
  await axios.patch(`/api/enough/u/order/${id}/confirm`)
}

export const getJobInfo = async (id: number): Promise<JobInfoType[]> => {
  const { data } = await axios.get(
    `/api/enough/u/job/check-assigned-pro?orderId=${id}`,
  )

  return data
}
