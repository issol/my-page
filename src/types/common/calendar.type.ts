export type CalendarEventType<T> = T & {
  extendedProps?: { calendar: string }
  allDay?: boolean
}
