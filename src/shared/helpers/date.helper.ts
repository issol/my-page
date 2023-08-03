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
  timezone: CountryType | string | undefined | null,
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

export function findEarliestDate(dateStrings: string[]) {
  if (!dateStrings || dateStrings.length === 0) {
    return ''
  }

  const dates: number[] = []
  try {
    dateStrings.forEach(dateStr => {
      const date = new Date(dateStr)
      dates.push(date.getTime())
    })
    if (dates.length === 0) {
      return ''
    }
    const earliestDate = new Date(Math.min.apply(null, dates))
    return earliestDate.toISOString().split('T')[0]
  } catch (e) {
    return ''
  }
}

/**
 * addOneDay
 * @returns 2023-07-04
 * @param date Date형태의 string
 */
export function addOneDay(date: string): string {
  const timestamp = new Date(date).getTime()
  if (isNaN(timestamp)) {
    return ''
  }
  const oneDay = 24 * 60 * 60 * 1000
  const nextDayTimestamp = timestamp + oneDay
  const nextDate = dayjs(new Date(nextDayTimestamp))
  const res = nextDate.format('YYYY-MM-DD').toString()
  return res
}

/* getWeekends output : 
  [
    {
      reason: '',
      start: '2023-07-01',
      end: '2023-07-01',
    },
  ]
*/
export function getWeekends(
  year: number,
  month: number,
): Array<{ id?: number; reason: string; start: string; end: string }> {
  const weekends = []
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  for (
    let date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dayOfWeek = date.getDay()
    if (dayOfWeek === 6 || dayOfWeek === 0) {
      const day = dayjs(new Date(date)).format('YYYY-MM-DD').toString()
      weekends.push({
        reason: '',
        start: day,
        end: day,
      })
    }
  }

  return weekends
}
