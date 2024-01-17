// ** React Import
import { Dispatch, useRef } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'
import { QuotesListType } from '@src/types/common/quotes.type'
import { Box, Typography } from '@mui/material'
import {
  Calender,
  CalenderProps,
  CustomEvent,
} from '@src/pages/quotes/lpm/requests/components/calendar/calendar'
import { QuotesFilterType } from '@src/types/quotes/quote'
import Switch from '@mui/material/Switch'
import CustomCalenderToolbar from '@src/pages/quotes/lpm/requests/components/calendar/customCalenderToolbar'
import { calendarDefaultOptions } from '@src/shared/const/calender'
import { DatesSetArg } from '@fullcalendar/core'

type BooleanNumber = 0 | 1

interface QuoteCalender
  extends Omit<
    CalenderProps<QuotesListType, QuotesFilterType>,
    'filter' | 'setFilter'
  > {
  seeMyQuotes: BooleanNumber
  setSeeMyQuotes: Dispatch<BooleanNumber>
  hideCompletedQuotes: BooleanNumber
  setHideCompletedQuotes: Dispatch<BooleanNumber>
}

const Calendar = (props: QuoteCalender) => {
  // ** Props
  const {
    event,
    setYear,
    setMonth,
    direction,
    setCurrentListId,
    seeMyQuotes,
    setSeeMyQuotes,
    hideCompletedQuotes,
    setHideCompletedQuotes,
    containerWidth,
  } = props

  const finalEvent = event.map(item => {
    return {
      ...item,
      title: item.projectName ?? '',
      start: item.updatedAt ?? new Date(),
      end: item.updatedAt ?? new Date(),
    }
  })

  // ** Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<FullCalendar>(null)

  const calendarOptions = {
    ...calendarDefaultOptions,
    events: finalEvent,
    ref: calendarRef,
    direction,
    eventOrder: 'sortIndex',
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
          display='flex'
          alignItems='center'
          gap='20px'
          paddingRight='20px'
          justifyContent='right'
        >
          <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Typography>See only my quotes</Typography>
            <Switch
              checked={seeMyQuotes === 1}
              onChange={e => setSeeMyQuotes(e.target.checked ? 1 : 0)}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Typography>Hide completed quotes</Typography>
            <Switch
              checked={hideCompletedQuotes === 1}
              onChange={e => setHideCompletedQuotes(e.target.checked ? 1 : 0)}
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
