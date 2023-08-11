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

export type UserInfo = {
  userId: number | null
  identificationNumber?: string //social security number
  identificationUploaded?: boolean //주민등록증
  businessLicenseUploaded?: boolean
}
export type ProPaymentInfoType = {
  // userInfo: UserInfo
  // type: ProPaymentType | null
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
  files: Array<FileItemType>
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
    const data = await axios.get(`/api/enough/u/pro/${id}/payment/all/masking`)
    return data.data
    // return {
    //   userInfo: {
    //     userId: null,
    //     identificationNumber: '',
    //     identificationUploaded: false,
    //     businessLicenseUploaded: false,
    //   },
    //   type: null,
    //   bankInfo: {
    //     bankName: '',
    //     email: '',
    //     accountNumber: '',
    //     routingNumber: '',
    //     swiftCode: '',
    //     iban: '',
    //   },
    //   correspondentBankInfo: {
    //     accountNumber: '',
    //     swiftCode: '',
    //     iban: '',
    //   },

    //   billingAddress: {
    //     city: '',
    //     state: '',
    //     country: '',
    //     zip: 0,
    //   },
    //   tax: {
    //     taxInfo: 'Korea resident',
    //     taxRate: 0.03,
    //   },
    //   files: [
    //     {
    //       filePath: '7686/resume/pro-task디테일.png',
    //       fileName: 'pro-task디테일',
    //       fileExtension: 'png',
    //       fileSize: 200,
    //       url: 'https://enough-upload-dev.gloground.com/7686/resume/pro-task%E1%84%83%E1%85%B5%E1%84%90%E1%85%A6%E1%84%8B%E1%85%B5%E1%86%AF.png?Expires=1687169890&Key-Pair-Id=K3KY6G7GJ7W3IB&Signature=Et3zazpLpZtRRSmn4YBzhuL~Fx2Hwo7SuXaeFUeydpGxVkwHUAM~wZ3-dD7Z09g2syNWNvSNnL2IiVFBGOGV9jifUeScvK3sjkgQw48AKR9UCYKP9L7q3MTkWSSs-a97XNeLFaF~yXH6sZlpJw0y9vOmHJ10cmu~Uq7R9bY91qKd45GhDmdIOirH-cYI~BkjRrqSyy8kXDMhI03Gdyt6NoX4gaXwgZhUAbwA8YGfJiQjyXiHWtrFHM-ROWOTzJFrutIqGrnBbQaTNFORazK~eHKtFbVqumTgUvV~0LovacDbyLHjLvxynC3OZw7tcR4MGcguHdw0xk84ZJCtsbrdfw__',
    //     },
    //     {
    //       url: '',
    //       filePath: '',
    //       fileName: 'test2',
    //       fileSize: 400,
    //       fileExtension: 'pdf',
    //     },
    //     {
    //       url: '',
    //       filePath: '',
    //       fileName: 'test2',
    //       fileExtension: 'pdf',
    //     },
    //     {
    //       url: '',
    //       filePath: '',
    //       fileName: 'test2',
    //       fileExtension: 'pdf',
    //     },
    //     {
    //       url: '',
    //       filePath: '',
    //       fileName: 'test2',
    //       fileExtension: 'pdf',
    //     },
    //     {
    //       url: '',
    //       filePath: '',
    //       fileName: 'test2',
    //       fileExtension: 'pdf',
    //     },
    //   ],
    // }
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
    await axios.post(`/api/enough/u/pro/payment/tax/${proId}`, statusCode)
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
