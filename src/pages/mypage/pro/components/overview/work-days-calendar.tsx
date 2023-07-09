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

/**
 * event : 달력에 보여줄 off day 데이터
 * setYear , setMonth : 달력 날짜를 바꿀 때마다 서버에 요청으로 보낼 파라미터
 * onEventClick : 달력에 off day를 클릭하면 실행 될 함수. optional. 함수를 보내지 않으면 클릭 시 아무 일도 실행되지 않음.
 * showToolbar : off day에 대한 reason을 tooltip으로 보여줄지 여부에 대한 값
 */
type Props = {
  event: Array<CalendarEventType<OffDayEventType>>
  year: number
  month: number
  setYear: Dispatch<SetStateAction<number>>
  setMonth: Dispatch<SetStateAction<number>>
  onEventClick?: (event: any) => void
  showToolbar: boolean
}

const WorkDaysCalendar = (props: Props) => {
  // ** Props
  const { event, year, month, setYear, setMonth, showToolbar } = props
  const cYear = new Date().getFullYear()
  const cMonth = new Date().getMonth() + 1
  const isEditDisabled = (cYear == year && cMonth < month) || cYear < year
  console.log('isEditDisabled', isEditDisabled, year, month)
  const finalEvent = event?.map(item => {
    return {
      ...item,
      overlap: false,
      //   display: 'inverse-background',
      display: 'background',
      //   title: item.reason,
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
      start: 'sidebarToggle, prev, title, next',
      end: '',
    },
    ref: calendarRef,
    contentHeight: 315,

    eventClick(info: any) {
      let eventEl = info.el

      if (!props?.onEventClick || isEditDisabled) return
      makeMenuElement(eventEl)

      //   if (props?.onEventClick) {
      //     props.onEventClick(info)
      //   }
    },

    eventMouseEnter(info: any) {
      if (!showToolbar) return
      const eventEl = info.el
      const reason = info?.event?._def?.extendedProps?.reason

      if (!reason) return
      // 툴팁 엘리먼트 생성 및 위치 설정
      const tooltip = document.createElement('div')
      tooltip.className = 'tooltip'
      tooltip.textContent = reason
      eventEl.appendChild(tooltip)
    },

    eventMouseLeave() {
      const menus = document.getElementsByClassName('offdays-menu')
      Array.from(menus).forEach(menu => {
        menu.remove()
      })
      if (!showToolbar) return
      const tooltips = document.getElementsByClassName('tooltip')
      Array.from(tooltips).forEach(tooltip => {
        tooltip.remove()
      })
    },
  }

  async function handleMonthChange(payload: DatesSetArg) {
    const currDate = payload.view.currentStart
    const currYear = currDate.getFullYear()
    const currMonth = currDate.getMonth() + 1
    setYear(currYear)
    setMonth(currMonth)
  }

  function makeMenuElement(eventEl: any) {
    // 메뉴 엘리먼트 생성 및 위치 설정
    let menu = document.createElement('div')
    menu.className = 'offdays-menu'
    const isExist = document.getElementsByClassName('offdays-menu')

    let box1 = document.createElement('div')
    box1.className = 'box'
    box1.textContent = 'Edit'
    menu.appendChild(box1)
    let box2 = document.createElement('div')
    box2.className = 'box'
    box2.textContent = 'Delete'
    menu.appendChild(box2)

    if (isExist?.length) return
    const parentEl =
      eventEl.parentElement.parentElement.parentElement.parentElement
        .parentElement.parentElement

    const rect = eventEl.getBoundingClientRect()
    console.log('rect', rect)
    menu.style.position = 'absolute'
    adjustPosition(menu, rect)
    parentEl.appendChild(menu)
  }

  function adjustPosition(menu: HTMLDivElement, rect: DOMRect) {
    if (rect.x > 330) {
      menu.style.left = Number(Number(rect.left) / 1.6).toString() + 'px'
    } else {
      menu.style.left = Number(Number(rect.left)).toString() + 'px'
    }
    if (rect.y > 400) {
      menu.style.top = Number(Number(rect.top) / 1).toString() + 'px'
    }
    menu.style.top = Number(Number(rect.top) / 5).toString() + 'px'
  }

  //@ts-ignore
  return <FullCalendar {...calendarOptions} datesSet={handleMonthChange} />
}

export default WorkDaysCalendar
