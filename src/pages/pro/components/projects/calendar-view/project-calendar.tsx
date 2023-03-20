// ** React Import
import { useEffect, useRef, useState } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar, { DatesSetArg } from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const ProjectCalendar = (props: any) => {
  // ** Props
  const { event, setYear, setMonth, direction } = props

  // ** Refs
  const calendarRef = useRef()

  const calendarOptions = {
    events: event,
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

    eventClick({ event: clickedEvent }: any) {
      /* TODO : event detail 받아오기 */
      // console.log(clickedEvent)
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
}

export default ProjectCalendar
