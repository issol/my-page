// ** React Import
import { useRef } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar, { DatesSetArg } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import styled from 'styled-components'

import { CalendarEventType } from '@src/types/common/calendar.type'
import { Box } from '@mui/material'
import { RequestListType } from '@src/types/requests/list.type'
import { CalendarOptions } from '@fullcalendar/common'

type Props = {
  event: Array<CalendarEventType<RequestListType>>
  setYear: (year: number) => void
  setMonth: (month: number) => void
  direction: string
  setCurrentListId: (id: number) => void
}

const Calendar = (props: Props) => {
  // ** Props
  const { event, setYear, setMonth, direction, setCurrentListId } = props

  const finalEvent: any = event.map(item => {
    return {
      ...item,
      title: item.items.length ? item.items[0].name : '',
      start: item.statusUpdatedAt,
      end: item.statusUpdatedAt,
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
  return <FullCalendar {...calendarOptions} datesSet={handleMonthChange} />
}

export default Calendar

const CustomEvent = styled(Box)<{ color: string }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 20px;
  padding: 0 10px;
  border-color: transparent !important;
  overflow: hidden;
  color: rgba(76, 78, 100, 0.87) !important;
  border-left: ${({ color }) => `6px solid ${color}`} !important;
  background: ${({ color }) =>
    `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${color}`} !important;

  & > span {
    display: block;
    width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`
