import axios from 'src/configs/axios'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import { UserDataType } from '@src/context/types'
import {
  ClientFormType,
  LanguagePairsType,
  ProjectTeamFormType,
} from '@src/types/common/orders-and-quotes.type'
import {
  QuotesListType,
  QuotesProjectInfoFormType,
} from '@src/types/common/quotes.type'
import { PostItemType } from '@src/types/common/item.type'
import { QuotesFilterType } from '@src/types/quotes/quote'

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
export const getQuotesList = async (
  filter: QuotesFilterType,
): Promise<{ data: Array<QuotesListType>; totalCount: number }> => {
  try {
    const { data } = await axios.get(`/api/enough/u/quote?${makeQuery(filter)}`)
    return data
  } catch (e: any) {
    return {
      data: [],
      totalCount: 0,
    }
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
  quoteId: number,
  form: Array<LanguagePairsType>,
): Promise<any> => {
  try {
    const { data } = await axios.post(
      `/api/enough/u/quote/language/pair?quoteId=${quoteId}`,
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
