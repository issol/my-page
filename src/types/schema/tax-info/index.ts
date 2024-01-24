import {
  JapanTaxFormType,
  KoreaTaxFormType,
  OfficeType,
  SingaporeTaxFormType,
  USTaxFormType,
} from '@src/types/payment-info/client/index.type'
import { koreaTaxSchema } from './korea-tax.schema'
import { usTaxSchema } from './us-tax.schema'
import { singaporeTaxSchema } from './singapore-tax.schema'
import { japanTaxSchema } from './japan-tax.schema'
import { payPalSchema } from '../payment-method/client/paypal.schema'
import { Resolver } from 'react-hook-form'
import { ObjectSchema } from 'yup'

export const clientTaxInitialData = (type: OfficeType) => {
  switch (type) {
    case 'Korea':
      return {
        businessNumber: null,
        companyName: '',
        representativeName: '',
        businessAddress: '',
        businessType: '',
        recipientEmail: '',
      }
    case 'US':
      return {
        clientName: '',
        clientAddress: '',
      }
    case 'Singapore':
      return {
        clientName: '',
        clientAddress: '',
        taxId: null,
        uenId: null,
      }
    case 'Japan':
      return {
        clientName: '',
        clientAddress: '',
        taxId: null,
        businessNumber: null,
      }
    default:
      return {
        businessNumber: null,
        companyName: '',
        representativeName: '',
        businessAddress: '',
        businessType: '',
        recipientEmail: '',
      }
  }
}

export function getTaxInfoSchema(
  type: OfficeType,
  host?: 'client' | 'lpm',
): ObjectSchema<any> {
  switch (type) {
    case 'Korea':
      if (host === 'client') {
        return payPalSchema
      } else {
        return koreaTaxSchema
      }
    case 'US':
      return usTaxSchema
    case 'Singapore':
      return singaporeTaxSchema
    case 'Japan':
      return japanTaxSchema
    default:
      return koreaTaxSchema
  }
}
