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

export type OfficeTaxType =
  | KoreaTaxFormType
  | USTaxFormType
  | SingaporeTaxFormType
  | JapanTaxFormType
