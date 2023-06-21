import { CurrencyType } from '@src/types/common/standard-price'
import { locale } from '../const/locale'
import { RoundingProcedureObj } from '../const/rounding-procedure/rounding-procedure'

export function getPrice(
  price: number | string,
  priceFactor: number | string | null,
) {
  if (!priceFactor) return Number(price)
  if (isNaN(Number(price)) || isNaN(Number(priceFactor))) return 0
  return Number(price) * Number(priceFactor)
}

// ** ex: $, ₩ ..
export function getCurrencyMark(currency: CurrencyType | null | undefined) {
  if (!currency) return ''
  const currentLocale = locale[currency!]
  const formatter = new Intl.NumberFormat(currentLocale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  })
  const currencySymbol = formatter.format(0)?.replace(/\d./g, '').trim()
  return currencySymbol
}

export function formatCurrency(num: number | string, currency: CurrencyType, decimalPlace?: number) {
  const currentLocale = locale[currency]
  const formatter = new Intl.NumberFormat(currentLocale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimalPlace ?? 0
  })
  return formatter.format(Number(num))
}

export function formatByRoundingProcedure(
  price: number,
  decimalPlace: number,
  roundingType: string | number,
  currency: CurrencyType,
): number | string {
  try {
    let type = 0
    let precision = 0
    let returnPrice = 0
    if (typeof roundingType === 'string') {
      //@ts-ignore
      type = RoundingProcedureObj[roundingType]
    } else {
      type = Number(roundingType)
    }

    if (currency === 'KRW' || currency === 'JPY') {
      precision = calculateDigit(decimalPlace)
    } else precision = decimalPlace

    if (type === 4 && (currency === 'USD' || currency === 'SGD')) {
      precision = precision - 1
    }

    switch (type) {
      case 0:
        returnPrice = round(price, precision)
        break
      case 1:
        returnPrice = roundUp(price, precision)
        break
      case 2:
        returnPrice = truncate(price, precision)
        break
      case 3:
        returnPrice = rounding(price, precision)
        break
      case 4:
        returnPrice = roundUp(price, precision)
        break
    }
    if (currency === 'USD' || currency === 'SGD') {
      return returnPrice.toFixed(precision)
    }
    return returnPrice
  } catch (e) {
    return 0
  }
}

export function countDecimalPlaces(number: any) {
  const decimalPart = number.toString().split('.')[1]
  return decimalPart ? decimalPart.length : 0
}

export function calculateDigit(number: number): number {
  if (number === 0) {
    return 0;
  }

  let count = 1;
  while (number >= 1) {
    number /= 10;
    count--;
  }
  return count;
}

function round(number: number, precision: number): number {
  const factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}

function roundUp(number: number, precision: number): number {
  const factor = Math.pow(10, precision)
  return Math.ceil(number * factor) / factor
}

function truncate(number: number, precision: number): number {
  const factor = Math.pow(10, precision)
  return Math.trunc(number * factor) / factor
}

function rounding(number: number, precision: number): number {
  const factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}
