// ** React Import
import { useRef } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar, { DatesSetArg } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {
  Calender,
  CalenderProps,
  CustomEvent,
} from '@src/pages/quotes/lpm/requests/components/calendar/calendar'
import CustomCalenderToolbar from '@src/pages/quotes/lpm/requests/components/calendar/customCalenderToolbar'
import { Box, Typography } from '@mui/material'
import Switch from '@mui/material/Switch'
import { RequestListType } from '@src/types/requests/list.type'
import { RequestFilterType } from '@src/types/requests/filters.type'

const Calendar = (props: CalenderProps<RequestListType, RequestFilterType>) => {
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

  const finalEvent: any = event.map(item => {
    return {
      ...item,
      title: item.items.length ? item.items[0].name : '',
      start: item.statusUpdatedAt,
      end: item.statusUpdatedAt,
    }
  })

  // ** Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<FullCalendar>(null)

  const calendarOptions = {
    events: finalEvent,
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: '',
      end: '',
    },
    dayMaxEvents: 3,
    eventResizableFromStart: true,
    ref: calendarRef,
    direction: direction as any,
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
        <Box display='flex' alignItems='center' gap={20}>
          <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Typography>See only my requests</Typography>
            <Switch
              checked={filter.mine === '1'}
              onChange={e => {
                setFilter({
                  ...filter,
                  mine: e.target.checked ? '1' : '0',
                })
                setCurrentListId(null)
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Typography>Hide completed requests</Typography>
            <Switch
              checked={filter.hideCompleted === '1'}
              onChange={e => {
                setCurrentListId(null)
                setFilter({
                  ...filter,
                  hideCompleted: e.target.checked ? '1' : '0',
                })
              }}
            />
          </Box>
        </Box>
      </CustomCalenderToolbar>
      {/*@ts-ignore*/}
      <FullCalendar {...calendarOptions} datesSet={handleMonthChange} />
    </Calender>
  )
}

export default Calendar
