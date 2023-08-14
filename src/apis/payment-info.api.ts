import { FileItemType } from '@src/@core/components/swiper/file-swiper-s3'
import axios from '@src/configs/axios'
import { downloadBase64File } from '@src/shared/helpers/base64-downloader.helper'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import {
  BankInfo,
  BillingMethodUnionType,
  CorrespondentBankInfo,
  ProPaymentType,
} from '@src/types/payment-info/pro/billing-method.type'
import { TaxInfoType } from '@src/types/payment-info/pro/tax-info.type'
import { ClientAddressType } from '@src/types/schema/client-address.schema'

export type TaxResidentInfoType =
  | 'Korea resident'
  | 'Japan resident'
  | 'US resident'
  | 'Singapore resident'
  | 'Korea resident (Sole proprietorship)'

export type PositionType =
  | 'businessLicense'
  | 'copyOfId'
  | 'copyOfRrCard'
  | 'copyOfBankStatement'
  | 'additional'

export type UserInfo = {
  userId: number | null
  identificationNumber?: string //social security number
  identificationUploaded?: boolean //주민등록증
  businessLicenseUploaded?: boolean
}
export type ProPaymentInfoType = {
  decryptPaymentInfo: {
    billingMethod: BillingMethodUnionType
    bankInfo: {
      email?: string
      bankName: string
      accountNumber: string
      routingNumber: string
      swiftCode: string
      iban: string
    }
    correspondentBankInfo: CorrespondentBankInfo
  }
  billingAddress: ClientAddressType
  files: Array<FileItemType & { positionType: PositionType; proId: number }>
  taxCode: number
}

export const getPaymentInfoRequest = async (
  id: number,
  isManagerRequest: boolean,
) => {
  if (!isManagerRequest) {
    return getUserPaymentInfoWithMasking(id)
  } else {
    return getUserPaymentInfo(id)
  }
}

// ** Pro의 payment info를 조회할 때 중요 정보는 마스킹처리되어서 보여짐
export const getUserPaymentInfoWithMasking = async (
  id: number,
): Promise<ProPaymentInfoType | null> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/pro/${id}/payment/all/masking`,
    )
    if (data) {
      return {
        ...data,
        files: data.files.map((i: any) => ({
          id: i.id,
          url: '',
          filePath: '',
          fileName: i.name,
          fileExtension: i.type,
          fileSize: i.size,
          proId: i.proId,
          positionType: i.positionType,
        })),
      }
    }
    return data
  } catch (e: any) {
    return null
  }
}

// ** Pro의 payment info를 조회할 때 중요가 모두 표기됨. (마스킹x)
// ** Pro가 본인의 payment info를 조회할때, Accounting 팀이 pro의 디테일 정보를 볼 때 요청함.
// ** 해당 api요청 시 조회한 사용자의 데이터가 기록됨
export const getUserPaymentInfo = async (
  id: number,
): Promise<ProPaymentInfoType | null> => {
  try {
    const data = await axios.get(`/api/enough/u/pro/${id}/payment/all`)
    return data.data
  } catch (e: any) {
    return null
  }
}

export type ProPaymentFormType = {
  billingMethod: BillingMethodUnionType
  bankInfo: BankInfo
  correspondentBankInfo?: CorrespondentBankInfo | null
}

export const getTaxCodeList = async (): Promise<
  {
    id: number
    statusCode: number
    info: TaxResidentInfoType
    rate: string
    isDefault: true
  }[]
> => {
  try {
    const { data } = await axios.get(`/api/enough/u/tir/list`)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const updateProBillingMethod = async (
  info: ProPaymentFormType,
): Promise<void> => {
  try {
    await axios.put(`/api/enough/u/pro/payment`, info)
  } catch (e: any) {
    throw new Error(e)
  }
}

export const uploadProPaymentFile = async (
  positionType: PositionType,
  file: File,
): Promise<void> => {
  try {
    await axios.post(
      `/api/enough/u/pro/payment/upload-file?positionType=${positionType}`,
      file,
    )
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getProPaymentFile = async (fileId: number): Promise<any> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/pro/payment/file/${fileId}`,
      { responseType: 'blob' },
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const deleteProPaymentFile = async (fileId: number): Promise<void> => {
  try {
    await axios.delete(`/api/enough/u/pro/payment/delete-file/${fileId}`)
  } catch (e: any) {
    throw new Error(e)
  }
}

export const updateProBillingAddress = async (
  info: ClientAddressType,
): Promise<void> => {
  try {
    await axios.put(`/api/enough/u/pro/payment/address`, info)
  } catch (e: any) {
    throw new Error(e)
  }
}

export const updateProTaxInfo = async (
  proId: number,
  statusCode: number,
): Promise<void> => {
  try {
    await axios.post(`/api/enough/u/pro/${proId}/payment/tax`, {
      taxCode: statusCode,
    })
  } catch (e: any) {
    throw new Error(e)
  }
}

export type FileNameType = 'identification' | 'businessLicense'
export const downloadPersonalInfoFile = async (
  userId: number,
  file: FileNameType,
): Promise<void> => {
  try {
    const response = await axios.post(
      `/api/enough/u/pro/${userId}/payment/download-file/${file}`,
    )
    const mime = response?.headers['content-type']
    if (mime) {
      downloadBase64File(response.data, mime, file)
    } else {
      throw new Error()
    }
  } catch (e: any) {
    throw new Error(e)
  }
}
