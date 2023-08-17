export type OfficeType = 'Japan' | 'Korea' | 'Singapore' | 'US'

export type PaymentType =
  | 'bankTransfer'
  | 'creditCard'
  | 'paypal'
  | 'wise'
  | 'directDeposit'
  | 'check'
  | 'stripe'
  | 'airwallex'

export const PaymentMethodPairs: {
  [K in OfficeType]: Array<{ value: PaymentType; label: string }>
} = {
  Korea: [
    { value: 'bankTransfer', label: 'Bank transfer' },
    // { value: 'creditCard', label: 'Credit card' },
    // { value: 'paypal', label: 'PayPal' },
    // { value: 'wise', label: 'Wise' },
  ],
  US: [
    { value: 'directDeposit', label: 'Direct deposit' },
    { value: 'check', label: 'Check' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'wise', label: 'Wise' },
  ],
  Singapore: [
    { value: 'directDeposit', label: 'Direct deposit' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'wise', label: 'Wise' },
    { value: 'airwallex', label: 'Airwallex' },
  ],
  Japan: [{ value: 'directDeposit', label: 'Direct deposit' }],
}

export type ClientPaymentInfoDetail = {
  id: number
  createdAt: string
  updatedAt: null | string
  clientId: number
  adminCompanyName: string
  office: OfficeType
  paymentMethod: PaymentType
  paymentData: PaymentMethodUnionType
  taxData: OfficeTaxType
}

export type ClientPaymentFormType = {
  clientId: number
  paymentId?: number // paymentId 가 전달되면 업데이트, 전달되지 않으면 생성
  office: OfficeType
  paymentMethod: PaymentType
  paymentData: PaymentMethodUnionType
  taxData: OfficeTaxType
}

/* Tax form types */
export type OfficeTaxType =
  | KoreaTaxFormType
  | USTaxFormType
  | SingaporeTaxFormType
  | JapanTaxFormType
  // ** TaxType에 PayPalFormType을 넣은 이유는 Client < Company Info < Payment info에서 korea tax form이 email이기 때문
  | PayPalFormType

export type KoreaTaxFormType = {
  businessNumber: number
  companyName: string
  representativeName: string
  businessAddress: string
  businessType: string
  recipientEmail: string
}

export type USTaxFormType = {
  clientName: string
  clientAddress: string
}

export type SingaporeTaxFormType = {
  clientName: string
  clientAddress: string
  taxId: number | null
  uenId: number | null
}

export type JapanTaxFormType = {
  clientName: string
  clientAddress: string
  taxId: number | null
  businessNumber: number | null
}

/* Payment method types */
export type PaymentMethodUnionType =
  | BankTransferFormType
  | CreditCardFormType
  | PayPalFormType
  | AccountMethodFormType

export type BankTransferFormType = {
  bankName: string
  accountHolder: string
}

export type CreditCardFormType = {
  cardNumber: string
  validDueAt: string
}

export type PayPalFormType = {
  email: string
}

export type AccountMethodFormType = {
  account: string
}
