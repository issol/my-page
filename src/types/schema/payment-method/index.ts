import {
  AccountMethodFormType,
  BankTransferFormType,
  CreditCardFormType,
  PayPalFormType,
  PaymentType,
} from '@src/types/payment-info/client/index.type'
import { bankTransferSchema } from './bank-transfer.schema'
import { creditCardSchema } from './credit-card.schema'
import { payPalSchema } from './paypal.schema'
import { accountMethodSchema } from './account-method.schema'

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
