import { CurrencyType } from '@src/types/common/standard-price'

export type LocaleType = {
  [key in CurrencyType]: string
}

export const locale: LocaleType = {
  USD: 'en-US',
  KRW: 'ko-KR',
  SGD: 'en-SG',
  JPY: 'ja-JP',
}
