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

// export const getMemoQAnalysisData = async (
//   fileName: string | undefined,
//   userId: number | undefined,
// ): Promise<MemoQType> => {
//   try {
//     // const { data } = await axios.get(
//     //   `/api/enough/csv/parse/memoq?user=${userId}&fileName=${fileName}`,
//     // )
//     // return data
//     return {
//       id: 1,
//       toolName: 'Memoq',
//       calculationBasis: ['Words'],
//       targetLanguage: 'en',
//       data: [
//         {
//           File: '[eng] \\\\Mac\\Home\\Documents\\Tappytoon\\1. 버림받은 황비 180\\1권_026.docx',
//           'Chars/Word': '3.08',
//           'X-translated': {
//             Words: '5',
//             Characters: '5',
//             Percent: '12',
//           },
//           '101%': {
//             Words: '5',
//             Characters: '5',
//             Percent: '12',
//           },
//           Repetitions: {
//             Words: '5',
//             Characters: '5',
//             Percent: '12',
//           },
//           '100%': {
//             Words: '5',
//             Characters: '5',
//             Percent: '12',
//           },
//           '95% - 99%': {
//             Words: '5',
//             Characters: '5',
//             Percent: '12',
//           },
//           '85% - 94%': {
//             Words: '5',
//             Characters: '5',
//             Percent: '12',
//           },
//           '75% - 84%': {
//             Words: '5',
//             Characters: '5',
//             Percent: '12',
//           },
//           '50% - 74%': {
//             Words: '5',
//             Characters: '5',
//             Percent: '12',
//           },
//           'No Match': {
//             Words: '5',
//             Characters: '5',
//             Percent: '12',
//           },
//           Fragments: {
//             Words: '5',
//             Characters: '5',
//             Percent: '12',
//           },
//           Total: {
//             Words: '5',
//             Characters: '5',
//             Percent: '12',
//           },
//         },
//       ],
//     }
//   } catch (e: any) {
//     return {
//       id: -0,
//       toolName: 'Memoq',
//       calculationBasis: ['Words'],
//       targetLanguage: null,
//       data: [],
//     }
//   }
// }

// export const getMemsourceAnalysisData = async (
//   fileName: string | undefined,
//   userId: number | undefined,
// ): Promise<MemSourceType> => {
//   try {
//     // const { data } = await axios.get(
//     //   `/api/enough/csv/parse/memsource?user=${userId}&fileName=${fileName}`,
//     // )
//     // return data
//     return {
//       id: 1,
//       toolName: 'Memesource',
//       calculationBasis: ['Words'],
//       targetLanguage: 'ko',
//       data: [
//         {
//           File: '외전 14화.docx | ko_kr>en_us',
//           'Tagging Errors': '5',
//           'Chars/Word': '3.06',
//           'Context Match': {
//             Words: '5',
//             Percent: '5',
//           },
//           Repetitions: {
//             Words: '5',
//             Percent: '5',
//           },
//           '100%': {
//             Words: '5',
//             Percent: '5',
//           },
//           '95% - 99%': {
//             Words: '5',
//             Percent: '5',
//           },
//           '85% - 94%': {
//             Words: '5',
//             Percent: '5',
//           },
//           '75% - 84%': {
//             Words: '5',
//             Percent: '5',
//           },
//           '50% - 74%': {
//             Words: '5',
//             Percent: '5',
//           },
//           'No Match': {
//             Words: '5',
//             Percent: '5',
//           },
//           Total: {
//             Words: '5',
//             Percent: '5',
//           },
//         },
//         {
//           File: '외전 33화.docx | ko_kr>en_us',
//           'Tagging Errors': '5',
//           'Chars/Word': '3.06',
//           'Context Match': {
//             Words: '5',
//             Percent: '5',
//           },
//           Repetitions: {
//             Words: '5',
//             Percent: '5',
//           },
//           '100%': {
//             Words: '5',
//             Percent: '5',
//           },
//           '95% - 99%': {
//             Words: '5',
//             Percent: '5',
//           },
//           '85% - 94%': {
//             Words: '5',
//             Percent: '5',
//           },
//           '75% - 84%': {
//             Words: '5',
//             Percent: '5',
//           },
//           '50% - 74%': {
//             Words: '5',
//             Percent: '5',
//           },
//           'No Match': {
//             Words: '5',
//             Percent: '5',
//           },
//           Total: {
//             Words: '5',
//             Percent: '5',
//           },
//         },
//       ],
//     }
//   } catch (e: any) {
//     return {
//       id: -0,
//       toolName: 'Memesource',
//       calculationBasis: ['Character'],
//       targetLanguage: null,
//       data: [],
//     }
//   }
// }
