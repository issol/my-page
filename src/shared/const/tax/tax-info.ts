import { TaxResidentInfoType } from '@src/apis/payment-info.api'

export const TaxInfo = [
  {
    value: 'Japan resident',
    label: 'Japan resident',
  },
  {
    value: 'Korea resident',
    label: 'Korea resident',
  },
  {
    value: 'Korea resident (Sole proprietorship)',
    label: 'Korea resident (Sole proprietorship)',
  },
  {
    value: 'Singapore resident',
    label: 'Singapore resident',
  },
  {
    value: 'US resident',
    label: 'US resident',
  },
]

export const TextRatePair: Array<{
  label: TaxResidentInfoType
  value: number | null
}> = [
  {
    value: null,
    label: 'Japan resident',
  },
  {
    value: -3.3,
    label: 'Korea resident',
  },
  {
    value: 10,
    label: 'Korea resident (Sole proprietorship)',
  },
  {
    value: null,
    label: 'Singapore resident',
  },
  {
    value: null,
    label: 'US resident',
  },
]
