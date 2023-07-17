export type CalendarEventType<T> = T & {
  extendedProps?: { calendar: string }
  allDay?: boolean
}

export type OffDayEventType = {
  id?: number
  reason: string
  start: string
  end: string
}
