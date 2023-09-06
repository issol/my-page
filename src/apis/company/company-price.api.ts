import axios from '@src/configs/axios'
import {
  ClientPriceListFilterType,
  ProPriceListFilterType,
} from '@src/queries/company/standard-price'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import {
  LanguagePairParams,
  AddNewPriceType,
  CreatePriceResType,
  SetPriceUnitPair,
  CatInterfaceType,
  CatInterfaceParams,
  StandardPriceListType,
} from '@src/types/common/standard-price'

export const getClientPriceList = async (
  filter: ClientPriceListFilterType,
): Promise<StandardPriceListType[]> => {
  try {
    const { data } = await axios.get(
      // `/api/enough/u/client-price/preset?${makeQuery(filter)}`,
      `/api/enough/u/client-job-price/preset?${makeQuery(filter)}`,
    )
    return data
  } catch (e: any) {
    return []
  }
}

export const getProPriceList = async (
  filter: ProPriceListFilterType,
): Promise<StandardPriceListType[]> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/pro-price/preset?${makeQuery(filter)}`,
    )
    return data
  } catch (e: any) {
    return []
  }
}

export const getStandardPrice = async (
  page: 'pro' | 'client',
  filter: ClientPriceListFilterType
): Promise<{
  data: Array<StandardPriceListType>
  count: number
}> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/${page}-price/al?${makeQuery(filter)}`,
    )
    // /api/enough/u/price/al
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getCatInterfaceHeaders = async (toolName: string) => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/cat-tool/interface?toolName=${toolName}`,
    )

    return data
  } catch (e: any) {}
}

export const createPrice = async (
  data: AddNewPriceType,
  page: 'pro' | 'client',
): Promise<CreatePriceResType> => {
  const res = await axios.post(`/api/enough/u/${page}-price`, data)
  return res.data
}

export const patchPrice = async (
  data: AddNewPriceType,
  id: number,
  page: 'pro' | 'client',
) => {
  await axios.patch(`/api/enough/u/${page}-price/${id}`, data)
}

export const deletePrice = async (priceId: number, page: 'pro' | 'client') => {
  await axios.delete(`/api/enough/u/${page}-price/${priceId}`)
}

export const setPriceUnitPair = async (
  data: SetPriceUnitPair[],
  id: number,
) => {
  await axios.post(`/api/enough/u/client-price/unit/pair?priceId=${id}`, {
    data: data,
  })
}

export const putPriceUnitPair = async (
  data: SetPriceUnitPair[],
  id: number,
  page: 'pro' | 'client',
) => {
  await axios.put(`/api/enough/u/${page}-price/unit/pair?priceId=${id}`, {
    data: data,
  })
}

export const createLanguagePair = async (
  data: LanguagePairParams[],
  page: 'pro' | 'client',
) => {
  try {
    await axios.post(`/api/enough/u/${page}-price/language/pair`, { data: data })
  } catch ( e: any) {
    if(e.response.data.message === '이미 존재하는 언어페어입니다.') throw 'LanguagePairDuplication'
    else throw new Error(e)
  }
}

export const patchLanguagePair = async (
  data: LanguagePairParams,
  id: number,
  page: 'pro' | 'client',
) => {
  await axios.patch(`/api/enough/u/${page}-price/language/pair/${id}`, data)
}

export const deleteLanguagePair = async (
  id: number,
  page: 'pro' | 'client',
) => {
  await axios.delete(`/api/enough/u/${page}-price/language/pair/${id}`)
}

export const createCatInterface = async (
  id: number,
  data: {
    memSource: Array<CatInterfaceParams>
    memoQ: Array<CatInterfaceParams>
  },
) => {
  await axios.post('/api/enough/u/client-price-cat-pair', {
    priceId: id,
    data: [
      {
        memSource: data.memSource,
        memoQ: data.memoQ,
      },
    ],
  })
}

export const patchCatInterface = async (
  id: number,
  data: {
    memSource: Array<CatInterfaceParams>
    memoQ: Array<CatInterfaceParams>
  },
) => {
  await axios.patch('/api/enough/u/client-price-cat-pair', {
    priceId: id,
    data: [
      {
        memSource: data.memSource,
        memoQ: data.memoQ,
      },
    ],
  })
}
