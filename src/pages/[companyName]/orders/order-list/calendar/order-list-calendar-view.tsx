// ** React Import
import { ChangeEvent, useRef } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'
import { CalendarOptions, DatesSetArg } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import { OrderListType } from '@src/types/orders/order-list'
import {
  Calender,
  CalenderProps,
  CustomEvent,
} from 'src/pages/[companyName]/quotes/lpm/requests/components/calendar/calendar'
import CustomCalenderToolbar from 'src/pages/[companyName]/quotes/lpm/requests/components/calendar/customCalenderToolbar'
import { Box } from '@mui/system'
import { Switch, Typography } from '@mui/material'
import { calendarDefaultOptions } from '@src/shared/const/calender'

interface Props
  extends Omit<CalenderProps<OrderListType, boolean>, 'filter' | 'setFilter'> {
  seeMyOrders: boolean
  handleSeeMyOrders: (event: ChangeEvent<HTMLInputElement>) => void
  hideCompletedOrders: boolean
  handleHideCompletedOrders: (event: ChangeEvent<HTMLInputElement>) => void
}

const Calendar = (props: Props) => {
  // ** Props
  const {
    event,
    setYear,
    setMonth,
    direction,
    setCurrentListId,
    seeMyOrders,
    handleSeeMyOrders,
    handleHideCompletedOrders,
    hideCompletedOrders,
    containerWidth,
  } = props
  // console.log(event)

  const finalEvent = event.map(item => {
    return {
      ...item,
      title: item.projectName ?? '',
      start: item.orderedAt ?? new Date(),
      end: item.orderedAt ?? new Date(),
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '24px',
          }}
        >
          <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Typography>See only my orders</Typography>
            <Switch checked={seeMyOrders} onChange={handleSeeMyOrders} />
          </Box>
          <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Typography>Hide completed orders</Typography>
            <Switch
              checked={hideCompletedOrders}
              onChange={handleHideCompletedOrders}
            />
          </Box>
        </Box>
      </CustomCalenderToolbar>
      <FullCalendar {...calendarOptions} datesSet={handleMonthChange} />
    </Calender>
  )
}

export default Calendar
