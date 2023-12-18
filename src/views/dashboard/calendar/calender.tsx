import React, { useRef } from 'react'
import {
  Calender,
  CustomEvent,
} from '@src/pages/quotes/lpm/requests/components/calendar/calendar'
import FullCalendar, { CalendarOptions } from '@fullcalendar/react'
import { calendarDefaultOptions } from '@src/shared/const/calender'
import CustomCalenderToolbar from '@src/pages/quotes/lpm/requests/components/calendar/customCalenderToolbar'
import dayGridPlugin from '@fullcalendar/daygrid'
import Box from '@mui/material/Box'
import { CalendarEventType } from '@src/types/common/calendar.type'
import { ProJobCalendarResult } from '@src/queries/dashboard/dashnaord-lpm'

interface CalendarProps {
  event: Array<CalendarEventType<ProJobCalendarResult>>
  containerWidth: number
}

const Calendar = ({ event, containerWidth }: CalendarProps) => {
  // ** Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<FullCalendar>(null)

  const finalEvent = event.map(item => {
    return {
      ...item,
      title: item.name,
      start: item.statusUpdatedAt,
      end: item.statusUpdatedAt,
    }
  })

  const calendarOptions = {
    ...calendarDefaultOptions,
    events: finalEvent as CalendarOptions['events'],
    ref: calendarRef,
    direction: 'ltr' as CalendarOptions['direction'],
    eventContent: (arg: any) => {
      return (
        <CustomEvent color={arg.event?._def?.extendedProps.calendar}>
          <span>{arg.event?._def?.title}</span>
        </CustomEvent>
      )
    },
    eventClick({ event }: any) {
      // setCurrentListId(Number(event?.id))
    },
  }

  return (
    <Calender
      ref={containerRef}
      width={containerWidth}
      style={{
        width: '100%',
        paddingLeft: '20px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          paddingTop: '20px',
          paddingLeft: '20px',
          marginLeft: '-20px',
          position: 'relative',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: -1,
            display: 'block',
            width: '1px',
            height: '92px',
            backgroundColor: 'rgba(76, 78, 100, 0.12)',
          }}
        />
        <CustomCalenderToolbar ref={calendarRef} height={56} />
      </Box>
      <Box
        sx={{
          position: 'relative',
        }}
      >
        <FullCalendar {...calendarOptions} height={780} />
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            left: -20,
            display: 'block',
            width: `${containerWidth}px`,
            height: '1px',
            backgroundColor: 'rgba(76, 78, 100, 0.12)',
          }}
        />
      </Box>
    </Calender>
  )
}

export default Calendar
