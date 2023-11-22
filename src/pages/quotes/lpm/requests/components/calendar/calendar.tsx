// ** React Import
import { Dispatch, MutableRefObject, useEffect, useRef, useState } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar, { DatesSetArg } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import styled from 'styled-components'

import { CalendarEventType } from '@src/types/common/calendar.type'
import { Box, Typography } from '@mui/material'
import { RequestListType } from '@src/types/requests/list.type'
import dayjs from 'dayjs'
import Switch from '@mui/material/Switch'
import { RequestFilterType } from '@src/types/requests/filters.type'

import CustomCalenderToolbar from '@src/pages/quotes/lpm/requests/components/calendar/customCalenderToolbar'
import { CALENDER_MIN_WIDTH } from '@src/hooks/useCalenderResize'

export interface CalenderProps {
  event: Array<CalendarEventType<RequestListType>>
  setYear: (year: number) => void
  setMonth: (month: number) => void
  direction: string
  setCurrentListId: Dispatch<number | null>
  filter: RequestFilterType
  setFilter: Dispatch<RequestFilterType>
  containerWidth: number
}

const Calendar = (props: CalenderProps) => {
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

  const finalEvent = event.map(item => {
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
    direction,
    eventContent: (arg: any) => {
      return (
        <CustomEvent color={arg.event?._def?.extendedProps.calendar}>
          <span>{arg.event?._def?.title}</span>
        </CustomEvent>
      )
    },
    customButtons: {},
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
        <Box display='flex' alignItems='center'>
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
      </CustomCalenderToolbar>
      {/*@ts-ignore*/}
      <FullCalendar {...calendarOptions} datesSet={handleMonthChange} />
    </Calender>
  )
}

export default Calendar

const FullCalenderContainer = styled.div`
  .fc-time-grid .fc-slats {
    z-index: 4;
    pointer-events: none;
  }

  .fc-scroller.fc-time-grid-container {
    overflow: initial !important;
  }

  .fc-axis {
    position: sticky;
    left: 0;
  }

  & .fc-daygrid-day-top {
    & .fc-daygrid-day-number {
      padding: 0;
    }
  }

  & .fc-daygrid-day-frame {
    min-height: 125px;
    padding-top: 10px;
    padding-left: 14px;
    margin: 0 !important;
  }

  & .fc-day-past,
  & .fc-day-future {
    & .fc-daygrid-day-number {
      color: rgba(76, 78, 100, 0.6) !important;
    }
  }

  // 이미 지난 달에 대한 지난 날짜 표시
  & .fc-day-other {
    & .fc-daygrid-day-number {
      color: rgba(76, 78, 100, 0.38) !important;
    }
  }

  // 오늘 날짜에 대한 날짜 표시
  & .fc-day-today {
    background: #ffffff !important;

    & .fc-daygrid-day-number {
      font-weight: 600;
      color: rgba(102, 108, 255, 1) !important;
    }
  }

  & .fc-daygrid-day {
    padding: 0 !important;
  }

  & .fc-daygrid-event-harness,
  & .fc-daygrid-event {
    margin: 0 !important;
  }

  & .fc-daygrid-day-bottom {
    padding: 0;
    & .fc-daygrid-more-link {
      margin-left: 6.5px;
      font-weight: 500;
    }
  }

  & .fc-popover {
    min-width: 220px;
    overflow: hidden;
  }

  // 팝오버
  & .fc-popover-body {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px !important;
  }
`

export const Calender = styled(FullCalenderContainer)<{ width: number }>(
  ({ width }) => ({
    '.fc-view': {
      overflowX: 'auto',
    },
    '.fc-view > table': {
      width: `${width || CALENDER_MIN_WIDTH}px`,
    },
  }),
)

export const CustomEvent = styled(Box)<{ color: string }>`
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
    width: 95%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`
