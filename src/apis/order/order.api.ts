import axios from '@src/configs/axios'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import order from '@src/store/order'
import { ItemType, PostItemType } from '@src/types/common/item.type'
import {
  ClientFormType,
  LanguagePairsType,
  ProjectTeamFormType,
} from '@src/types/common/orders-and-quotes.type'
import {
  CreateOrderInfoRes,
  OrderProjectInfoFormType,
} from '@src/types/common/orders.type'
import { MemSourceType, MemoQType } from '@src/types/common/tm-analysis.type'

export type CreateOrderFormType = ProjectTeamFormType &
  ClientFormType &
  OrderProjectInfoFormType & { requestId?: number }

// ** step 1-3
export const createOrderInfo = async (
  form: CreateOrderFormType,
): Promise<CreateOrderInfoRes> => {
  const { data } = await axios.post(`/api/enough/u/order`, form)
  return data
}

// ** step 4-1
export const createLangPairForOrder = async (
  orderId: number,
  form: Array<LanguagePairsType>,
): Promise<any> => {
  const { data } = await axios.post(
    `/api/enough/u/order/language-pair?orderId=${orderId}`,
    { data: form },
  )
  return data
}

// ** step 4-2
export const createItemsForOrder = async (
  orderId: number,
  form: Array<PostItemType>,
): Promise<any> => {
  const { data } = await axios.post(
    `/api/enough/u/order/item?orderId=${orderId}`,
    { items: form },
  )
  return data
}

export const getCatToolFile = async (
  itemId: number,
  type: 'order' | 'quote',
): Promise<MemoQType[] | MemSourceType[]> => {
  const { data } = await axios.get(
    `/api/enough/u/cat-tool/TM?itemId=${itemId}&type=${type}`,
  )
  return data
}

export const postCatToolFile = async (
  form: FormData,
): Promise<MemoQType | MemSourceType> => {
  const { data } = await axios.post(`/api/enough/u/cat-tool/csv/parse`, form)
  return data
}

export const deleteCatToolFile = async (id: number) => {
  return await axios.delete(`/api/enough/u/cat-tool/TM/${id}`)
}

export const patchLangPairForOrder = async (
  orderId: number,
  form: Array<LanguagePairsType>,
) => {
  const { data } = await axios.put(
    `/api/enough/u/order/language-pair?orderId=${orderId}`,
    { data: form },
  )
  return data
}

export const patchItemsForOrder = async (
  orderId: number,
  form: Array<PostItemType>,
) => {
  const { data } = await axios.patch(
    `/api/enough/u/order/item?orderId=${orderId}`,
    { items: form },
  )
  return data
}

export const checkOrderEditable = async (orderId: number): Promise<boolean> => {
  const { data } = await axios.get(`/api/enough/u/order/${orderId}/editable`)
  return data
}

export const restoreOrder = async (historyId: number) => {
  const { data } = await axios.put(`/api/enough/u/order/restore/${historyId}`)
  return data
}
