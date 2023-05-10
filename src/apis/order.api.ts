import axios from '@src/configs/axios'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import { ItemType } from '@src/types/common/item.type'
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
  OrderProjectInfoFormType

// ** step 1-3
export const createOrderInfo = async (
  form: CreateOrderFormType,
): Promise<CreateOrderInfoRes> => {
  try {
    const { data } = await axios.post(`/api/enough/u/order`, form)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

// ** step 4-1
export const createLangPairForOrder = async (
  orderId: number,
  form: Array<LanguagePairsType>,
): Promise<any> => {
  try {
    const { data } = await axios.post(
      `/api/enough/u/order/language-pair?orderId=${orderId}`,
      { data: form },
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

// ** step 4-2
export const createItemsForOrder = async (
  orderId: number,
  form: Array<ItemType>,
): Promise<any> => {
  try {
    const { data } = await axios.post(
      `/api/enough/u/order/item?orderId=${orderId}`,
      { items: form },
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const postCatToolFile = async (
  form: FormData,
): Promise<MemoQType | MemSourceType> => {
  try {
    const { data } = await axios.post(`/api/enough/u/cat-tool/csv/parse`, form)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const deleteCatToolFile = async (id: number) => {
  try {
    return await axios.delete(`/api/enough/u/cat-tool/TM/${id}`)
  } catch (e: any) {
    throw new Error(e)
  }
}
