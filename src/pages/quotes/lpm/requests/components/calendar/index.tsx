// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Card } from '@mui/material'

// ** components
import List from '../list'
import CalendarStatusSideBar from '@src/pages/components/sidebar/status-sidebar'
import Calendar from './calendar'

// ** Hooks
import { useSettings } from '@src/@core/hooks/useSettings'

// ** FullCalendar & App Components Imports
import CalendarWrapper from '@src/@core/styles/libs/fullcalendar'

// ** apis

// ** values
import { ClientRequestCalendarStatus } from '@src/shared/const/status/statuses'

// ** types
import { RequestFilterType } from '@src/types/requests/filters.type'
import { CalendarEventType } from '@src/types/common/calendar.type'
import { RequestListType } from '@src/types/requests/list.type'
import { useRouter } from 'next/router'
import {
  useGetClientRequestCalendarData,
  useGetClientRequestStatus,
} from '@src/queries/requests/client-request.query'
import { getRequestListColumns } from '@src/shared/const/columns/requests'
import { getCurrentRole } from '@src/shared/auth/storage'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import useCalenderResize from '@src/hooks/useCalenderResize'
import { timezoneSelector } from '@src/states/permission'

const CalendarContainer = () => {
  // ** Hooks
  const { settings } = useSettings()
  const router = useRouter()
  const currentRole = getCurrentRole()
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

  // ** calendar values
  const leftSidebarWidth = 260
  const { skin, direction } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  // ** custom hooks
  const { containerRef, containerWidth } = useCalenderResize()

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth())
  const [filter, setFilter] = useState<RequestFilterType | null>({
    mine: '0',
    hideCompleted: '0',
    skip: 0,
    take: 200,
  })

  const { data, isLoading } = useGetClientRequestCalendarData(
    year,
    month,
    filter!,
  )

  const { data: statusList, isLoading: statusListLoading } =
    useGetClientRequestStatus()
  const [event, setEvent] = useState<Array<CalendarEventType<RequestListType>>>(
    [],
  )

  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const [currentListId, setCurrentListId] = useState<null | number>(null)
  const [currentList, setCurrentList] = useState<
    Array<CalendarEventType<RequestListType>>
  >([])

  function onRowClick(id: number) {
    router.push(`/quotes/lpm/requests/${id}`)
  }

  useEffect(() => {
    if (currentListId && data?.data) {
      setCurrentList(data?.data.filter(item => item.id === currentListId))
    }
  }, [currentListId])

  useEffect(() => {
    if (data?.data?.length) {
      setEvent([...data.data])
    } else {
      setEvent([])
    }
  }, [data])

  return (
    <Box>
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
        <CalendarStatusSideBar
          alertIconStatus='Canceled'
          status={ClientRequestCalendarStatus}
          mdAbove={mdAbove}
          leftSidebarWidth={leftSidebarWidth}
          title='Request'
        />

        <Box
          ref={containerRef}
          sx={{
            width: '100%',
            px: 5,
            pt: 3.75,
            borderRadius: 1,
            boxShadow: 'none',
            backgroundColor: 'background.paper',
            ...(mdAbove
              ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
              : {}),
          }}
        >
          <Calendar
            event={event}
            setYear={setYear}
            setMonth={setMonth}
            direction={direction}
            setCurrentListId={setCurrentListId}
            filter={filter!}
            setFilter={setFilter}
            containerWidth={containerWidth}
          />
        </Box>
      </CalendarWrapper>

      {currentListId === null ? null : (
        <Card sx={{ background: 'white', marginTop: 10 }}>
          <List
            page={skip}
            setPage={setSkip}
            pageSize={pageSize}
            setPageSize={setPageSize}
            filters={filter!}
            setFilters={setFilter}
            statusList={statusList || []}
            list={
              currentList?.length
                ? {
                    data: currentList,
                    count: currentList?.length,
                    totalCount: currentList?.length,
                  }
                : { data: [], count: 0, totalCount: 0 }
            }
            onRowClick={onRowClick}
            isLoading={isLoading}
            role={currentRole!}
            type='calendar'
          />
        </Card>
      )}
    </Box>
  )
}

export default CalendarContainer
