import axios from '@src/configs/axios'
import { downloadBase64File } from '@src/shared/helpers/base64-downloader.helper'
import { makeQuery } from '@src/shared/transformer/query.transformer'

export type UserInfo = {
  userId: number | null
  identificationNumber?: string //social security number
  identificationUploaded?: boolean //주민등록증
  businessLicenseUploaded?: boolean
}
export type UserPaymentInfoType = {
  userInfo: UserInfo
  type:
    | 'Transfer wise'
    | 'US ACH'
    | 'Korea domestic transfer'
    | 'International Wire'
    | 'PayPal'
    | ''
  bankInfo: {
    email?: string
    accountName: string
    accountNumber: string
    routingNumber: string
    swiftCode: string
    ibnNumber: string
  }
  correspondentBankInfo: {
    accountNumber: string
    bankIdentifierCode: string //SWIFT, BIC
    others: string
  }

  billingAddress: {
    street1?: string
    street2?: string
    city: string
    state: string
    country: string
    zip: number
  }

  tax: {
    taxInfo: string
    taxRate: number
  }
}

export const getPaymentInfoRequest = async (
  id: number,
  isManagerRequest: boolean,
) => {
  if (!isManagerRequest) {
    return getUserPaymentInfo(id)
  } else {
    return getUserPaymentInfoForManager(id)
  }
}

export const getUserPaymentInfo = async (
  id: number,
): Promise<UserPaymentInfoType> => {
  try {
    const data = await axios.get(`/api/enough/u/pro/${id}/payment`)
    return data.data
  } catch (e: any) {
    return {
      userInfo: {
        userId: null,
        identificationNumber: '',
        identificationUploaded: false,
        businessLicenseUploaded: false,
      },
      type: '',
      bankInfo: {
        accountName: '',
        email: '',
        accountNumber: '',
        routingNumber: '',
        swiftCode: '',
        ibnNumber: '',
      },
      correspondentBankInfo: {
        accountNumber: '',
        bankIdentifierCode: '',
        others: '',
      },

      billingAddress: {
        city: '',
        state: '',
        country: '',
        zip: 0,
      },
      tax: {
        taxInfo: 'Korea Resident',
        taxRate: 0.03,
      },
    }
  }
}

export const getUserPaymentInfoForManager = async (
  id: number,
): Promise<UserPaymentInfoType> => {
  try {
    const data = await axios.get(`/api/enough/u/pro/${id}/payment/detail`)
    return data.data
  } catch (e: any) {
    return {
      userInfo: {
        userId: null,
        identificationNumber: '',
        identificationUploaded: false,
        businessLicenseUploaded: false,
      },
      type: '',
      bankInfo: {
        accountName: '',
        email: '',
        accountNumber: '',
        routingNumber: '',
        swiftCode: '',
        ibnNumber: '',
      },
      correspondentBankInfo: {
        accountNumber: '',
        bankIdentifierCode: '',
        others: '',
      },

      billingAddress: {
        city: '',
        state: '',
        country: '',
        zip: 0,
      },
      tax: {
        taxInfo: 'Korea Resident',
        taxRate: 0.03,
      },
    }
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
