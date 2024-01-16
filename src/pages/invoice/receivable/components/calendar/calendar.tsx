// ** React Import
import { useRef } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'

// ** style components
// ** types
import {
  InvoiceReceivableFilterType,
  InvoiceReceivableListType,
} from '@src/types/invoice/receivable.type'
import {
  Calender,
  CalenderProps,
  CustomEvent,
} from '@src/pages/quotes/lpm/requests/components/calendar/calendar'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import Switch from '@mui/material/Switch'
import CustomCalenderToolbar from '@src/pages/quotes/lpm/requests/components/calendar/customCalenderToolbar'
import { calendarDefaultOptions } from '@src/shared/const/calender'
import { CalendarOptions, DatesSetArg } from '@fullcalendar/core'

const ReceivableCalendar = (
  props: CalenderProps<InvoiceReceivableListType, InvoiceReceivableFilterType>,
) => {
  // ** Props
  const {
    event,
    setYear,
    setMonth,
    direction,
    setCurrentListId,
    containerWidth,
    setFilter,
    filter,
  } = props
  const now = new Date()
  const finalEvent = event.map(item => {
    return {
      ...item,
      title: item.projectName,
      start: item.updatedAt ?? new Date(),
      end: item.updatedAt ?? new Date(),
    }
  })

  // ** Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<FullCalendar>(null)

  const handleMonthClick = (arg: any) => {
    console.log(arg)
  }

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
    const nextButton = document.querySelector(
      '.fc-next-button',
    ) as HTMLButtonElement

    const prevButton = document.querySelector(
      '.fc-prev-button',
    ) as HTMLButtonElement

    const currDate = payload.view.currentStart
    const currYear = currDate.getFullYear()
    const currMonth = currDate.getMonth() + 1

    const todayYear = now.getFullYear()
    const todayMonth = now.getMonth() + 1

    const yearDifference = currYear - todayYear
    const monthDifference = currMonth - todayMonth

    const totalDifference = yearDifference * 12 + monthDifference

    const prevYearDifference = todayYear - currYear
    const prevMonthDifference = todayMonth - currMonth

    const prevTotalDifference = prevYearDifference * 12 + prevMonthDifference

    if (prevTotalDifference >= 24) {
      if (prevButton) {
        prevButton.disabled = true
      }
    } else {
      if (prevButton) {
        prevButton.disabled = false
      }
    }

    if (totalDifference >= 2) {
      if (nextButton) {
        nextButton.disabled = true
      }
    } else {
      if (nextButton) {
        nextButton.disabled = false
      }
    }

    setYear(currYear)
    setMonth(currMonth)
  }

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
          <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Typography>See only my invoices</Typography>
            <Switch
              checked={filter.mine === '1'}
              onChange={e =>
                setFilter({ ...filter, mine: e.target.checked ? '1' : '0' })
              }
            />
          </Box>
          <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Typography>Hide paid invoices</Typography>
            <Switch
              checked={filter.hidePaid === '1'}
              onChange={e =>
                setFilter({
                  ...filter,
                  hidePaid: e.target.checked ? '1' : '0',
                })
              }
            />
          </Box>
        </Box>
      </CustomCalenderToolbar>
      <FullCalendar {...calendarOptions} datesSet={handleMonthChange} />
    </Calender>
  )
}

export default ReceivableCalendar
