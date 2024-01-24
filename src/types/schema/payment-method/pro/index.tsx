import { ProPaymentType } from '@src/types/payment-info/pro/billing-method.type'
import {
  transferWiseDefaultValue,
  transferWiseSchema,
} from './transfer-wise.schema'
import { payPalDefaultValue, payPalSchema } from './paypal.schema'
import {
  koreaDomesticSoloDefaultValue,
  koreaDomesticSoloSchema,
} from './korea-domestic-solo.schema'
import {
  koreaDomesticDefaultValue,
  koreaDomesticSchema,
} from './korea-domestic.schema'
import { ObjectSchema } from 'yup'

export function getBillingMethodSchema(
  billingMethod: ProPaymentType | null,
  isSolo = false,
): ObjectSchema<any> {
  switch (billingMethod) {
    case 'internationalWire':
    case 'wise':
    case 'us_ach':
      return transferWiseSchema
    case 'paypal':
      return payPalSchema
    case 'koreaDomesticTransfer':
      if (isSolo) return koreaDomesticSoloSchema
      return koreaDomesticSchema
    default:
      return transferWiseSchema
  }
}

export function billingMethodInitialData(
  billingMethod: ProPaymentType | null,
  isSolo = false,
) {
  switch (billingMethod) {
    case 'internationalWire':
    case 'wise':
    case 'us_ach':
      return transferWiseDefaultValue
    case 'paypal':
      return payPalDefaultValue
    case 'koreaDomesticTransfer':
      if (isSolo) return koreaDomesticSoloDefaultValue
      return koreaDomesticDefaultValue
    default:
      return transferWiseDefaultValue
  }
}
