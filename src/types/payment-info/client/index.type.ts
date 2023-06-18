/* TODO: 아래 타입들은 변경될 수 있음!! */
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
    { value: 'creditCard', label: 'Credit card' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'wise', label: 'Wise' },
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
