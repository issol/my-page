import dayjs from 'dayjs'
import dayGridPlugin from '@fullcalendar/daygrid'
import { CalendarOptions } from '@fullcalendar/common'

export const ValidRange = {
  start: dayjs().add(-24, 'month').format('YYYY-MM-DD'),
  end: dayjs().add(2, 'month').format('YYYY-MM-DD'),
}

export const calendarDefaultOptions: CalendarOptions = {
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    start: '',
    end: '',
  },
  titleFormat: date => {
    console.log('DATADA', date)
    return dayjs(date.start.marker).format('MMMM YYYY')
  },
  dayMaxEvents: 3,
  eventResizableFromStart: true,
  validRange: ValidRange,
}
