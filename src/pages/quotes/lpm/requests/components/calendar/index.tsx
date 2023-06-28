// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Switch from '@mui/material/Switch'
import { Typography } from '@mui/material'

// ** components
import List from '../list'
import CalendarStatusSideBar from '@src/pages/components/sidebar/status-sidebar'
import Calendar from './calendar'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** FullCalendar & App Components Imports
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'

// ** apis
import { useGetProjectCalendarData } from '@src/queries/pro-project/project.query'

// ** values
import { ClientRequestCalendarStatus } from '@src/shared/const/status/statuses'

// ** types
import { RequestFilterType } from '@src/types/requests/filters.type'
import { CalendarEventType } from '@src/types/common/calendar.type'
import { RequestListType } from '@src/types/requests/list.type'
import { useRouter } from 'next/router'
import { useGetClientRequestCalendarData } from '@src/queries/requests/client-request.query'

const CalendarContainer = () => {
  // ** Hooks
  const { settings } = useSettings()
  const router = useRouter()

  // ** calendar values
  const leftSidebarWidth = 260
  const { skin, direction } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth())
  const [filter, setFilter] = useState<RequestFilterType>({
    mine: 0,
    hideCompleted: 0,
    skip: 0,
    take: 10,
  })

  const { data, isLoading } = useGetClientRequestCalendarData(
    year,
    month,
    filter,
  )
  const [event, setEvent] = useState<Array<CalendarEventType<RequestListType>>>(
    [],
  )

  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const [currentListId, setCurrentListId] = useState<null | number>(null)
  const [currentList, setCurrentList] = useState<
    Array<CalendarEventType<RequestListType>>
  >([])

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

  function onRowClick(id: number) {
    router.push(`/quotes/requests/${id}`)
  }

  return (
    <Box>
      <CalendarWrapper
        className='app-calendar'
        sx={{
          boxShadow: skin === 'bordered' ? 0 : 6,
          ...(skin === 'bordered' && {
            border: theme => `1px solid ${theme.palette.divider}`,
          }),
        }}
      >
        <CalendarStatusSideBar
          alertIconStatus=''
          status={ClientRequestCalendarStatus}
          mdAbove={mdAbove}
          leftSidebarWidth={leftSidebarWidth}
        />
        <Box
          sx={{
            px: 5,
            pt: 3.75,
            flexGrow: 1,
            borderRadius: 1,
            boxShadow: 'none',
            backgroundColor: 'background.paper',
            ...(mdAbove
              ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
              : {}),
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '24px',
            }}
          >
            <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <Typography>Hide completed requests</Typography>
              <Switch
                checked={filter.hideCompleted === 1}
                onChange={e =>
                  setFilter({
                    ...filter,
                    hideCompleted: e.target.checked ? 1 : 0,
                  })
                }
              />
            </Box>
          </Box>
          <Calendar
            event={event}
            setYear={setYear}
            setMonth={setMonth}
            direction={direction}
            setCurrentListId={setCurrentListId}
          />
        </Box>
      </CalendarWrapper>

      <Box mt={10} sx={{ background: 'white' }}>
        <List
          skip={skip}
          setSkip={setSkip}
          pageSize={pageSize}
          setPageSize={setPageSize}
          filter={filter}
          setFilter={setFilter}
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
        />
      </Box>
    </Box>
  )
}

export default CalendarContainer
