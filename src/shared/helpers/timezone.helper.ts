import moment from 'moment-timezone'
import { timezones } from 'src/@fake-db/autocomplete'
import { IANAZone } from 'luxon'

import { CountryType, TimeZoneType } from '@src/types/sign/personalInfoTypes'
import { SetterOrUpdater } from 'recoil'

const displayName = new Intl.DisplayNames(['en-US'], {
  type: 'region',
  style: 'long',
})
const countryName = (code: string | null | undefined) => {
  if (code) {
    return displayName.of(code)
  }
  return '-'
}

// output ex : (GMT+09:00) Asia/Seoul
export const getGmtTime = (code: string | null | undefined) => {
  if (!code) return '-'
  /* @ts-ignore */
  const timezoneName = timezones.countries[code]?.zones[0]

  return `(GMT${moment.tz(timezoneName).format('Z')}) ${countryName(code)}`
}

export function convertCountryCodeToTimezone(code: string) {
  /* @ts-ignore */
  const timezoneName = timezones.countries[code]?.zones[0] || ''
  return timezoneName
}

export const getGmtTimeEng = (code: string | null | undefined) => {
  if (!code) return '-'
  const timeZoneCode = 'KR'
  /* @ts-ignore */
  const timeZone = timezones.countries[code]?.zones[0]

  const formatter = new Intl.DateTimeFormat('en', {
    timeZone: timeZone,
    timeZoneName: 'long',
  })

  const timeZoneName = formatter
    .formatToParts(new Date())
    .find(part => part.type === 'timeZoneName')!.value

  const formattedTimeZone = `GMT(${moment
    .tz(timeZone)
    .format('Z')}) ${timeZoneName} - ${timeZone}`

  if (timeZone) {
    return formattedTimeZone
  } else {
    return null
  }
}

// export function getTimezone(value: any) {
//   if (!value) return ''
//   const timeZone = moment.tz.guess()
//   /* @ts-ignore */

//   let date
//   //this is for safari response
//   if (isNaN(new Date(value).valueOf())) {
//     date = new Date(value.replace(/-/g, '/'))
//   } else {
//     date = new Date(value)
//   }

//   const timeZoneOffset = date.getTimezoneOffset()
//   const timeZoneAbbr = moment.tz.zone(timeZone)!.abbr(timeZoneOffset)
//   return timeZoneAbbr
// }

export const getTimezone = (value: any, code: string) => {
  if (!value) return ''

  /* @ts-ignore */
  const timeZone = timezones.countries[code]?.zones[0]

  let date
  if (isNaN(new Date(value).valueOf())) {
    date = new Date(value.replace(/-/g, '/'))
  } else {
    date = new Date(value)
  }

  const timeZoneOffset = date.getTimezoneOffset()
  const timeZoneAbbr = moment.tz.zone(timeZone)!.abbr(timeZoneOffset)
  return timeZoneAbbr
}

export const setAllTimeZoneList = (
  setTimezone: SetterOrUpdater<
    {
      offset: number
      offsetFormatted: string
      timezone: string
      timezoneCode: string
    }[]
  >,
) => {
  // 모든 타임존의 리스트를 가져옵니다.
  const timeZones = moment.tz.names()

  // 타임존을 GMT 오프셋으로 변환하고 포맷팅합니다.
  const formattedTimeZones = timeZones.map(tz => {
    // 현재 타임존의 GMT 오프셋을 구합니다.
    const offset = moment.tz(tz).utcOffset()
    const timezoneCode = moment.tz(tz).format('z')
    // 오프셋을 시간:분 포맷으로 변환합니다.
    const offsetHours = Math.floor(Math.abs(offset) / 60)
    const offsetMinutes = Math.abs(offset) % 60
    const offsetFormatted =
      offset >= 0
        ? `+${offsetHours.toString().padStart(2, '0')}:${offsetMinutes
            .toString()
            .padStart(2, '0')}`
        : `-${offsetHours.toString().padStart(2, '0')}:${offsetMinutes
            .toString()
            .padStart(2, '0')}`

    return {
      offset: offset,
      offsetFormatted: offsetFormatted,
      timezone: tz,
      timezoneCode: timezoneCode,
    }
  })

  const finalTimeZoneList = formattedTimeZones.sort((a, b) => {
    const offsetA = a.offset
    const offsetB = b.offset
    return offsetA - offsetB
  })

  setTimezone(finalTimeZoneList)

  // setTimeZoneToLocalStorage(finalTimeZoneList)
}

export const timeZoneFormatter = (
  timeZone: CountryType | string,
  timezoneList: TimeZoneType[],
) => {
  try {
    if (typeof timeZone === 'string') return timeZone

    if (timeZone.code === '' || timeZone.label === '') return ''
    const localStorageTimeZoneList: TimeZoneType[] =
      timezoneList as TimeZoneType[]
    const filteredTimeZone = localStorageTimeZoneList.find(
      list => list.timezone === timeZone.label,
    )
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: filteredTimeZone?.timezone,
      timeZoneName: 'long',
    })

    const timeZoneName = formatter
      .formatToParts(new Date())
      .find(part => part.type === 'timeZoneName')!.value

    if (!filteredTimeZone) new Error(`input timezone is null`)
    return `(GMT${filteredTimeZone?.offsetFormatted}) ${timeZoneName} - ${filteredTimeZone?.timezone}`
  } catch (e) {
    return ''
  }
}

/**
 * Asia/Seoul -> +9
 * America/New_York -> -4
 */
export const getTimezoneOffset = (timezone: string) => {
  try {
    const zone = IANAZone.create(timezone)
    // const now = Date.now();
    const now = Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate(),
      new Date().getUTCHours(),
      new Date().getUTCMinutes(),
      new Date().getUTCSeconds(),
    )
    const offset = zone.offset(now) / 60 // 시간 오프셋을 분 단위로 변환
    return offset
  } catch (error) {
    return null
  }
}

/**
 * new Date()를 통해 로컬 타임존이 반영된 ISOString에서 시간 값은 fix 하고 타임존 오프셋만 교체합니다.
 * 2023-08-10T00:00:00.000+09:00, US 입력시 -> 2023-08-10T00:00:00.000-04:00
 * DatePicker에서 선택받은 Date값에서 날짜와 시간 값은 유지한 상태로 타임존만 교체할때 사용합니다.
 */
export const changeTimezoneFromLocalTimezoneISOString = (
  localISOString: string,
  timezone: string,
) => {
  const datetimePart = localISOString.slice(0, -6)
  const timezoneCode = convertCountryCodeToTimezone(timezone)
  const newOffset = getTimezoneOffset(timezoneCode)

  if (newOffset !== null) {
    const sign = newOffset >= 0 ? '+' : '-'
    const hours = Math.floor(Math.abs(newOffset))
    const minutes = (Math.abs(newOffset) % 1) * 60
    const offsetString = `${sign}${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`

    return `${datetimePart}${offsetString}`
  }

  return localISOString
}
