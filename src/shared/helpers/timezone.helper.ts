import moment from 'moment-timezone'
import { timezones } from 'src/@fake-db/autocomplete'

interface Timezone {
  label: string
  value: string
}

// output ex : (GMT+09:00) Asia/Seoul
export const getGmtTime = (code: string | null | undefined) => {
  if (!code) return '-'
  /* @ts-ignore */
  const timezoneName = timezones.countries[code]?.zones[0]
  console.log(timezoneName)

  return `(GMT${moment.tz(timezoneName).format('Z')}) ${timezoneName}`
}

export const getGmtTimeEng = (code: string | null | undefined) => {
  if (!code) return '-'
  const timeZoneCode = 'AF'
  /* @ts-ignore */
  const timeZone = timezones.countries[code]?.zones[0]
  console.log(timeZone)

  const formatter = new Intl.DateTimeFormat('en', {
    timeZone: timeZone,
    timeZoneName: 'long',
  })

  console.log(formatter.formatToParts(new Date()))

  const timeZoneName = formatter
    .formatToParts(new Date())
    .find(part => part.type === 'timeZoneName')!.value

  console.log(timeZoneName)

  const formattedTimeZone = `GMT(${moment
    .tz(timeZone)
    .format('Z')}) ${timeZoneName} - ${timeZone}`

  return formattedTimeZone
}

export function getTimezone(value: any) {
  if (!value) return ''
  const timeZone = moment.tz.guess()
  let date
  //this is for safari response
  if (isNaN(new Date(value).valueOf())) {
    date = new Date(value.replace(/-/g, '/'))
  } else {
    date = new Date(value)
  }

  const timeZoneOffset = date.getTimezoneOffset()
  const timeZoneAbbr = moment.tz.zone(timeZone)!.abbr(timeZoneOffset)
  return timeZoneAbbr
}
