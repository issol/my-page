import axios from '@src/configs/axios'

export const getStandardClientPrice = async () => {
  // const { data } = await axios.get('/api/company/signup-requests')
  try {
    const { data } = await axios.get('/api/enough/client/prices')
    // /api/enough/u/price/al
    return data
  } catch (e: any) {
    return []
  }
}

export const getCatInterface = async (toolName: string) => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/util/cat/interface?toolName=${toolName}`,
    )

    return data
  } catch (e: any) {}
}
