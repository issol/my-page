// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Switch from '@mui/material/Switch'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** components
import ProjectCalendar from './project-calendar'
import CalendarSideBar from './sidebar'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Types
import { RootState, AppDispatch } from 'src/store'
import {
  CalendarColors,
  CalendarFiltersType,
} from 'src/types/apps/calendarTypes'

// ** FullCalendar & App Components Imports
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'

// ** Actions
import {
  addEvent,
  fetchEvents,
  deleteEvent,
  updateEvent,
  handleSelectEvent,
  handleAllCalendars,
  handleCalendarsUpdate,
} from 'src/store/apps/calendar'
import { Typography } from '@mui/material'
import { useGetProjectCalendarData } from '@src/queries/pro-project/calendar.query'

// ** CalendarColors
const calendarsColor: CalendarColors = {
  Personal: 'error',
  Business: 'primary',
  Family: 'warning',
  Holiday: 'success',
  ETC: 'info',
}

type Props = { id: number }

const CalendarContainer = ({ id }: Props) => {
  // ** States
  const [calendarApi, setCalendarApi] = useState<null | any>(null)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [hideFilter, setHideFilter] = useState(false)

  // ** Hooks
  const { settings } = useSettings()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.calendar)

  // ** Vars
  const leftSidebarWidth = 260
  const { skin, direction } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)

  const { data, refetch } = useGetProjectCalendarData(id, year, month)

  useEffect(() => {
    dispatch(fetchEvents(store.selectedCalendars as CalendarFiltersType[]))
  }, [dispatch, store.selectedCalendars])

  useEffect(() => {
    refetch()
  }, [year, month])

  const colors = ['primary', 'secondary', 'success', 'error', 'warning', 'info']

  const [event, setEvent] = useState<any[]>([])

  useEffect(() => {
    if (data?.events?.length) {
      setEvent(
        data.events.map((item: any, idx: number) => {
          return {
            ...item,
            extendedProps: { calendar: colors[idx % colors.length] },
          }
        }),
      )
    }
  }, [data])

  console.log('events : ', event)

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

  return (
    <CalendarWrapper
      className='app-calendar'
      sx={{
        boxShadow: skin === 'bordered' ? 0 : 6,
        ...(skin === 'bordered' && {
          border: theme => `1px solid ${theme.palette.divider}`,
        }),
      }}
    >
      <CalendarSideBar
        mdAbove={mdAbove}
        leftSidebarWidth={leftSidebarWidth}
        leftSidebarOpen={leftSidebarOpen}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
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
          display='flex'
          alignItems='center'
          gap='8px'
          justifyContent='right'
          padding='0 0 22px'
          position='absolute'
          right='0'
        >
          <Typography>Hide completed projects</Typography>
          <Typography variant='body2'>(As of yesterday)</Typography>
          <Switch
            checked={hideFilter}
            onChange={e => setHideFilter(e.target.checked)}
          />
        </Box>
        <ProjectCalendar
          setYear={setYear}
          setMonth={setMonth}
          event={event}
          dispatch={dispatch}
          direction={direction}
        />
      </Box>
    </CalendarWrapper>
  )
}

export default CalendarContainer
