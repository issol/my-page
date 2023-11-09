// ** React Import
import { useRef } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar, { DatesSetArg } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

// ** style components
import styled from 'styled-components'
import { Box } from '@mui/material'

// ** types
import { CalendarEventType } from '@src/types/common/calendar.type'
import { InvoiceReceivableListType } from '@src/types/invoice/receivable.type'

type Props = {
  event: Array<CalendarEventType<InvoiceReceivableListType>>
  setYear: (year: number) => void
  setMonth: (month: number) => void
  direction: string
  setCurrentListId: (id: number | null) => void
}

const ReceivableCalendar = (props: Props) => {
  // ** Props
  const { event, setYear, setMonth, direction, setCurrentListId } = props
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
  const calendarRef = useRef()

  const handleMonthClick = (arg: any) => {
    console.log(arg)
  }

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
    //@ts-ignore
    <FullCalendar {...calendarOptions} datesSet={handleMonthChange} />
  )
}

export default ReceivableCalendar

const CustomEvent = styled(Box)<{ color: string }>`
  border-color: transparent !important;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
  padding: 1px 4px 4px;
  color: rgba(76, 78, 100, 0.87) !important;
  border-left: ${({ color }) => `6px solid ${color}`} !important;
  // border-right: ${({ color }) => `6px solid ${color}`} !important;
  background: ${({ color }) =>
    `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${color}`} !important;
`
