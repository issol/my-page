import axios from 'src/configs/axios'
import logger from '@src/@core/utils/logger'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import { PriceUnitListType } from '@src/types/common/standard-price'

export type PriceUnitDataType = {
  data: Array<PriceUnitType>
  count: number
  totalCount: number
}
export type PriceUnitType = {
  id: number
  isBase: boolean
  authorId?: number
  title: string
  unit: string
  weighting: number | null
  isActive: boolean
  parentPriceUnitId: number | null
  subPriceUnits: Array<{
    id: number
    isBase: boolean
    title: string
    unit: string
    weighting: number
    isActive: boolean
    parentPriceUnitId: number | null
  }>
}

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

export type PriceUnitFormType = {
  title?: string
  unit?: string
  weighting?: number | null
  isBase?: boolean
  isActive?: boolean
  subPriceUnits?: Array<{
    title?: string
    unit?: string
    weighting?: number | null
    isActive?: boolean
  }>
}
export const postPriceUnit = async (
  form: PriceUnitFormType,
): Promise<PriceUnitDataType> => {
  try {
    const { data } = await axios.post(`/api/enough/u/price/unit`, { ...form })
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const updatePriceUnit = async (
  id: number,
  form: PriceUnitFormType,
): Promise<any> => {
  try {
    return await axios.patch(`/api/enough/u/price/unit/${id}`, { ...form })
  } catch (e: any) {
    throw new Error(e)
  }
}

export const deletePriceUnit = async (id: number): Promise<any> => {
  try {
    return await axios.delete(`/api/enough/u/price/unit/${id}`)
  } catch (e: any) {
    throw new Error(e)
  }
}
