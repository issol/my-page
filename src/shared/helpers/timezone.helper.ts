import moment from 'moment-timezone'
import { timezones } from 'src/@fake-db/autocomplete'

interface Timezone {
  label: string
  value: string
}

export const getGmtTime = (code: string) => {
  /* @ts-ignore */
  const timezoneName = timezones.countries[code].zones[0]
  return `(GMT${moment.tz(timezoneName).format('Z')}) ${timezoneName}`
}
