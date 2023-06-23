import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export const getInvoiceStatusList = async (): Promise<
  Array<{ id: number; statusName: string }>
> => {
  try {
    const { data } = await axios.get(`/api/enough/u/invoice/status/list`)
    return data.data
  } catch (e: any) {
    return []
  }
}

export const getInvoicePayableStatusList = async (): Promise<
  Array<{ id: number; statusName: string }>
> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/invoice/payable/status/list`,
    )
    return data.data
  } catch (e: any) {
    return []
  }
}
