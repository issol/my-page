import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { DatesSetArg } from '@fullcalendar/common'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { createPortal } from 'react-dom'

import {
  CalendarEventType,
  OffDayEventType,
} from '@src/types/common/calendar.type'
import { addOneDay } from '@src/shared/helpers/date.helper'
import { Card, Dialog, Tooltip } from '@mui/material'

type Props = {
  event: Array<CalendarEventType<OffDayEventType>>
  setYear: Dispatch<SetStateAction<number>>
  setMonth: Dispatch<SetStateAction<number>>
  onEventClick?: (event: any) => void
}

const WorkDaysCalendar = (props: Props) => {
  // ** Props
  const { event, setYear, setMonth } = props

  const finalEvent = event?.map(item => {
    return {
      ...item,
      overlap: false,
      //   display: 'inverse-background',
      display: 'background',
      title: item.reason,
      end: addOneDay(item.end),
      //   color:
      //     'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)),#72E128',
      color: '#777777',
    }
  })

  // ** Refs
  const calendarRef = useRef()

  const calendarOptions = {
    events: finalEvent || [],
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      //   start: 'sidebarToggle, prev, next, title',
      start: 'sidebarToggle, prev, title, next',
      end: '',
    },

    eventResizableFromStart: true,
    ref: calendarRef,
    contentHeight: 315,

    eventClick(info: any) {
      console.log('cl', calendarRef)
      if (props?.onEventClick) {
        props.onEventClick(info)
      }
    },
    // dateClick(info: any) {
    //   console.log('dateClick', info)
    // },

    eventMouseEnter(info: any) {
      const eventEl = info.el
      const eventTitle = info?.event?._def?.title

      if (!eventTitle) return
      // 툴팁 엘리먼트 생성 및 위치 설정
      const tooltip = document.createElement('div')
      tooltip.className = 'tooltip'
      tooltip.textContent = eventTitle
      eventEl.appendChild(tooltip)
    },

    eventMouseLeave() {
      const tooltips = document.getElementsByClassName('tooltip')
      const menus = document.getElementsByClassName('popup-menu')
      Array.from(tooltips).forEach(tooltip => {
        tooltip.remove()
      })
      Array.from(menus).forEach(menu => {
        menu.remove()
      })
    },
  }

  async function handleMonthChange(payload: DatesSetArg) {
    const currDate = payload.view.currentStart
    const currYear = currDate.getFullYear()
    const currMonth = currDate.getMonth()
    setYear(currYear)
    setMonth(currMonth)
  }

  //@ts-ignore
  return <FullCalendar {...calendarOptions} datesSet={handleMonthChange} />
}

export default WorkDaysCalendar
