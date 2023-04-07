import axios from 'src/configs/axios'
import logger from '@src/@core/utils/logger'
import { makeQuery } from '@src/shared/transformer/query.transformer'

export type PriceUnitDataType = {
  data: Array<PriceUnitType>
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
  subPriceUnits: Array<{
    id: number
    // isBase: boolean //subPrice에 isBasePrice값은 넣을지 말지 고민해보기
    title: string
    unit: string
    weighting: number
    isActive: boolean
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
      totalCount: 0,
    }
  }
}

export type PriceUnitFormType = {
  title?: string
  unit?: string
  weighting?: 100
  isBase?: true
  isActive?: true
  subPriceUnits?: Array<{
    title?: string
    unit?: string
    weighting?: 90
    isActive?: true
  }>
}
export const postPriceUnit = async (
  form: PriceUnitFormType,
): Promise<PriceUnitDataType> => {
  try {
    const { data } = await axios.post(`/api/enough/u/price/unit`, { form })
    return data
  } catch (e: any) {
    return {
      data: [],
      totalCount: 0,
    }
  }
}

export const updatePriceUnit = async (
  userId: number,
  form: PriceUnitFormType,
): Promise<any> => {
  try {
    return await axios.patch(`/api/enough/u/price/unit/${userId}`, { form })
  } catch (e: any) {
    throw new Error(e)
  }
}

export const deletePriceUnit = async (userId: number): Promise<any> => {
  try {
    return await axios.delete(`/api/enough/u/price/unit/${userId}`)
  } catch (e: any) {
    throw new Error(e)
  }
}
