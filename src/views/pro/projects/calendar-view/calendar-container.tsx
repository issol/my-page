// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Switch from '@mui/material/Switch'

// ** components
import ProjectCalendar from './project-calendar'
import CalendarSideBar from './sidebar'

// ** Hooks
import { useSettings } from '@src/@core/hooks/useSettings'

// ** FullCalendar & App Components Imports
import CalendarWrapper from '@src/@core/styles/libs/fullcalendar'

import { Typography } from '@mui/material'
import { useGetProjectCalendarData } from '@src/queries/pro/pro-project.query'
import { CalendarEventType, SortingType } from '@src/apis/pro/pro-projects.api'
import ProjectsList from '../list-view/list'
import useCalenderResize from '@src/hooks/useCalenderResize'

type Props = {
  id: number
  sort: SortingType
  setSort: (val: SortingType) => void
}

const CalendarContainer = ({ id, sort, setSort }: Props) => {
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
  const [month, setMonth] = useState(new Date().getMonth())
  const { data } = useGetProjectCalendarData(id, `${year}-${month}`)
  const [event, setEvent] = useState<Array<CalendarEventType>>([])

  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const [currentListId, setCurrentListId] = useState<null | number>(null)
  const [currentList, setCurrentList] = useState<Array<CalendarEventType>>([])

  // ** custom hooks
  const { containerRef, containerWidth } = useCalenderResize()

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
          ref={containerRef}
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
          <ProjectCalendar
            event={event}
            setYear={setYear}
            setMonth={setMonth}
            direction={direction}
            setCurrentListId={setCurrentListId}
            containerWidth={containerWidth}
            filter={hideFilter}
            setFilter={setHideFilter}
          />
        </Box>
      </CalendarWrapper>
      {currentListId && (
        <ProjectsList
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
        />
      )}
    </Box>
  )
}

export default CalendarContainer
