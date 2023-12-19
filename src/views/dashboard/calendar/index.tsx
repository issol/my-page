import Calendar from '@src/views/dashboard/calendar/calender'
import { Suspense, useEffect, useState } from 'react'
import useCalenderResize from '@src/hooks/useCalenderResize'
import Box from '@mui/material/Box'
import CalendarWrapper from '@src/@core/styles/libs/fullcalendar'
import {
  ProJobCalendarResult,
  useProJonCalendar,
} from '@src/queries/dashboard/dashnaord-lpm'
import { TotalAmountQuery } from '@src/types/dashboard'
import { useGetStatusList } from '@src/queries/common.query'
import {
  getJobStatusColor,
  getOrderStatusColor,
} from '@src/shared/helpers/colors.helper'
import { JobStatusType } from '@src/types/jobs/jobs.type'
import CalendarStatusSideBar from '@src/pages/components/sidebar/status-sidebar'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import { CalendarEventType } from '@src/types/common/calendar.type'
import { useSettings } from '@src/@core/hooks/useSettings'

const StatusSort = []

const ProCalendar = (params: Omit<TotalAmountQuery, 'amountType'>) => {
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const { containerRef, containerWidth } = useCalenderResize()
  const { data, isSuccess } = useProJonCalendar(params)
  const { data: statusList } = useGetStatusList('Job')
  const { settings } = useSettings()

  const { skin, direction } = settings

  const [event, setEvent] = useState<
    Array<CalendarEventType<ProJobCalendarResult>>
  >([])
  const [statuses, setStatuses] = useState<
    Array<{ color: string; value: number; label: string }>
  >([])

  useEffect(() => {
    if (!statusList || statusList?.length === 0) {
      setStatuses([])
      return
    }

    const items = statusList.map(item => {
      let Label = item.label
      if (item.label === 'Delivered') Label = `${item.label} to LPM`
      if (item.label === 'Requested') Label = `${item.label} from LPM`
      return {
        ...item,
        label: Label,
        color: getJobStatusColor(item.value as JobStatusType),
      }
    })

    setStatuses(items)
  }, [statusList])

  useEffect(() => {
    if (!isSuccess || data?.length === 0) {
      setEvent([])
      return
    }

    if (!Array.isArray(data)) return

    const eventsList = data.map(item => {
      return {
        ...item,
        extendedProps: {
          calendar: getJobStatusColor(item.status as JobStatusType),
        },
        allDay: true,
      }
    })

    setEvent(eventsList)
  }, [data, isSuccess])

  return (
    <Box sx={{ width: '100%', backgroundColor: '#fff' }}>
      <CalendarWrapper
        className='app-calendar'
        sx={{
          boxShadow: skin === 'bordered' ? 0 : 6,
          ...(skin === 'bordered' && {
            border: theme => `1px solid ${theme.palette.divider}`,
          }),
          '& .fc-daygrid-event-harness': {
            '& .fc-event': {
              padding: '0 !important',
            },
            '.fc-h-event': {
              border: 'none',
            },
          },
        }}
      >
        <Box
          sx={{
            width: '280px',
          }}
        >
          <Suspense>
            <CalendarStatusSideBar
              alertIconStatus='Canceled'
              status={statuses!}
              mdAbove={mdAbove}
              leftSidebarWidth={280}
              title='Job'
            />
          </Suspense>
        </Box>
        <Box ref={containerRef} sx={{ width: '100%', height: '876px' }}>
          <Calendar containerWidth={containerWidth + 40} event={event} />
        </Box>
      </CalendarWrapper>
    </Box>
  )
}

export default ProCalendar
