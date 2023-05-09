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

export const getMemoQAnalysisData = async (
  fileName: string | undefined,
  userId: number | undefined,
): Promise<MemoQType> => {
  try {
    // const { data } = await axios.get(
    //   `/api/enough/csv/parse/memoq?user=${userId}&fileName=${fileName}`,
    // )
    // return data
    return {
      id: 1,
      toolName: 'memoq',
      calculationBasis: ['Words'],
      targetLanguage: 'en',
      data: [
        {
          File: '[eng] \\\\Mac\\Home\\Documents\\Tappytoon\\1. 버림받은 황비 180\\1권_026.docx',
          'Chars/Word': '3.08',
          'X-translated': {
            Words: '0',
            Characters: '0',
            Percent: '12',
          },
          '101%': {
            Words: '0',
            Characters: '0',
            Percent: '12',
          },
          Repetitions: {
            Words: '0',
            Characters: '0',
            Percent: '12',
          },
          '100%': {
            Words: '0',
            Characters: '0',
            Percent: '12',
          },
          '95% - 99%': {
            Words: '0',
            Characters: '0',
            Percent: '12',
          },
          '85% - 94%': {
            Words: '0',
            Characters: '0',
            Percent: '12',
          },
          '75% - 84%': {
            Words: '0',
            Characters: '0',
            Percent: '12',
          },
          '50% - 74%': {
            Words: '0',
            Characters: '0',
            Percent: '12',
          },
          'No Match': {
            Words: '0',
            Characters: '0',
            Percent: '12',
          },
          Fragments: {
            Words: '0',
            Characters: '0',
            Percent: '12',
          },
          Total: {
            Words: '0',
            Characters: '0',
            Percent: '12',
          },
        },
      ],
    }
  } catch (e: any) {
    return {
      id: -0,
      toolName: 'memoq',
      calculationBasis: ['Words'],
      targetLanguage: null,
      data: [],
    }
  }
}

export const getMemsourceAnalysisData = async (
  fileName: string | undefined,
  userId: number | undefined,
): Promise<MemSourceType> => {
  try {
    // const { data } = await axios.get(
    //   `/api/enough/csv/parse/memsource?user=${userId}&fileName=${fileName}`,
    // )
    // return data
    return {
      id: 1,
      toolName: 'memesource',
      calculationBasis: ['Words'],
      targetLanguage: 'ko',
      data: [
        {
          File: '외전 14화.docx | ko_kr>en_us',
          'Tagging Errors': '0',
          'Chars/Word': '3.06',
          'Context Match': {
            Words: '0',
            Percent: '0',
          },
          Repetitions: {
            Words: '0',
            Percent: '0',
          },
          '100%': {
            Words: '0',
            Percent: '0',
          },
          '95% - 99%': {
            Words: '0',
            Percent: '0',
          },
          '85% - 94%': {
            Words: '0',
            Percent: '0',
          },
          '75% - 84%': {
            Words: '0',
            Percent: '0',
          },
          '50% - 74%': {
            Words: '0',
            Percent: '0',
          },
          'No Match': {
            Words: '0',
            Percent: '0',
          },
          Total: {
            Words: '0',
            Percent: '0',
          },
        },
        {
          File: '외전 33화.docx | ko_kr>en_us',
          'Tagging Errors': '0',
          'Chars/Word': '3.06',
          'Context Match': {
            Words: '0',
            Percent: '0',
          },
          Repetitions: {
            Words: '0',
            Percent: '0',
          },
          '100%': {
            Words: '0',
            Percent: '0',
          },
          '95% - 99%': {
            Words: '0',
            Percent: '0',
          },
          '85% - 94%': {
            Words: '0',
            Percent: '0',
          },
          '75% - 84%': {
            Words: '0',
            Percent: '0',
          },
          '50% - 74%': {
            Words: '0',
            Percent: '0',
          },
          'No Match': {
            Words: '0',
            Percent: '0',
          },
          Total: {
            Words: '0',
            Percent: '0',
          },
        },
      ],
    }
  } catch (e: any) {
    return {
      id: -0,
      toolName: 'memesource',
      calculationBasis: ['Character'],
      targetLanguage: null,
      data: [],
    }
  }
}
