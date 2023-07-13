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
import { CalendarEventType, SortingType } from '@src/apis/pro/pro-projects.api'

import { ClientProjectCalendarEventType } from '@src/apis/client.api'
import ClientProjectCalendar from './client-project-calendar'
import ClientProjectCalendarSideBar from './client-project-sidebar'
import { useGetClientProjectsCalendar } from '@src/queries/client/client-detail'
import ClientProjectList from '../list/list'
import { UserDataType } from '@src/context/types'
import { ClientProjectListType } from '@src/types/client/client-projects.type'

type Props = {
  id: number
  user: UserDataType
}

const ClientProjectCalendarContainer = ({ id, user }: Props) => {
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
  const { data, refetch } = useGetClientProjectsCalendar(id, year, month)
  const [event, setEvent] = useState<Array<ClientProjectCalendarEventType>>([])

  const [currentListId, setCurrentListId] = useState<null | number>(null)
  const [currentList, setCurrentList] = useState<
    Array<ClientProjectCalendarEventType>
  >([])

  const [selected, setSelected] = useState<number | null>(null)

  const handleRowClick = (row: ClientProjectListType) => {
    if (row.id === selected) {
      setSelected(null)
      // setSelectedProjectRow(null)
    } else {
      setSelected(row.id)
      // setSelectedProjectRow(row)
    }
  }

  const isSelected = (index: number) => {
    return index === selected
  }

  console.log(data)

  useEffect(() => {
    if (currentListId && data?.data) {
      console.log(currentListId)

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
          corporationId: '',
          serviceType: [],
          projectName: '',
          workName: '',
          category: '',
          orderDate: '',
          dueDate: '',
          status: '',
          extendedProps: {
            calendar: 'primary',
          },
          type: 'order',
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <CalendarWrapper
        className='app-calendar'
        sx={{
          boxShadow: skin === 'bordered' ? 0 : 6,
          ...(skin === 'bordered' && {
            border: theme => `1px solid ${theme.palette.divider}`,
          }),
        }}
      >
        <ClientProjectCalendarSideBar
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
            <Switch
              checked={hideFilter}
              onChange={e => setHideFilter(e.target.checked)}
            />
          </Box>
          <ClientProjectCalendar
            event={event}
            setYear={setYear}
            setMonth={setMonth}
            direction={direction}
            setCurrentListId={setCurrentListId}
          />
        </Box>
      </CalendarWrapper>

      {currentList.length ? (
        <ClientProjectList
          list={currentList}
          listCount={currentList.length}
          handleRowClick={handleRowClick}
          isSelected={isSelected}
          selected={selected}
          user={user}
        />
      ) : null}
    </Box>
  )
}

export default ClientProjectCalendarContainer
