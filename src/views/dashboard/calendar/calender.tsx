import React, { Dispatch, useRef } from 'react'
import {
  Calender,
  CustomEvent,
} from '@src/pages/quotes/lpm/requests/components/calendar/calendar'
import FullCalendar, { CalendarOptions, DatesSetArg } from '@fullcalendar/react'
import { calendarDefaultOptions } from '@src/shared/const/calender'
import CustomCalenderToolbar from '@src/pages/quotes/lpm/requests/components/calendar/customCalenderToolbar'
import dayGridPlugin from '@fullcalendar/daygrid'
import Box from '@mui/material/Box'
import { CalendarEventType } from '@src/types/common/calendar.type'
import { ProJobCalendarResult } from '@src/queries/dashnaord.query'
import dayjs from 'dayjs'

interface CalendarProps {
  event: Array<CalendarEventType<ProJobCalendarResult>>
  containerWidth: number
  setYear: Dispatch<number>
  setMonth: Dispatch<number>
}

const Calendar = ({
  event,
  containerWidth,
  setYear,
  setMonth,
}: CalendarProps) => {
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
    validRange: {
      start: dayjs().add(-24, 'month').format('YYYY-MM-DD'),
      end: dayjs().set('date', dayjs().daysInMonth()).format('YYYY-MM-DD'),
    },
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

  const handleMonthChange = async (payload: DatesSetArg) => {
    const currDate = payload.view.currentStart
    const currYear = currDate.getFullYear()
    const currMonth = currDate.getMonth() + 1

    setYear(currYear)
    setMonth(currMonth)
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
        <FullCalendar
          {...calendarOptions}
          datesSet={handleMonthChange}
          height={850}
        />
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
