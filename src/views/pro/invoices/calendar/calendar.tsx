// ** React Import
import { useRef } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar, { CalendarOptions, DatesSetArg } from '@fullcalendar/react'

// ** style components
import { Box, Typography } from '@mui/material'

// ** types
import {
  InvoicePayableFilterType,
  InvoicePayableListType,
} from '@src/types/invoice/payable.type'
import { calendarDefaultOptions } from '@src/shared/const/calender'
import {
  Calender,
  CalenderProps,
  CustomEvent,
} from '@src/pages/quotes/lpm/requests/components/calendar/calendar'
import CustomCalenderToolbar from '@src/pages/quotes/lpm/requests/components/calendar/customCalenderToolbar'
import Switch from '@mui/material/Switch'

const ProInvoiceCalendar = (
  props: CalenderProps<InvoicePayableListType, InvoicePayableFilterType>,
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
      title: item.corporationId,
      start: item.invoicedAt,
      end: item?.paidAt ? item?.paidAt : item.payDueAt,
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
                setFilter({ ...filter, hidePaid: e.target.checked ? '1' : '0' })
              }
            />
          </Box>
        </Box>
      </CustomCalenderToolbar>
      <FullCalendar {...calendarOptions} datesSet={handleMonthChange} />
    </Calender>
  )
}

export default ProInvoiceCalendar
