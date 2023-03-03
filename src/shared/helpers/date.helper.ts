import dayjs from 'dayjs'
import { getTimezone } from './timezone.helper'

// output ex : 01/31/2023, 12:40 AM (KST)
export function FullDateTimezoneHelper(value: any): string | undefined {
  if (value === undefined || value === null) return '-'
  const rtn: any = dayjs(value).format('MM/DD/YYYY, hh:mm A')

  return `${rtn} (${getTimezone(value)})`
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
