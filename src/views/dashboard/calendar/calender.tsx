import React, { useRef } from 'react'
import { Calender } from '@src/pages/quotes/lpm/requests/components/calendar/calendar'
import FullCalendar, { CalendarOptions, DatesSetArg } from '@fullcalendar/react'
import { calendarDefaultOptions } from '@src/shared/const/calender'
import CustomCalenderToolbar from '@src/pages/quotes/lpm/requests/components/calendar/customCalenderToolbar'
import dayGridPlugin from '@fullcalendar/daygrid'
import Box from '@mui/material/Box'

interface CalendarProps {
  containerWidth: number
}

const Calendar = ({ containerWidth }: CalendarProps) => {
  // ** Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<FullCalendar>(null)

  const calendarOptions = {
    ...calendarDefaultOptions,
    //events: finalEvent as CalendarOptions['events'],
    ref: calendarRef,
    direction: 'ltr' as CalendarOptions['direction'],
    eventClassNames({ event: calendarEvent }: any) {
      const colorName = calendarEvent._def.extendedProps.calendar
      return [`bg-${colorName}`]
    },
    eventClick({ event }: any) {
      // setCurrentListId(Number(event?.id))
    },
  }

  const handleMonthChange = async (payload: DatesSetArg) => {
    const currDate = payload.view.currentStart
    const currYear = currDate.getFullYear()
    const currMonth = currDate.getMonth() + 1
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
      <FullCalendar
        {...calendarOptions}
        height={780}
        events={[
          { title: 'event 1', date: '2019-04-01' },
          { title: 'event 2', date: '2019-04-02' },
        ]}
      />
    </Calender>
  )
}

export default Calendar
