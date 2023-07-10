import axios from 'src/configs/axios'
import {
  ClientPaymentFormType,
  ClientPaymentInfoDetail,
  OfficeType,
} from '@src/types/payment-info/client/index.type'
import { FileItemType } from '@src/@core/components/swiper/file-swiper'

export const getClientOfficeList = async (
  clientId: number,
): Promise<Array<{ value: OfficeType; label: OfficeType }>> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/client/${clientId}/payment-info/office-list`,
    )
    return data
  } catch (e: any) {
    return []
  }
}

export const getClientPaymentInfo = async (
  clientId: number,
): Promise<Array<ClientPaymentInfoDetail>> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/client/${clientId}/payment-info`,
    )
    return data
  } catch (e: any) {
    return []
  }
}

export const createClientPaymentInfo = async (
  form: ClientPaymentFormType,
): Promise<void> => {
  try {
    const { data } = await axios.put(`/api/enough/u/client/payment-info`, form)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const deleteClientPaymentInfo = async (
  paymentId: number,
): Promise<void> => {
  try {
    const { data } = await axios.delete(
      `/api/enough/u/client/payment-info/${paymentId}`,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

/* TODO: api변경될 여지 있음 */
// export const uploadClientPaymentFile = async (
//   paymentId: number,
//   file: FileItemType,
// ): Promise<void> => {
//   try {
//     const { data } = await axios.post(
//       `/api/enough/u/client/payment-info/${paymentId}/upload-file`,
//       file,
//     )
//     return data
//   } catch (e: any) {
//     throw new Error(e)
//   }
// }
