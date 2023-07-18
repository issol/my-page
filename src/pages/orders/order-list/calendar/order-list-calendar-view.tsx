// ** React Import
import { useRef } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar, { DatesSetArg } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import styled from 'styled-components'
import { QuotesListType } from '@src/types/common/quotes.type'
import { CalendarEventType } from '@src/types/common/calendar.type'
import { Box } from '@mui/material'
import { OrderListType } from '@src/types/orders/order-list'

type Props = {
  event: Array<CalendarEventType<OrderListType>>
  setYear: (year: number) => void
  setMonth: (month: number) => void
  direction: string
  setCurrentListId: (id: number) => void
}

const Calendar = (props: Props) => {
  // ** Props
  const { event, setYear, setMonth, direction, setCurrentListId } = props
  console.log(event)

  const finalEvent = event.map(item => {
    return {
      ...item,
      title: item.projectName ?? '',
      start: item.orderedAt ?? new Date(),
      end: item.orderedAt ?? new Date(),
    }
  })

  // ** Refs
  const calendarRef = useRef()

  const calendarOptions = {
    events: finalEvent,
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: 'sidebarToggle, prev, next, title',
      end: '',
    },

    dayMaxEvents: 3,
    eventResizableFromStart: true,
    ref: calendarRef,
    direction,
    eventContent: (arg: any) => {
      return (
        <CustomEvent color={arg.event?._def?.extendedProps.calendar}>
          {arg.event?._def?.title}
        </CustomEvent>
      )
    },

    eventClick({ event }: any) {
      console.log(event.id)

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
    //@ts-ignore
    <FullCalendar {...calendarOptions} datesSet={handleMonthChange} />
  )
}

export default Calendar

const CustomEvent = styled(Box)<{ color: string }>`
  border-color: transparent !important;

  padding: 1px 4px 4px;
  color: rgba(76, 78, 100, 0.87) !important;
  border-left: ${({ color }) => `6px solid ${color}`} !important;

  background: ${({ color }) =>
    `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${color}`} !important;
`
