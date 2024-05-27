import { locale } from '../const/locale'
import { currencyMarks } from '@src/shared/const/price/currencyMarks'
import { RoundingProcedureObj } from '../const/rounding-procedure/rounding-procedure'
import { Currency } from '@src/types/common/currency.type'

export function getPrice(
  price: number | string,
  priceFactor: number | string | null,
) {
  if (!priceFactor) return Number(price)
  if (isNaN(Number(price)) || isNaN(Number(priceFactor))) return 0
  return Number(price) * Number(priceFactor)
}

// ** ex: $, ₩ ..
export function getCurrencyMark(currency: Currency | null | undefined) {
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

export function formatCurrency(
  num: number | string,
  currency: Currency | null,
  decimalPlace?: number,
) {
  // if (!currency) currency = 'KRW'
  if (!currency) return num?.toString()
  const currentLocale = locale[currency]

  const formatter = new Intl.NumberFormat(currentLocale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimalPlace ?? 0,
  })

  const formattedNumber = formatter.format(Number(num))
  const [currencySymbol, value] = [
    formattedNumber.substring(0, 1),
    formattedNumber.substring(1),
  ]
  const result = `${currencySymbol} ${value}`

  return result
}

export function formatByRoundingProcedure(
  price: number,
  decimalPlace: number | null | undefined = 0,
  roundingType: string | number | null | undefined,
  currency: Currency | null,
): number | string {
  try {
    let type = -1
    let precision = 0
    let returnPrice = 0

    if (roundingType === null || roundingType === undefined) {
      type = -1
    } else {
      if (typeof roundingType === 'string') {
        //@ts-ignore
        type = RoundingProcedureObj[roundingType]
      } else {
        type = Number(roundingType)
      }
    }

    if (!currency) currency = 'KRW'
    if (currency === 'KRW' || currency === 'JPY') {
      precision = calculateDigit(decimalPlace ?? 0)
    } else precision = decimalPlace ?? 0

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
      case -1:
        returnPrice = price // 입력된 price를 변경 없이 그대로 반환
        break
      default:
        returnPrice = price // 예상치 못한 type에 대해 라운딩 없이 반환
        break
    }

    if (type !== -1 && (currency === 'USD' || currency === 'SGD')) {
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
    return 0
  }

  let count = 1
  while (number >= 1) {
    number /= 10
    count--
  }
  return count
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

export function sliceCurrencyMark(value: string) {
  const mark = value.slice(0, 1)
  if (currencyMarks.find(currencyMark => currencyMark === mark))
    return value.slice(1, value.length)
  return value
}

export const fixDigit = (number: string | null | undefined, digit: number) => {
  if (!number) return ''
  let str = number.toString()

  // 소수점이 있는 경우, 불필요한 0 제거
  if (str.indexOf('.') !== -1) {
    // 소수점 아래 숫자가 모두 0인 경우 소수점 이하를 제거
    str = str.replace(/\.0+$|(\.\d*?[1-9])0+$/, '$1')
  } else {
    // 소수점이 없는 경우, digit에 주어진 값 만큼 소수점 자리를 잘라냄
    const decimalPart = str.split('.')[1]
    if (decimalPart && decimalPart.length > digit) {
      str = str.slice(0, str.indexOf('.') + digit + 1)
    }
  }

  // 문자열을 숫자로 변환하여 반환, 소수점 아래가 0으로만 구성된 경우 정수로 반환
  return String(parseFloat(str))
}
