import axios from '@src/configs/axios'

export const getStandardClientPrice = async () => {
  // const { data } = await axios.get('/api/company/signup-requests')
  try {
    const { data } = await axios.get('/api/enough/client/prices')

    return data
  } catch (e: any) {
    return []
  }
}
