import { CurrencyType } from '@src/types/common/standard-price'
import { locale } from '../const/locale'
import { RoundingProcedureObj } from '../const/rounding-procedure/rounding-procedure'

export function formatCurrency(num: number | string, currency: CurrencyType) {
  const currentLocale = locale[currency]
  const formatter = new Intl.NumberFormat(currentLocale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  })
  return formatter.format(Number(num))
}

export function formatByRoundingProcedure(
  price: number,
  decimalPlace: number,
  roundingType: string | number,
  currency: CurrencyType,
): number | string {
  if (currency === 'USD' || currency === 'SGD') {
    const factor = Math.pow(
      10,
      roundingType === 4 ? decimalPlace - 1 : decimalPlace,
    )

    let type = null
    if (typeof roundingType === 'string') {
      //@ts-ignore
      type = RoundingProcedureObj[roundingType]
    } else {
      type = Number(roundingType)
    }
    switch (type) {
      case 0:
        return price.toFixed(decimalPlace)
      case 1:
        return (Math.ceil(price * factor) / factor).toFixed(2)
      case 2:
        return (Math.floor(price * factor) / factor).toFixed(2)
      case 3:
        return (Math.round(price * factor) / factor).toFixed(2)
      case 4:
        return (Math.ceil(price * factor) / factor).toFixed(2)
    }
  }
  const rounded = Math.round(price / decimalPlace) * decimalPlace
  return rounded
}
