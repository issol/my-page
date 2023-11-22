// ** React Import
import { useRef } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar, { CalendarOptions, DatesSetArg } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

// ** style components
import styled from 'styled-components'
import { Box, Typography } from '@mui/material'

// ** types
import {
  InvoicePayableFilterType,
  InvoicePayableListType,
} from '@src/types/invoice/payable.type'
import {
  CalenderProps,
  Calender,
  CustomEvent,
} from '@src/pages/quotes/lpm/requests/components/calendar/calendar'
import { Role } from '@src/pages/invoice/payable/components/calendar/index'
import Switch from '@mui/material/Switch'
import CustomCalenderToolbar from '@src/pages/quotes/lpm/requests/components/calendar/customCalenderToolbar'
import { calendarDefaultOptions, ValidRange } from '@src/shared/const/calender'

interface Props
  extends CalenderProps<InvoicePayableListType, InvoicePayableFilterType> {
  type: Role
}

const PayableCalendar = (props: Props) => {
  // ** Props
  const {
    event,
    setYear,
    setMonth,
    direction,
    setCurrentListId,
    containerWidth,
    type,
    filter,
    setFilter,
  } = props

  const finalEvent = event.map(item => {
    return {
      ...item,
      title: item.pro?.name,
      start: item.statusUpdatedAt,
      end: item.statusUpdatedAt,
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
            gap: '20px',
          }}
        >
          {type === 'pro' ? null : (
            <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <Typography>See only my invoices</Typography>
              <Switch
                checked={filter.mine === '1'}
                onChange={e =>
                  setFilter({ ...filter, mine: e.target.checked ? '1' : '0' })
                }
              />
            </Box>
          )}

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

export default PayableCalendar
