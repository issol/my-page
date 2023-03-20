// ** React Import
import { useEffect, useRef, useState } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar, { DatesSetArg } from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

// ** types
import { CalendarEventType } from '@src/apis/pro-projects.api'

type Props = {
  event: Array<CalendarEventType>
  setYear: (year: number) => void
  setMonth: (month: number) => void
  direction: string
}

const ProjectCalendar = (props: Props) => {
  // ** Props
  const { event, setYear, setMonth, direction } = props

  const finalEvent = event.map(item => {
    return {
      ...item,
      start: item.orderDate,
      end: item.dueDate,
    }
  })

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

export default ProjectCalendar
