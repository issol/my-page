// ** React Import
import { useRef } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'

// ** types
import { ClientInvoiceCalendarEventType } from '@src/apis/client.api'
import { calendarDefaultOptions } from '@src/shared/const/calender'
import {
  Calender,
  CalenderProps,
  CustomEvent,
} from '@src/pages/quotes/lpm/requests/components/calendar/calendar'
import { Box, Typography } from '@mui/material'
import Switch from '@mui/material/Switch'
import CustomCalenderToolbar from '@src/pages/quotes/lpm/requests/components/calendar/customCalenderToolbar'
import { CalendarOptions, DatesSetArg } from '@fullcalendar/core'

const ClientInvoiceCalendar = (
  props: CalenderProps<ClientInvoiceCalendarEventType, boolean>,
) => {
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
      start: item.updatedAt,
      end: item.updatedAt,
      title: item.orders?.projectName ?? '-',
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

  return (
    <Calender ref={containerRef} width={containerWidth}>
      <CustomCalenderToolbar ref={calendarRef}>
        <Box display='flex' alignItems='center'>
          <Typography>Hide paid invoices</Typography>
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

export default ClientInvoiceCalendar
