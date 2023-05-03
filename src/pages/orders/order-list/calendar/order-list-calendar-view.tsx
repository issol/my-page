// ** React Import
import { useRef } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar, { DatesSetArg } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { OrderListCalendarEventType } from '@src/apis/order-list.api'
// ** types

type Props = {
  event: Array<OrderListCalendarEventType>
  setYear: (year: number) => void
  setMonth: (month: number) => void
  direction: string
  setCurrentListId: (id: number) => void
}

const OrderListCalendarView = (props: Props) => {
  // ** Props
  const { event, setYear, setMonth, direction, setCurrentListId } = props

  const finalEvent = event.map(item => {
    return {
      ...item,
      start: item.orderedAt,
      end: item.projectDueAt,
      title: item.projectName,
    }
  })

  console.log(finalEvent)

  // ** Refs
  const calendarRef = useRef()

  if (event.length) {
    const calendarOptions = {
      events: finalEvent,
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        start: 'sidebarToggle, prev, next, title',
        end: '',
      },

      dayMaxEvents: 3,
      eventResizableFromStart: true,
      ref: calendarRef,
      direction,

      eventClassNames({ event: calendarEvent }: any) {
        const colorName = calendarEvent._def.extendedProps.calendar
        return [`bg-${colorName}`]
      },
      eventClick({ event }: any) {
        setCurrentListId(Number(event?.id))
      },
    }

    async function handleMonthChange(payload: DatesSetArg) {
      const currDate = payload.view.currentStart
      const currYear = currDate.getFullYear()
      const currMonth = currDate.getMonth()
      setYear(currYear)
      setMonth(currMonth)
    }

    // @ts-ignore
    return <FullCalendar {...calendarOptions} datesSet={handleMonthChange} />
  } else {
    return null
  }
}

export default OrderListCalendarView
