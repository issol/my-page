import axios from '@src/configs/axios'
import { updateOrderType } from '@src/pages/orders/order-list/detail/[id]'
import { Row } from '@src/pages/orders/order-list/detail/components/rows'
import {
  ItemResType,
  ProjectTeamFormType,
} from '@src/types/common/orders-and-quotes.type'
import { OrderProjectInfoFormType } from '@src/types/common/orders.type'
import {
  ClientType,
  LanguageAndItemType,
  ProjectInfoType,
  ProjectTeamListType,
  VersionHistoryType,
} from '@src/types/orders/order-detail'
import { ClientFormType } from '@src/types/schema/client.schema'

export const getProjectInfo = async (id: number): Promise<ProjectInfoType> => {
  try {
    const { data } = await axios.get(`/api/enough/u/order/${id}/project`)

    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getProjectTeam = async (
  id: number,
): Promise<ProjectTeamListType[]> => {
  try {
    const { data } = await axios.get(`/api/enough/u/order/${id}/team`)
    return data.members
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getClient = async (id: number): Promise<ClientType> => {
  const { data } = await axios.get(`/api/enough/u/order/${id}/client`)

  return data
}

export const getLangItems = async (
  id: number,
): Promise<LanguageAndItemType> => {
  try {
    const { data } = await axios.get(`/api/enough/u/order/${id}/items`)
    return {
      ...data,
      items: data.items.map((item: ItemResType) => ({
        ...item,
        name: item?.itemName,
        source: item?.sourceLanguage,
        target: item?.targetLanguage,
        totalPrice: item.totalPrice ? Number(item.totalPrice) : 0,
      })),
    }
  } catch (e: any) {
    throw new Error(e)
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
  await axios.patch(`/api/enough/u/order/${id}`, { ...form })
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

export const confirmDelivery = async (id: number, feedback?: string) => {
  await axios.patch(`/api/enough/u/order/${id}/confirm`, { feedback: feedback })
}
