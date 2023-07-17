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
