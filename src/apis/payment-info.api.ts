import { FileItemType } from '@src/@core/components/swiper/file-swiper'
import axios from '@src/configs/axios'
import { downloadBase64File } from '@src/shared/helpers/base64-downloader.helper'
import { makeQuery } from '@src/shared/transformer/query.transformer'

export type TaxInfoType =
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
    taxInfo: TaxInfoType
    taxRate: number
  }

  files: Array<FileItemType>
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
    // const data = await axios.get(`/api/enough/u/pro/${id}/payment`)
    // return data.data
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
        taxInfo: 'Korea resident',
        taxRate: 0.03,
      },
      files: [
        {
          filePath: '7686/resume/pro-task디테일.png',
          fileName: 'pro-task디테일',
          fileExtension: 'png',
          fileSize: 200,
          url: 'https://enough-upload-dev.gloground.com/7686/resume/pro-task%E1%84%83%E1%85%B5%E1%84%90%E1%85%A6%E1%84%8B%E1%85%B5%E1%86%AF.png?Expires=1687169890&Key-Pair-Id=K3KY6G7GJ7W3IB&Signature=Et3zazpLpZtRRSmn4YBzhuL~Fx2Hwo7SuXaeFUeydpGxVkwHUAM~wZ3-dD7Z09g2syNWNvSNnL2IiVFBGOGV9jifUeScvK3sjkgQw48AKR9UCYKP9L7q3MTkWSSs-a97XNeLFaF~yXH6sZlpJw0y9vOmHJ10cmu~Uq7R9bY91qKd45GhDmdIOirH-cYI~BkjRrqSyy8kXDMhI03Gdyt6NoX4gaXwgZhUAbwA8YGfJiQjyXiHWtrFHM-ROWOTzJFrutIqGrnBbQaTNFORazK~eHKtFbVqumTgUvV~0LovacDbyLHjLvxynC3OZw7tcR4MGcguHdw0xk84ZJCtsbrdfw__',
        },
        {
          url: '',
          filePath: '',
          fileName: 'test2',
          fileSize: 400,
          fileExtension: 'pdf',
        },
        {
          url: '',
          filePath: '',
          fileName: 'test2',
          fileExtension: 'pdf',
        },
        {
          url: '',
          filePath: '',
          fileName: 'test2',
          fileExtension: 'pdf',
        },
        {
          url: '',
          filePath: '',
          fileName: 'test2',
          fileExtension: 'pdf',
        },
        {
          url: '',
          filePath: '',
          fileName: 'test2',
          fileExtension: 'pdf',
        },
      ],
    }
  } catch (e: any) {
    throw new Error(e)
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
        taxInfo: 'Korea resident',
        taxRate: 0.03,
      },
      files: [
        {
          filePath: '7686/resume/pro-task디테일.png',
          fileName: 'pro-task디테일',
          fileExtension: 'png',
          fileSize: 200,
          url: 'https://enough-upload-dev.gloground.com/7686/resume/pro-task%E1%84%83%E1%85%B5%E1%84%90%E1%85%A6%E1%84%8B%E1%85%B5%E1%86%AF.png?Expires=1687169890&Key-Pair-Id=K3KY6G7GJ7W3IB&Signature=Et3zazpLpZtRRSmn4YBzhuL~Fx2Hwo7SuXaeFUeydpGxVkwHUAM~wZ3-dD7Z09g2syNWNvSNnL2IiVFBGOGV9jifUeScvK3sjkgQw48AKR9UCYKP9L7q3MTkWSSs-a97XNeLFaF~yXH6sZlpJw0y9vOmHJ10cmu~Uq7R9bY91qKd45GhDmdIOirH-cYI~BkjRrqSyy8kXDMhI03Gdyt6NoX4gaXwgZhUAbwA8YGfJiQjyXiHWtrFHM-ROWOTzJFrutIqGrnBbQaTNFORazK~eHKtFbVqumTgUvV~0LovacDbyLHjLvxynC3OZw7tcR4MGcguHdw0xk84ZJCtsbrdfw__',
        },
        {
          url: '',
          filePath: '',
          fileName: 'test2',
          fileSize: 400,
          fileExtension: 'pdf',
        },
        {
          url: '',
          filePath: '',
          fileName: 'test2',
          fileExtension: 'pdf',
        },
        {
          url: '',
          filePath: '',
          fileName: 'test2',
          fileExtension: 'pdf',
        },
        {
          url: '',
          filePath: '',
          fileName: 'test2',
          fileExtension: 'pdf',
        },
        {
          url: '',
          filePath: '',
          fileName: 'test2',
          fileExtension: 'pdf',
        },
      ],
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
