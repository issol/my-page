// ** React Imports
import { Suspense, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Switch from '@mui/material/Switch'
import { Typography } from '@mui/material'

// ** components
import Calendar from './calendar'
import QuotesList from '../quote-list/list'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** FullCalendar & App Components Imports
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'

import { useGetQuotesCalendarData } from '@src/queries/quotes.query'
import { CalendarEventType } from '@src/types/common/calendar.type'
import { QuoteStatusType, QuotesListType } from '@src/types/common/quotes.type'
import { QuotesFilterType } from '@src/types/quotes/quote'
import { getCurrentRole } from '@src/shared/auth/storage'
import CalendarStatusSideBar from '@src/pages/components/sidebar/status-sidebar'
import { useGetStatusList } from '@src/queries/common.query'

const CalendarContainer = () => {
  // ** States
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const { data: statusList } = useGetStatusList('Quote')

  const [statuses, setStatuses] = useState<
    Array<{ color: string; value: number; label: string }>
  >([])

  // ** Hooks
  const { settings } = useSettings()

  // ** calendar values
  const leftSidebarWidth = 260
  const { skin, direction } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const currentRole = getCurrentRole()

  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [seeMyQuotes, setSeeMyQuotes] = useState<0 | 1>(0)
  const [hideCompletedQuotes, setHideCompletedQuotes] = useState<0 | 1>(0)
  const [filters, setFilters] = useState<QuotesFilterType>({})

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)

  const { data, isLoading } = useGetQuotesCalendarData(year, month, {
    seeMyQuotes,
    hideCompletedQuotes,
    ...filters,
  })
  const [event, setEvent] = useState<Array<CalendarEventType<QuotesListType>>>(
    [],
  )

  const [currentListId, setCurrentListId] = useState<null | number>(null)
  const [currentList, setCurrentList] = useState<
    Array<CalendarEventType<QuotesListType>>
  >([])

  function getColor(status: QuoteStatusType) {
    return status === 'New'
      ? '#666CFF'
      : status === 'In preparation'
      ? `#F572D8`
      : status === 'Internal review'
      ? `#D8AF1D`
      : status === 'Client review'
      ? `#FDB528`
      : status === 'Expired'
      ? '#FF4D49'
      : status === 'Rejected'
      ? '#FF4D49'
      : status === 'Accepted'
      ? '#64C623'
      : status === 'Changed into order'
      ? '#1A6BBA'
      : status === 'Canceled'
      ? '#FF4D49'
      : status === 'Under review'
      ? '#FDB528'
      : status === 'Revised'
      ? '#AD7028'
      : status === 'Revision requested'
      ? '#A81988'
      : status === 'Under revision'
      ? '#26C6F9'
      : status === 'Quote sent'
      ? '#2B6603'
      : ''
  }

  useEffect(() => {
    if (data?.data?.length && !isLoading) {
      setEvent([...data.data])
    } else {
      setEvent([])
    }
  }, [data, isLoading])

  // useEffect(() => {
  //   if (currentListId && data?.data) {
  //     setCurrentList(data?.data.filter(item => item.id === currentListId))
  //   }
  // }, [currentListId])

  // useEffect(() => {
  //   if (data?.data?.length) {
  //     setEvent(
  //       data.data.filter(
  //         item =>
  //           item.status !== 'Changed into order' &&
  //           item.status !== 'Canceled' &&
  //           item.status !== 'Rejected',
  //       ),
  //     )
  //   } else {
  //     setEvent([])
  //   }
  // }, [data])

  useEffect(() => {
    if (statusList) {
      const res = statusList.map(value => ({
        ...value,
        color: getColor(value.label as QuoteStatusType),
      }))
      setStatuses(res)
    }
  }, [statusList])

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

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
        <Suspense>
          <CalendarStatusSideBar
            alertIconStatus='Canceled'
            status={statuses!}
            mdAbove={mdAbove}
            leftSidebarWidth={leftSidebarWidth}
            title='Quote'
          />
        </Suspense>

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
            // sx={{
            //   display: 'flex',
            //   justifyContent: 'flex-end',
            //   gap: '24px',
            // }}
            display='flex'
            alignItems='center'
            gap='8px'
            justifyContent='right'
            padding='0 0 22px'
            position='absolute'
            right='0'
          >
            <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <Typography>See only my quotes</Typography>
              <Switch
                checked={seeMyQuotes === 1}
                onChange={e => setSeeMyQuotes(e.target.checked ? 1 : 0)}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <Typography>Hide completed quotes</Typography>
              <Switch
                checked={hideCompletedQuotes === 1}
                onChange={e => setHideCompletedQuotes(e.target.checked ? 1 : 0)}
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
      {currentListId === null ? null : (
        <Box mt={10} sx={{ background: 'white' }}>
          <QuotesList
            isLoading={isLoading}
            skip={skip}
            setSkip={setSkip}
            pageSize={pageSize}
            setPageSize={setPageSize}
            list={
              currentList?.length
                ? { data: currentList, totalCount: currentList?.length }
                : { data: [], totalCount: 0 }
            }
            filter={filters}
            setFilter={setFilters}
            role={currentRole!}
            type='calendar'
          />
        </Box>
      )}
    </Box>
  )
}

export default CalendarContainer
