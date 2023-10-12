import axios from 'src/configs/axios'
import {
  ClientPaymentFormType,
  ClientPaymentInfoDetail,
  OfficeType,
} from '@src/types/payment-info/client/index.type'
import { FileItemType } from '@src/@core/components/swiper/file-swiper-s3'
import { ClientAddressType } from '@src/types/schema/client-address.schema'

export const getClientPaymentInfoRequest = async (
  id: number,
  isManagerRequest: boolean,
) => {
  if (!isManagerRequest) {
    return getClientPaymentInfoWithMasking(id)
  } else {
    return getClientPaymentInfo(id)
  }
}

export const getClientBillingAddressRequest = async (
  id: number,
  isManagerRequest: boolean,
) => {
  if (!isManagerRequest) {
    return getClientBillingAddressWithMasking(id)
  } else {
    return getClientBillingAddress(id)
  }
}

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

export const getClientPaymentInfoWithMasking = async (
  clientId: number,
): Promise<ClientPaymentInfoDetail | null> => {
  const { data } = await axios.get(
    `/api/enough/u/client/payment-info/masking?clientId=${clientId}`,
  )
  return data
}

export const getClientPaymentInfo = async (
  clientId: number,
): Promise<ClientPaymentInfoDetail | null> => {
  const { data } = await axios.get(
    `/api/enough/u/client/${clientId}/payment-info`,
  )
  return data
}

export const createClientPaymentInfo = async (
  form: ClientPaymentFormType,
): Promise<void> => {
  const { data } = await axios.put(`/api/enough/u/client/payment-info`, form)
  return data
}

export const deleteClientPaymentInfo = async (
  paymentId: number,
): Promise<void> => {
  const { data } = await axios.delete(
    `/api/enough/u/client/payment-info/${paymentId}`,
  )
  return data
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

export const getClientBillingAddressWithMasking = async (
  clientId: number,
): Promise<ClientAddressType | undefined> => {
  const { data } = await axios.get(
    `/api/enough/u/client/${clientId}/address/masking`,
  )
  return data
}

export const getClientPaymentFile = async (
  clientId: number,
): Promise<Array<FileItemType>> => {
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
}

export const uploadClientPaymentFile = async (
  clientId: number,
  file: FormData,
): Promise<void> => {
  const { data } = await axios.post(
    `/api/enough/u/client/payment-info/upload-file?clientId=${clientId}`,
    file,
  )
  return data
}

export const deleteClientPaymentFile = async (
  clientId: number,
  fileId: number,
): Promise<void> => {
  const { data } = await axios.delete(
    `/api/enough/u/client/payment-info/delete-file/${fileId}?clientId=${clientId}`,
  )
  return data
}

export const getClientPaymentFileFromServer = async (
  fileId: number,
): Promise<any> => {
  const { data } = await axios.get(
    `/api/enough/u/client/payment-info/file/${fileId}`,
    { responseType: 'blob' },
  )
  return data
}
