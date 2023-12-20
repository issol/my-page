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
import { getProJobStatusColor } from '@src/shared/helpers/colors.helper'
import CalendarStatusSideBar from '@src/pages/components/sidebar/status-sidebar'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import { CalendarEventType } from '@src/types/common/calendar.type'
import { useSettings } from '@src/@core/hooks/useSettings'
import uniqBy from 'lodash/uniqBy'
import { ProJobStatusType } from '@src/types/jobs/common.type'

const statusObject: Record<string, number> = {
  'Requested from LPM': 1,
  'Awaiting approval': 2,
  'In progress': 3,
  'Job overdue': 4,
  'Delivered to LPM': 5,
  Approved: 6,
  Invoiced: 7,
  Paid: 8,
  'Without invoice': 9,
  Unassigned: 10,
  Declined: 11,
  Canceled: 12,
}

const ProCalendar = (params: Omit<TotalAmountQuery, 'amountType'>) => {
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const { containerRef, containerWidth } = useCalenderResize()
  const { data, isSuccess } = useProJonCalendar(params)
  const { data: jobStatusList } = useGetStatusList('Job')
  const { data: jobAssignmentStatusList } = useGetStatusList('JobAssignment')
  const { settings } = useSettings()

  const { skin, direction } = settings

  const [event, setEvent] = useState<
    Array<CalendarEventType<ProJobCalendarResult>>
  >([])
  const [statuses, setStatuses] = useState<
    Array<{ color: string; value: number; label: string }>
  >([])

  useEffect(() => {
    if (
      !jobStatusList ||
      jobStatusList?.length === 0 ||
      !jobAssignmentStatusList ||
      jobAssignmentStatusList?.length === 0
    ) {
      setStatuses([])
      return
    }

    const list = [...jobStatusList, ...jobAssignmentStatusList] as Array<{
      color: string
      value: number
      label: string
    }>

    const filter = uniqBy(list, 'label')

    const items = filter
      .map(item => {
        let Label = item.label
        const sort = statusObject[Label]
        return {
          ...item,
          label: Label,
          color: getProJobStatusColor(item.value as ProJobStatusType),
          sort: statusObject[Label],
        }
      })
      .filter(item => item.sort) as Array<{
      color: string
      value: number
      label: string
      sort: number
    }>

    setStatuses(items.sort((a, b) => a.sort - b.sort))
  }, [jobStatusList])

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
          calendar: getProJobStatusColor(item.status as ProJobStatusType),
        },
        allDay: true,
      }
    }) as Array<CalendarEventType<ProJobCalendarResult>>

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
