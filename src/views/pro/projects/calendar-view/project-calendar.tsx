// ** React Import
import { useRef } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar, { CalendarOptions, DatesSetArg } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

// ** types
import { CalendarEventType } from '@src/apis/pro/pro-projects.api'
import { calendarDefaultOptions } from '@src/shared/const/calender'
import {
  CalenderProps,
  Calender,
} from '@src/pages/quotes/lpm/requests/components/calendar/calendar'
import CustomCalenderToolbar from '@src/pages/quotes/lpm/requests/components/calendar/customCalenderToolbar'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import Switch from '@mui/material/Switch'

const ProjectCalendar = (props: CalenderProps<CalendarEventType, boolean>) => {
  // ** Props
  const {
    event,
    setYear,
    setMonth,
    direction,
    setCurrentListId,
    filter,
    setFilter,
    containerWidth,
  } = props

  const finalEvent = event.map(item => {
    return {
      ...item,
      start: item.orderDate,
      end: item?.deliveredDate ? item?.deliveredDate : item.dueDate,
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
    const currMonth = currDate.getMonth() + 1
    setYear(currYear)
    setMonth(currMonth)
  }

  // @ts-ignore
  return (
    <Calender ref={containerRef} width={containerWidth}>
      <CustomCalenderToolbar ref={calendarRef}>
        <Box
          display='flex'
          alignItems='center'
          gap='20px'
          justifyContent='right'
          paddingRight='20px'
        >
          <Typography>Hide completed projects</Typography>
          <Typography variant='body2'>(As of yesterday)</Typography>
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

export default ProjectCalendar
