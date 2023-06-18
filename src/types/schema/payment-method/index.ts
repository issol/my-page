import { PaymentType } from '@src/types/payment-info/client/index.type'
import {
  BankTransferFormType,
  bankTransferSchema,
} from './bank-transfer.schema'
import { CreditCardFormType, creditCardSchema } from './credit-card.schema'
import { PayPalFormType, payPalSchema } from './paypal.schema'
import {
  AccountMethodFormType,
  accountMethodSchema,
} from './account-method.schema'

export function getPaymentMethodSchema(type: PaymentType) {
  switch (type) {
    case 'bankTransfer':
    case 'directDeposit':
      return bankTransferSchema
    case 'creditCard':
      return creditCardSchema
    case 'paypal':
      return payPalSchema
    case 'wise':
    case 'stripe':
    case 'airwallex':
      return accountMethodSchema
    default:
      return bankTransferSchema
  }
}

export type PaymentMethodUnionType =
  | BankTransferFormType
  | CreditCardFormType
  | PayPalFormType
  | AccountMethodFormType
