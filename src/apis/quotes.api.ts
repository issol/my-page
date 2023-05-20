import axios from 'src/configs/axios'
import logger from '@src/@core/utils/logger'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import { UserDataType } from '@src/context/types'
import {
  ClientFormType,
  LanguagePairsType,
  ProjectTeamFormType,
} from '@src/types/common/orders-and-quotes.type'
import { QuotesProjectInfoFormType } from '@src/types/common/quotes.type'
import { PostItemType } from '@src/types/common/item.type'

export type MemberListType = Pick<
  UserDataType,
  'userId' | 'firstName' | 'middleName' | 'lastName' | 'email' | 'jobTitle'
>
export const getMemberList = async (): Promise<Array<MemberListType>> => {
  try {
    const { data } = await axios.get(`/api/enough/a/role/us`)
    return data
  } catch (e: any) {
    return []
  }
}

export type CreateQuotesFormType = ProjectTeamFormType &
  ClientFormType &
  QuotesProjectInfoFormType

// ** step 1-3
export const createQuotesInfo = async (
  form: CreateQuotesFormType,
): Promise<any> => {
  try {
    const { data } = await axios.post(`/api/enough/u/quote`, form)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

// ** step 4-1
export const createLangPairForQuotes = async (
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
export const createItemsForQuotes = async (
  orderId: number,
  form: Array<PostItemType>,
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
