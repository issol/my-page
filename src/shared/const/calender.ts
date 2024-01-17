import dayjs from 'dayjs'
import dayGridPlugin from '@fullcalendar/daygrid'
import { CalendarOptions } from '@fullcalendar/common'
import FullCalendar from '@fullcalendar/react'

export const ValidRange = {
  start: dayjs().add(-24, 'month').format('YYYY-MM-DD'),
  end: dayjs().add(2, 'month').format('YYYY-MM-DD'),
}

export const calendarDefaultOptions: FullCalendar['props'] = {
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    start: '',
    end: '',
  },
  titleFormat: date => {
    return dayjs(date.start.marker).format('MMMM YYYY')
  },
  dayMaxEvents: 3,
  eventResizableFromStart: true,
  validRange: ValidRange,
}
