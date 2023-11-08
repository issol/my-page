import { InvoiceMultipleOrderType } from '@src/types/invoice/common.type'
import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export const getInvoiceStatusList = async (): Promise<
  Array<{ id: number; statusName: string }>
> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/invoice-receivable/status/list`,
    )
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

export const getMultipleOrder = async (
  id: number[],
): Promise<InvoiceMultipleOrderType> => {
  const { data } = await axios.get(
    `/api/enough/u/order/target-items?${makeQuery({ order: id })}`,
  )

  return data
}

export const addOrderToInvoice = async (invoiceId: number, id: number[]) => {
  const { data } = await axios.patch(
    `/api/enough/u/invoice/receivable/${invoiceId}/add-order`,
    { order: id },
  )

  return data
}
