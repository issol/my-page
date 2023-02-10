import dayjs from 'dayjs'
import { getTimezone } from './timezone.helper'

/* ex: 01/31/2023, 12:40 AM (KST) */
export function FullDateTimezoneHelper(value: any): string | undefined {
  if (value === undefined || value === null) return '-'
  const rtn: any = dayjs(value).format('MM/DD/YYYY, hh:mm A')

  return `${rtn} (${getTimezone(value)})`
}
