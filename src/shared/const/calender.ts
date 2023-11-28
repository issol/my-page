import dayjs from 'dayjs'
import dayGridPlugin from '@fullcalendar/daygrid'

export const ValidRange = {
  start: dayjs().add(-24, 'month').format('YYYY-MM-DD'),
  end: dayjs().add(2, 'month').format('YYYY-MM-DD'),
}

export const calendarDefaultOptions = {
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    start: '',
    end: '',
  },
  dayMaxEvents: 3,
  eventResizableFromStart: true,
  validRange: ValidRange,
}
