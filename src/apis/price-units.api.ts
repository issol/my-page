import axios from 'src/configs/axios'
import logger from '@src/@core/utils/logger'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import {
  PriceUnitListType,
  PriceUnitDataType,
  PriceUnitType,
  PriceUnitFormType,
} from '@src/types/common/standard-price'

export type FilterType = {
  skip: number
  take: number
}
export const getPriceUnitList = async (
  filters: FilterType,
): Promise<PriceUnitDataType> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/price/unit/al?${makeQuery(filters)}`,
    )
    return data
  } catch (e: any) {
    return {
      data: [],
      count: 0,
      totalCount: 0,
    }
  }
}

export const getAllClientPriceUnitList = async (): Promise<
  Array<PriceUnitListType>
> => {
  try {
    const { data } = await axios.get(`/api/enough/u/price/unit/al/combo`)
    return data
  } catch (e: any) {
    return []
  }
}

export const postPriceUnit = async (
  form: PriceUnitFormType,
): Promise<PriceUnitDataType> => {
  const { data } = await axios.post(`/api/enough/u/price/unit`, { ...form })
  return data
}

export const updatePriceUnit = async (
  id: number,
  form: PriceUnitFormType,
): Promise<any> => {
  return await axios.patch(`/api/enough/u/price/unit/${id}`, { ...form })
}

export const deletePriceUnit = async (id: number): Promise<any> => {
  return await axios.delete(`/api/enough/u/price/unit/${id}`)
}
