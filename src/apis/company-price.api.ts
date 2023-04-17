import axios from '@src/configs/axios'
import {
  AddNewLanguagePairParams,
  AddNewPriceType,
  SetPriceUnitPair,
} from '@src/types/common/standard-price'

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

export const createPrice = async (data: AddNewPriceType) => {
  await axios.post('/api/enough/u/price', data)
}

export const patchPrice = async (data: AddNewPriceType, id: number) => {
  await axios.patch(`/api/enough/u/price/${id}`, data)
}

export const deletePrice = async (priceId: number) => {
  await axios.delete(`/api/enough/u/price/${priceId}`)
}

export const setPriceUnitPair = async (data: SetPriceUnitPair[]) => {
  await axios.post('/api/enough/u/price/unit/pair', { data: data })
}

export const patchPriceUnitPair = async (data: SetPriceUnitPair[]) => {
  await axios.patch('/api/enough/u/price/unit/pair', { data: data })
}

export const createLanguagePair = async (data: AddNewLanguagePairParams[]) => {
  await axios.post('/api/enough/u/language/pair', { data: data })
}
