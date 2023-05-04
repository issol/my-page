import axios from '@src/configs/axios'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import { ItemType } from '@src/types/common/item.type'
import {
  ClientFormType,
  LanguagePairsType,
  ProjectInfoFormType,
} from '@src/types/common/orders-and-quotes.type'
import {
  CreateOrderInfoRes,
  CreateOrderProjectInfoFormType,
} from '@src/types/common/orders.type'
import {
  OrderListFilterType,
  OrderListType,
} from '@src/types/orders/order-list'

export type CreateOrderFormType = CreateOrderProjectInfoFormType &
  ClientFormType &
  ProjectInfoFormType

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
      form,
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
      form,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}
