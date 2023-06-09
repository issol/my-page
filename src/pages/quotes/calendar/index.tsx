// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Switch from '@mui/material/Switch'
import { Typography } from '@mui/material'

// ** components
import Calendar from './calendar'
import QuotesList from '../list/list'
import CalendarSideBar from '@src/pages/components/sidebar'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** FullCalendar & App Components Imports
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'

import { useGetQuotesCalendarData } from '@src/queries/quotes.query'
import { CalendarEventType } from '@src/types/common/calendar.type'
import { QuotesListType } from '@src/types/common/quotes.type'
import { QuotesFilterType } from '@src/types/quotes/quote'

const CalendarContainer = () => {
  // ** States
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)

  // ** Hooks
  const { settings } = useSettings()

  // ** calendar values
  const leftSidebarWidth = 260
  const { skin, direction } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [seeMyQuotes, setSeeMyQuotes] = useState<0 | 1>(0)
  const [hideCompletedQuotes, setHideCompletedQuotes] = useState<0 | 1>(0)
  const [filters, setFilters] = useState<QuotesFilterType>({})

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const { data, refetch, isLoading } = useGetQuotesCalendarData(year, month, {
    seeMyQuotes,
    hideCompletedQuotes,
    ...filters,
  })
  const [event, setEvent] = useState<Array<CalendarEventType<QuotesListType>>>(
    [],
  )

  const [currentListId, setCurrentListId] = useState<null | string>(null)
  const [currentList, setCurrentList] = useState<
    Array<CalendarEventType<QuotesListType>>
  >([])

  useEffect(() => {
    refetch()
  }, [year, month])

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
        <CalendarSideBar
          title='Quote status'
          alertIconStatus='Canceled'
          event={event}
          month={month}
          mdAbove={mdAbove}
          leftSidebarWidth={leftSidebarWidth}
          leftSidebarOpen={leftSidebarOpen}
          handleLeftSidebarToggle={handleLeftSidebarToggle}
          setCurrentListId={n => setCurrentListId(n.toString())}
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
          />
        </Box>
      )}
    </Box>
  )
}

export default CalendarContainer
