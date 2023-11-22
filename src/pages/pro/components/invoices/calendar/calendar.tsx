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
import { ProInvoiceListType } from '@src/types/invoice/common.type'
import { InvoicePayableListType } from '@src/types/invoice/payable.type'

type Props = {
  event: Array<CalendarEventType<InvoicePayableListType>>
  setYear: (year: number) => void
  setMonth: (month: number) => void
  direction: string
  setCurrentListId: (id: number | null) => void
}

const ProInvoiceCalendar = (props: Props) => {
  // ** Props
  const { event, setYear, setMonth, direction, setCurrentListId } = props

  const finalEvent = event.map(item => {
    return {
      ...item,
      title: item.corporationId,
      start: item.invoicedAt,
      end: item?.paidAt ? item?.paidAt : item.payDueAt,
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
    //@ts-ignore
    <FullCalendar {...calendarOptions} datesSet={handleMonthChange} />
  )
}

export default ProInvoiceCalendar

const CustomEvent = styled(Box)<{ color: string }>`
  border-color: transparent !important;
  border-radius: 4px;
  padding: 1px 4px 4px;
  color: rgba(76, 78, 100, 0.87) !important;
  border-left: ${({ color }) => `6px solid ${color}`} !important;
  border-right: ${({ color }) => `6px solid ${color}`} !important;
  background: ${({ color }) =>
    `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${color}`} !important;
`
