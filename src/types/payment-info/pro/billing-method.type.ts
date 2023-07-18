export type ProPaymentType =
  | 'wise' //Transferwise(Wise)
  | 'us_ach' //US ACH (US residents only)
  | 'paypal'
  | 'koreaDomesticTransfer'
  | 'internationalWire' //International wire

export const proPaymentMethodPairs: Array<{
  value: ProPaymentType
  label: string
}> = [
  { value: 'wise', label: 'Transferwise(Wise)' },
  { value: 'us_ach', label: 'US ACH (US residents only)' },
  { value: 'paypal', label: 'PayPal' },
  {
    value: 'koreaDomesticTransfer',
    label: 'Korea domestic transfer (국내계좌이체)',
  },
  { value: 'internationalWire', label: 'International wire' },
]

export type BillingMethodUnionType =
  | TransferWiseFormType
  | KoreaDomesticTransferType
  | KoreaDomesticTransferSoloType
  | PayPalType

// ** Transferwise, US ACH, International wire 용 form
export type TransferWiseFormType = {
  billingMethod: ProPaymentType | null
  copyOfId: File
  personalId: string
  // bankInfo: BankInfo
  haveCorrespondentBank: boolean
  // correspondentBankInfo?: CorrespondentBankInfo
}

// ** 국내계좌송금 - 일반
export type KoreaDomesticTransferType = {
  billingMethod: ProPaymentType | null
  rrn: number //Resident registration number
  copyOfRrCard: File //Copy of Resident Registration Card
  copyOfBankStatement: File //Copy of bank statement
  // bankInfo: BankInfo
  // correspondentBankInfo?: CorrespondentBankInfo
}

// ** 국내계좌송금 - 개인사업자
export type KoreaDomesticTransferSoloType = {
  billingMethod: ProPaymentType | null
  businessName: string
  businessNumber: number //Business Registration Number*
  copyOfRrCard: File //Copy of Resident Registration Card
  // bankInfo: BankInfo
  // correspondentBankInfo?: CorrespondentBankInfo
}

export type PayPalType = {
  billingMethod: ProPaymentType | null
  email: string
  personalId: string
  copyOfId: File
}

export type BankInfo = {
  bankName: string
  accountNumber: string
  bankRoutingNumber?: string
  swiftCode?: string
  iban?: string
}

export type CorrespondentBankInfo = {
  bankRoutingNumber?: string
  swiftCode?: string
  iban?: string
}
