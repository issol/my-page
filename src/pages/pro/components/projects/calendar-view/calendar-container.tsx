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

// ** FullCalendar & App Components Imports
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'

import { Typography } from '@mui/material'
import { useGetProjectCalendarData } from '@src/queries/pro-project/calendar.query'
import { CalendarEventType } from '@src/apis/pro-projects.api'

type Props = { id: number }

const CalendarContainer = ({ id }: Props) => {
  // ** States
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [hideFilter, setHideFilter] = useState(false)

  // ** Hooks
  const { settings } = useSettings()

  // ** Vars
  const leftSidebarWidth = 260
  const { skin, direction } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)

  const { data, refetch } = useGetProjectCalendarData(id, year, month)

  const [event, setEvent] = useState<Array<CalendarEventType>>([])

  useEffect(() => {
    refetch()
  }, [year, month])

  useEffect(() => {
    if (data?.events?.length) {
      setEvent([...data.events])
    } else {
      setEvent([
        {
          id: 0,
          title: '',
          start: '',
          end: '',
          status: '',
          extendedProps: {
            calendar: 'primary',
          },
        },
      ])
    }
  }, [data])

  useEffect(() => {
    if (data?.events.length && hideFilter) {
      setEvent(data.events.filter(item => item.status !== 'Delivered'))
    }
  }, [data, hideFilter])

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
        event={event}
        month={month}
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
          event={event}
          setYear={setYear}
          setMonth={setMonth}
          direction={direction}
        />
      </Box>
    </CalendarWrapper>
  )
}

export default CalendarContainer
