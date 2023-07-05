import { OfficeType } from '@src/types/payment-info/client/index.type'
import { koreaTaxSchema, KoreaTaxFormType } from './korea-tax.schema'
import { usTaxSchema, USTaxFormType } from './us-tax.schema'
import {
  singaporeTaxSchema,
  SingaporeTaxFormType,
} from './singapore-tax.schema'
import { japanTaxSchema, JapanTaxFormType } from './japan-tax.schema'

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
