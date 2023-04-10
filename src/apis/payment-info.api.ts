import axios from '@src/configs/axios'
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
    // return {
    //   userInfo: {
    //     userId: 1,
    //     identificationNumber: '123-******', //social security number
    //     identificationFile: '123-******', //주민등록증
    //     businessLicense: '123-******',
    //   },
    //   type: 'Transfer wise', //Transfer wise | US ACH | Korea domestic transfer |International Wire | PayPal
    //   bankInfo: {
    //     accountName: 'ABA',
    //     email: 'bon@glozinc.com',
    //     accountNumber: '123-******',
    //     routingNumber: '123-******',
    //     swiftCode: '123123',
    //     ibnNumber: '123-******',
    //   },
    //   correspondentBankInfo: {
    //     accountNumber: '123-******',
    //     bankIdentifierCode: '123-******', //SWIFT, BIC
    //     others: '123-******',
    //   },

    //   billingAddress: {
    //     city: 'Seoul',
    //     state: 'Seoul',
    //     country: 'Korea',
    //     zip: 303030,
    //   },
    // }
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
    }
  }
}

export const getUserPaymentInfoForManager = async (
  id: number,
): Promise<UserPaymentInfoType> => {
  try {
    const data = await axios.get(`/api/enough/u/pro/${id}/payment/detail`)
    return data.data
    // return {
    //   userInfo: {
    //     userId: 1,
    //     identificationNumber: '123-123123123', //social security number
    //     identificationFile: '123-123123123', //주민등록증
    //     businessLicense: '123-123123123',
    //   },
    //   type: 'Transfer wise', //Transfer wise | US ACH | Korea domestic transfer |International Wire | PayPal
    //   bankInfo: {
    //     accountName: 'ABA',
    //     email: 'bon@glozinc.com',
    //     accountNumber: '123-123123123',
    //     routingNumber: '123-123123123',
    //     swiftCode: '123123',
    //     ibnNumber: '123-123123123',
    //   },
    //   correspondentBankInfo: {
    //     accountNumber: '123-123123123',
    //     bankIdentifierCode: '123-123123123', //SWIFT, BIC
    //     others: '123-123123123',
    //   },

    //   billingAddress: {
    //     city: 'Seoul',
    //     state: 'Seoul',
    //     country: 'Korea',
    //     zip: 303030,
    //   },
    // }
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
    }
  }
}

export type FileNameType = 'identification' | 'businessLicense'
export const downloadPersonalInfoFile = async (
  userId: number,
  file: FileNameType,
): Promise<Blob> => {
  try {
    const { data } = await axios.post(
      `/api/enough/u/pro/${userId}/payment/download-file/${file}`,
      {
        responseType: 'blob',
      },
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}
