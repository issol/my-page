import axios from 'src/configs/axios'
import {
  ClientPaymentFormType,
  ClientPaymentInfoDetail,
  OfficeType,
} from '@src/types/payment-info/client/index.type'
import { FileItemType } from '@src/@core/components/swiper/file-swiper-s3'
import { ClientAddressType } from '@src/types/schema/client-address.schema'

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

export const getClientBillingAddress = async (
  clientId: number,
): Promise<ClientAddressType | undefined> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/client/${clientId}/address?type=billing`,
    )
    return data
  } catch (e: any) {
    return undefined
  }
}

export const getClientPaymentFile = async (
  clientId: number,
): Promise<Array<FileItemType>> => {
  try {
    const {
      data,
    }: {
      data: Array<{
        id: number
        name: string
        type: string
        size: string
        file: {
          type: string
          data: []
        }
        clientId: number
      }>
    } = await axios.get(
      `/api/enough/u/client/payment-info/file?clientId=${clientId}`,
    )

    return (
      data?.map(i => ({
        ...i,
        id: i.id,
        url: '',
        filePath: '',
        fileName: i.name,
        fileExtension: i.type,
        fileSize: Number(i.size),
      })) || []
    )
  } catch (e: any) {
    throw new Error(e)
  }
}

export const uploadClientPaymentFile = async (
  clientId: number,
  file: File,
): Promise<void> => {
  try {
    const { data } = await axios.post(
      `/api/enough/u/client/payment-info/upload-file?clientId=${clientId}`,
      file,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const deleteClientPaymentFile = async (
  clientId: number,
  fileId: number,
): Promise<void> => {
  try {
    const { data } = await axios.delete(
      `/api/enough/u/client/payment-info/delete-file/${fileId}?clientId=${clientId}`,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getClientPaymentFileFromServer = async (
  fileId: number,
): Promise<any> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/client/payment-info/file/${fileId}`,
      { responseType: 'blob' },
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}
