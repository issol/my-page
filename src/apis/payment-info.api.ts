import axios from '@src/configs/axios'
import { makeQuery } from '@src/shared/transformer/query.transformer'

export type UserPaymentInfoType = {
  userInfo: {
    userId: number | null
    identificationNumber?: string //social security number
    IdentificationFile?: string //주민등록증
    businessLicense?: string
  }
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
    street: { 1: string; 2: string }
    city: string
    state: string
    country: string
    zip: number
  }
}

export const getUserPaymentInfo = async (
  id: number,
): Promise<UserPaymentInfoType> => {
  try {
    //   const data = await axios.get(`/api/enough/pro/user/al?${id}`)
    //   return data.data
    return {
      userInfo: {
        userId: 1,
        identificationNumber: '123-******', //social security number
        IdentificationFile: '123-******', //주민등록증
        businessLicense: '123-******',
      },
      type: 'Transfer wise', //Transfer wise | US ACH | Korea domestic transfer |International Wire | PayPal
      bankInfo: {
        accountName: 'ABA',
        email: 'bon@glozinc.com',
        accountNumber: '123-******',
        routingNumber: '123-******',
        swiftCode: '123123',
        ibnNumber: '123-******',
      },
      correspondentBankInfo: {
        accountNumber: '123-******',
        bankIdentifierCode: '123-******', //SWIFT, BIC
        others: '123-******',
      },

      billingAddress: {
        street: { 1: 'Enpyugn', 2: 'Somewhrere' },
        city: 'Seoul',
        state: 'Seoul',
        country: 'Korea',
        zip: 303030,
      },
    }
  } catch (e: any) {
    return {
      userInfo: {
        userId: null,
        identificationNumber: '',
        IdentificationFile: '',
        businessLicense: '',
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
        street: { 1: '', 2: '' },
        city: '',
        state: '',
        country: '',
        zip: 0,
      },
    }
  }
}
