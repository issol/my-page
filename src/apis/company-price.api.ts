import axios from '@src/configs/axios'
import { PriceListFilterType } from '@src/queries/company/standard-price'
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

export const getPriceList = async (
  filter: PriceListFilterType,
): Promise<StandardPriceListType[]> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/client-price/preset?${makeQuery(filter)}`,
    )
    return data
  } catch (e: any) {
    return []
  }
}

export const getStandardClientPrice = async () => {
  // const { data } = await axios.get('/api/company/signup-requests')
  try {
    const { data } = await axios.get('/api/enough/u/price/al')
    // /api/enough/u/price/al
    return data
  } catch (e: any) {
    return []
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
): Promise<CreatePriceResType> => {
  const res = await axios.post('/api/enough/u/price', data)
  return res.data
}

export const patchPrice = async (data: AddNewPriceType, id: number) => {
  await axios.patch(`/api/enough/u/price/${id}`, data)
}

export const deletePrice = async (priceId: number) => {
  await axios.delete(`/api/enough/u/price/${priceId}`)
}

export const setPriceUnitPair = async (
  data: SetPriceUnitPair[],
  id: number,
) => {
  await axios.post(`/api/enough/u/price/unit/pair?priceId=${id}`, {
    data: data,
  })
}

export const patchPriceUnitPair = async (
  data: SetPriceUnitPair[],
  id: number,
) => {
  await axios.patch(`/api/enough/u/price/unit/pair?priceId=${id}`, {
    data: data,
  })
}

export const putPriceUnitPair = async (
  data: SetPriceUnitPair[],
  id: number,
) => {
  await axios.put(`/api/enough/u/price/unit/pair?priceId=${id}`, {
    data: data,
  })
}

export const createLanguagePair = async (data: LanguagePairParams[]) => {
  await axios.post('/api/enough/u/language/pair', { data: data })
}

export const patchLanguagePair = async (
  data: LanguagePairParams,
  id: number,
) => {
  await axios.patch(`/api/enough/u/language/pair/${id}`, data)
}

export const deleteLanguagePair = async (id: number) => {
  await axios.delete(`/api/enough/u/language/pair/${id}`)
}

export const createCatInterface = async (
  id: number,
  data: {
    memSource: Array<CatInterfaceParams>
    memoQ: Array<CatInterfaceParams>
  },
) => {
  await axios.post('/api/enough/u/price-cat-pair', {
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
  await axios.patch('/api/enough/u/price-cat-pair', {
    priceId: id,
    data: [
      {
        memSource: data.memSource,
        memoQ: data.memoQ,
      },
    ],
  })
}
