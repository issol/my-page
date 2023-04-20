// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Switch from '@mui/material/Switch'

// ** components

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** FullCalendar & App Components Imports
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'

import { Typography } from '@mui/material'
import { useGetProjectCalendarData } from '@src/queries/pro-project/project.query'
import { CalendarEventType, SortingType } from '@src/apis/pro-projects.api'
import ProjectCalendar from '@src/pages/pro/components/projects/calendar-view/project-calendar'
import CalendarSideBar from '@src/pages/pro/components/projects/calendar-view/sidebar'

type Props = {
  id: number
}

const ClientProjectCalendarContainer = ({ id }: Props) => {
  // ** States
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [hideFilter, setHideFilter] = useState(false)

  // ** Hooks
  const { settings } = useSettings()

  // ** calendar values
  const leftSidebarWidth = 260
  const { skin, direction } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const { data, refetch } = useGetProjectCalendarData(id, `${year}-${month}`)
  const [event, setEvent] = useState<Array<CalendarEventType>>([])

  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const [currentListId, setCurrentListId] = useState<null | number>(null)
  const [currentList, setCurrentList] = useState<Array<CalendarEventType>>([])

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
      setEvent([
        //@ts-ignore
        {
          id: 0,
          title: '',
          orderDate: '',
          dueDate: '',
          status: '',
          extendedProps: {
            calendar: 'primary',
          },
        },
      ])
    }
  }, [data])

  useEffect(() => {
    if (data?.data.length && hideFilter) {
      setEvent(data.data.filter(item => item.status !== 'Delivered'))
    } else if (data?.data.length && !hideFilter) {
      setEvent([...data.data])
    }
  }, [data, hideFilter])

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
        }}
      >
        <CalendarSideBar
          event={event}
          month={month}
          mdAbove={mdAbove}
          leftSidebarWidth={leftSidebarWidth}
          leftSidebarOpen={leftSidebarOpen}
          handleLeftSidebarToggle={handleLeftSidebarToggle}
          setCurrentListId={setCurrentListId}
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
            setCurrentListId={setCurrentListId}
          />
        </Box>
      </CalendarWrapper>

      {/* <ProjectsList
        sort={sort}
        setSort={setSort}
        skip={skip}
        setSkip={setSkip}
        pageSize={pageSize}
        setPageSize={setPageSize}
        list={
          currentList?.length
            ? { data: currentList, totalCount: currentList?.length }
            : { data: [], totalCount: 0 }
        }
      /> */}
    </Box>
  )
}

export default ClientProjectCalendarContainer
