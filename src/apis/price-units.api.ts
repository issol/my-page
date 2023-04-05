import axios from 'src/configs/axios'
import { loginResType } from 'src/types/sign/signInTypes'
import { UserRoleType } from 'src/context/types'
import logger from '@src/@core/utils/logger'

export type PriceUnitDataType = {
  data: Array<PriceUnitType>
  totalCount: number
}
export type PriceUnitType = {
  id: number
  isBasePrice: boolean
  priceUnit: string
  unit: string
  weighting: number | null
  isActive: boolean
  subPrice: Array<{
    id: number
    isBasePrice?: boolean //subPrice에 isBasePrice값은 넣을지 말지 고민해보기
    priceUnit: string
    unit: string
    weighting: number
    isActive: boolean
  }>
}
export const login = async (
  email: string,
  password: string,
): Promise<loginResType> => {
  try {
    const { data } = await axios.post(`/api/enough/a/login`, {
      email,
      password,
    })
    return data
  } catch (e: any) {
    throw new Error(e.response.status)
  }
}
