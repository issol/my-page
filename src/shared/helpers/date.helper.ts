import { CountryType } from '@src/types/sign/personalInfoTypes'
import dayjs from 'dayjs'
import { convertCountryCodeToTimezone, getTimezone } from './timezone.helper'

export function convertDateByTimezone(date: string, from: string, to: string) {
  /**
   * from이 US, to가 KR일 경우, date를 US시간(미국)에서 KR시간(한국)으로 convert한다.
   * @returns ex : 03/28/2023, 02:04 AM
   * @param date Date형태의 string
   * @param from KR, US와 같은 country code
   * @param to KR, US와 같은 country code
   */

  const toTimezone = convertCountryCodeToTimezone(to)
  const fromDate = FullDateTimezoneHelper(date, from)
    ? new Date(FullDateTimezoneHelper(date, from))
    : new Date(date)

  if (!date || !fromDate) return '-'

  const convertedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: toTimezone,
  })?.format(fromDate)

  return FullDateHelper(convertedDate)
}

// output ex : 03/28/2023, 12:00 AM (EST)
export function FullDateTimezoneHelper(
  value: any,
  timezone: CountryType | string,
): string {
  if (value === undefined || value === null) return '-'
  try {
    const rtn: any = dayjs(value).format('MM/DD/YYYY, hh:mm A')
    if (typeof timezone !== 'string' && timezone?.code)
      return `${rtn} (${getTimezone(value, timezone.code)})`
    else if (typeof timezone === 'string')
      return `${rtn} (${getTimezone(value, timezone)})`
    return rtn
  } catch (e) {
    return '-'
  }
}

// output ex : 01/31/2023
export function MMDDYYYYHelper(value: string | Date | undefined | null) {
  if (!value || new Date(value) === undefined) return ''
  return dayjs(value).format('MM/DD/YYYY')
}

// output ex : 01/31/2023, 12:40 AM
export function FullDateHelper(value: any): string | undefined {
  if (value === undefined || value === null) return '-'
  const rtn: any = dayjs(value).format('MM/DD/YYYY, hh:mm A')

  return rtn
}
