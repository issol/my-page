import logger from '@src/@core/utils/logger'
import moment from 'moment-timezone'
import { timezones } from 'src/@fake-db/autocomplete'

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
  const timeZoneCode = 'AF'
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

  return formattedTimeZone
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
