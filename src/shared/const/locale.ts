import { Currency } from '@src/types/common/currency.type'

export type LocaleType = {
  [key in Currency]: string
}

export const locale: LocaleType = {
  USD: 'en-US',
  KRW: 'ko-KR',
  SGD: 'en-SG',
  JPY: 'ja-JP',
}
