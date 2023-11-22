// ** React Import
import { useRef } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar, { CalendarOptions, DatesSetArg } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

// ** types

import { ClientProjectCalendarEventType } from '@src/apis/client.api'
import { Box, Typography } from '@mui/material'
import styled from 'styled-components'
import { calendarDefaultOptions } from '@src/shared/const/calender'
import {
  CalenderProps,
  Calender,
  CustomEvent,
} from '@src/pages/quotes/lpm/requests/components/calendar/calendar'
import CustomCalenderToolbar from '@src/pages/quotes/lpm/requests/components/calendar/customCalenderToolbar'
import Switch from '@mui/material/Switch'

type Props = {
  event: Array<ClientProjectCalendarEventType>
  setYear: (year: number) => void
  setMonth: (month: number) => void
  direction: string
  setCurrentListId: (id: number) => void
}

const ClientProjectCalendar = (
  props: CalenderProps<ClientProjectCalendarEventType, boolean>,
) => {
  // ** Props
  const {
    event,
    setYear,
    setMonth,
    direction,
    setCurrentListId,
    containerWidth,
    filter,
    setFilter,
  } = props

  const finalEvent = event.map(item => {
    return {
      ...item,
      start: item.updatedAt,
      end: item.updatedAt,
      title: item.projectName,
    }
  })

  // ** Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<FullCalendar>(null)

  const calendarOptions = {
    ...calendarDefaultOptions,
    events: finalEvent as CalendarOptions['events'],
    ref: calendarRef,
    direction,
    eventContent: (arg: any) => {
      return (
        <CustomEvent color={arg.event?._def?.extendedProps.calendar}>
          <span>{arg.event?._def?.title}</span>
        </CustomEvent>
      )
    },

    eventClick({ event }: any) {
      setCurrentListId(Number(event?.id))
    },
  }

  async function handleMonthChange(payload: DatesSetArg) {
    const currDate = payload.view.currentStart
    const currYear = currDate.getFullYear()
    const currMonth = currDate.getMonth() + 1
    setYear(currYear)
    setMonth(currMonth)
  }

  // @ts-ignore
  return (
    <Calender ref={containerRef} width={containerWidth}>
      <CustomCalenderToolbar ref={calendarRef}>
        <Box display='flex' alignItems='center' gap='20px' paddingRight='20px'>
          <Typography>Hide completed projects</Typography>
          <Switch
            checked={filter}
            onChange={e => setFilter(e.target.checked)}
          />
        </Box>
      </CustomCalenderToolbar>
      <FullCalendar {...calendarOptions} datesSet={handleMonthChange} />
    </Calender>
  )
}

export default ClientProjectCalendar
