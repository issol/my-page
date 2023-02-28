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
  const timezoneName = timezones.countries[code].zones[0]
  return `(GMT${moment.tz(timezoneName).format('Z')}) ${timezoneName}`
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
