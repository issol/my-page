import { CountryType, TimeZoneType } from '@src/types/sign/personalInfoTypes'
import dayjs from 'dayjs'
import {
  convertCountryCodeToTimezone,
  getTimezone,
  getTimezoneOffset,
} from './timezone.helper'

import { DateTime, IANAZone } from 'luxon'

import { countries } from '@src/@fake-db/autocomplete'
import moment from 'moment-timezone'

// 미사용, 추후 제거
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

export const changeTimeZoneOffset = (
  dateStr: string,
  toTimeZone: CountryType,
) => {
  //입력 받은 ISOString(로컬 타임존이 설정되어 있음)를 includeOffset 옵션을 이용하여 offset을 제거한다
  const removeOffsetDate = DateTime.fromISO(dateStr).toISO({
    includeOffset: false,
  })
  //오프셋이 제거된 ISOString에 변경하고자 하는 타임존을 적용한 후 UTC->ISO 처리한다.
  const setNewOffsetDate = DateTime.fromISO(removeOffsetDate!, {
    zone: toTimeZone.label,
    setZone: true,
  })
    .toUTC()
    .toISO()
  return setNewOffsetDate
}

export const changeTimeZoneOffsetFilter = (
  dateStr: string,
  toTimeZone: CountryType,
) => {
  //입력 받은 ISOString(로컬 타임존이 설정되어 있음)를 includeOffset 옵션을 이용하여 offset을 제거한다
  const removeOffsetDate = DateTime.fromISO(dateStr).toISO({
    includeOffset: false,
  })

  //오프셋이 제거된 ISOString에 변경하고자 하는 타임존을 적용한 후 UTC->ISO 처리한다.

  const offset = getTimezoneOffset(toTimeZone.label) ?? 0
  let setNewOffsetDate

  if (offset < 0) {
    setNewOffsetDate = DateTime.fromISO(removeOffsetDate!, {
      zone: toTimeZone.label,
      setZone: true,
    }).minus({ hours: Math.abs(offset) })

    console.log(setNewOffsetDate)
  } else {
    setNewOffsetDate = DateTime.fromISO(removeOffsetDate!, {
      zone: toTimeZone.label,
      setZone: true,
    }).plus({ hours: offset })
  }
  if (setNewOffsetDate) {
    const isoDate = setNewOffsetDate.toISODate() // YYYY-MM-DD
    const isoTime = setNewOffsetDate.toISOTime({
      suppressMilliseconds: true,
      includeOffset: false,
    }) // hh:mm:ss

    const isoDateTime = `${isoDate}T${isoTime}Z`

    return isoDateTime
  } else {
    return ''
  }
}

export const convertTimeToTimezone = (
  dateStr: string | Date | undefined | null,
  timezoneInfo: CountryType | string | undefined | null,
  timezoneList: TimeZoneType[],
  useISOString?: boolean,
): string => {
  if (
    dateStr === undefined ||
    dateStr === null ||
    timezoneInfo === undefined ||
    timezoneInfo === null
  )
    return '-'

  try {
    let toTimeZone = ''
    if (typeof timezoneInfo !== 'string') {
      // 이전 방식, 국가 코드가 들어오는 케이스 대응, 마이그레이션 이후 삭제해야 함
      if (countries.some(country => country.code === timezoneInfo?.code)) {
        const rtn: any = dayjs(dateStr).format('MM/DD/YYYY, hh:mm A')
        return `${rtn} (${getTimezone(dateStr, timezoneInfo?.code!)})`
      }
      // 신규 방식, 타임존과 타임존 약어가 들어오는 경우 신규 방식으로 처리
      else if (IANAZone.isValidZone(timezoneInfo?.label!)) {
        toTimeZone = timezoneInfo?.label!
      } else {
        // 이 케이스가 있다면 분석해야 함
        console.log('convertTimeToTimezone - unknown case', timezoneInfo)
      }
    } else {
      toTimeZone = timezoneInfo
    }

    const utcDate = DateTime.fromISO(String(dateStr), { zone: 'utc' })

    // Convert the date to the specified timezone
    const convertDate = utcDate.setZone(toTimeZone)

    // convertTimeToTimezone 함수를 사용하는 형태에 string만 보내는 케이스가 없어질 경우, 아래 코드는 삭제되고 timezoneInfo.code를 Abbr에 사용함
    const localStorageTimeZoneList: TimeZoneType[] =
      timezoneList as TimeZoneType[]
    const timezoneAbbr = localStorageTimeZoneList.find(
      list => list.timezone === toTimeZone,
    )?.timezoneCode
    // 위 코드 삭제시 사용할 코드
    // const timezoneAbbr = timezoneInfo.code

    return useISOString && useISOString
      ? convertDate.toISO({ includeOffset: false })!
      : convertDate.toFormat('MM/dd/yyyy, hh:mm a ') + `(${timezoneAbbr})`
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

// output ex : 20180913
// 사업자등록증 조회시 날짜 포맷
export const formatDateToYYYYMMDD = (date?: string) => {
  if (date) {
    const currentDate = new Date(date)
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
    return `${year}${month}${day}`
  }
  return
}

// Request의 item array에서 desiredDueDate 값 중 가장 빠른 시간을 찾는 함수
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

export const convertLocalTimezoneToUTC = (date: Date): Date => {
  return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000)
}

export const formatDateToISOString = (date: Date) => {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`
}

/**
 * 입력받은 date 객체를 로컬 타임존이 포함된 ISOString으로 변환
 * 예 : Thu Aug 10 2023 00:00:00 GMT+0900 (한국 표준시) -> 2023-08-10T00:00:00.000+09:00
 */
export const convertDateToLocalTimezoneISOString = (date: Date) => {
  return DateTime.fromJSDate(date).toLocal().toISO()
}

/**
 * 2023-08-31T04:00:00.000Z, US -> 2023-08-31T00:00:00.000-04:00
 */
export const convertUTCISOStringToLocalTimezoneISOString = (
  UTCISOString: string,
  timezoneCode: string,
) => {
  const timezone = convertCountryCodeToTimezone(timezoneCode)
  const utcDateTime = DateTime.fromISO(UTCISOString, { zone: 'utc' })
  if (utcDateTime.isValid && timezone) {
    const localDateTime = utcDateTime.setZone(timezone)
    return localDateTime.toISO()
  }
  return utcDateTime.toISO()
}

export const formattedNow = (now: Date) => {
  const minutes = now.getMinutes()

  const formattedMinutes = minutes % 30 === 0 ? minutes : minutes > 30 ? 0 : 30

  const formattedHours = minutes > 30 ? now.getHours() + 1 : now.getHours()
  const formattedTime = `${formattedHours}:${formattedMinutes
    .toString()
    .padStart(2, '0')}`
  const formattedDate = new Date(now)
  formattedDate.setHours(parseInt(formattedTime.split(':')[0]))
  formattedDate.setMinutes(parseInt(formattedTime.split(':')[1]))

  return formattedDate
}

export const convertLocalToUtc = (
  date: string,
  timezone: string,
  isEndDate: boolean = false,
) => {
  const localTime = moment.tz(
    moment(date).format('YYYY-MM-DD'),
    timezone === 'ROK' ? 'Asia/Seoul' : timezone,
  )

  const utcTime = localTime.utc()
  return utcTime.toISOString()
}
