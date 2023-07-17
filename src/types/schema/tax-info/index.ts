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

export function getTaxInfoSchema(type: OfficeType) {
  switch (type) {
    case 'Korea':
      return koreaTaxSchema
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
