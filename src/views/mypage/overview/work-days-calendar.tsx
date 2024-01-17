import { Dispatch, SetStateAction, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import { CalendarOptions, DatesSetArg } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

import {
  CalendarEventType,
  OffDayEventType,
} from '@src/types/common/calendar.type'
import { addOneDay } from '@src/shared/helpers/date.helper'
import { calendarDefaultOptions } from '@src/shared/const/calender'
import dayjs from 'dayjs'

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
  onEventClick?: (type: 'edit' | 'delete', info: OffDayEventType) => void
  showToolbar: boolean
  showReason?: boolean
}

const WorkDaysCalendar = (props: Props) => {
  // ** Props
  const {
    event,
    year,
    month,
    setYear,
    setMonth,
    showToolbar,
    showReason = false,
  } = props
  const cYear = new Date().getFullYear()
  const cMonth = new Date().getMonth() + 1
  const isEditDisabled = (cYear === year && cMonth > month) || cYear > year

  const finalEvent = event?.map(item => {
    return {
      ...item,
      overlap: false,
      display: 'background',
      end: addOneDay(item.end),
      color: '#777777',
    }
  })

  // ** Refs
  const calendarRef = useRef<FullCalendar>(null)

  const editBtn = document.getElementsByClassName('off-edit')
  const deleteBtn = document.getElementsByClassName('off-delete')

  const calendarOptions: CalendarOptions = {
    ...calendarDefaultOptions,
    validRange: {
      start: dayjs().add(-12, 'month').format('YYYY-MM-DD'),
      end: dayjs().add(12, 'month').format('YYYY-MM-DD'),
    },
    ref: calendarRef,
    events: (finalEvent || []) as CalendarOptions['events'],
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      start: 'sidebarToggle, prev, title, next',
      center: '',
      end: '',
    },

    contentHeight: 315,
    eventClick(info: any) {
      let eventEl = info.el

      if (
        !props?.onEventClick ||
        isEditDisabled ||
        !info?.event?._def?.publicId
      )
        return

      makeMenuElement(eventEl)
      if (
        props?.onEventClick !== undefined &&
        editBtn?.length &&
        deleteBtn?.length
      ) {
        const data = {
          id: Number(info?.event?._def?.publicId),
          reason: info?.event?._def?.extendedProps?.reason,
          start: info?.event?._instance?.range?.start,
          end: info?.event?._instance?.range?.end,
        }
        editBtn[0].addEventListener('click', () => {
          removeMenu()
          // @ts-ignore
          props?.onEventClick('edit', data)
        })
        deleteBtn[0].addEventListener('click', () => {
          removeMenu()
          // @ts-ignore
          props?.onEventClick('delete', data)
        })
      }
    },

    eventMouseEnter(info: any) {
      if (!showToolbar) return
      const eventEl = info.el
      const reason = info?.event?._def?.extendedProps?.reason

      if (!reason || !showReason) return
      // 툴팁 엘리먼트 생성 및 위치 설정
      const tooltip = document.createElement('div')
      tooltip.className = 'tooltip'
      tooltip.textContent = reason
      eventEl.appendChild(tooltip)
    },

    eventMouseLeave() {
      if (!showToolbar) return
      const tooltips = document.getElementsByClassName('tooltip')
      Array.from(tooltips).forEach(tooltip => {
        tooltip.remove()
      })
    },
  }

  const handleMonthChange = async (payload: DatesSetArg) => {
    const currDate = payload.view.currentStart
    const currYear = currDate.getFullYear()
    const currMonth = currDate.getMonth() + 1
    setYear(currYear)
    setMonth(currMonth)
  }

  const makeMenuElement = (eventEl: any) => {
    // 메뉴 엘리먼트 생성 및 위치 설정
    let menu = document.createElement('div')
    menu.className = 'offdays-menu'
    const isExist = document.getElementsByClassName('offdays-menu')

    let box1 = document.createElement('div')
    box1.className = 'off-edit'
    box1.textContent = 'Edit'
    menu.appendChild(box1)
    let box2 = document.createElement('div')
    box2.className = 'off-delete'
    box2.textContent = 'Delete'
    menu.appendChild(box2)

    if (isExist?.length) {
      removeMenu()
      return
    }
    const parentEl =
      eventEl.parentElement.parentElement.parentElement.parentElement
        .parentElement.parentElement

    const rect = eventEl.getBoundingClientRect()

    menu.style.position = 'fixed'

    menu.style.top = rect.top - 85 + 'px'
    menu.style.left = rect.left - 40 + 'px'
    parentEl.appendChild(menu)
  }

  const removeMenu = () => {
    const menus = document.getElementsByClassName('offdays-menu')
    Array.from(menus).forEach(menu => {
      menu.remove()
    })
  }

  return <FullCalendar {...calendarOptions} datesSet={handleMonthChange} />
}

export default WorkDaysCalendar
