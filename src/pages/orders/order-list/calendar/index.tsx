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

import { ClientProjectCalendarEventType } from '@src/apis/client.api'
import ClientProjectCalendar from './order-list-calendar-view'
import ClientProjectCalendarSideBar from './order-list-calendar-sidebar'
import { useGetClientProjectsCalendar } from '@src/queries/client/client-detail'
import ClientProjectList from '../list/list'
import { UserDataType } from '@src/context/types'
import { ClientProjectListType } from '@src/types/client/client-projects.type'
import { OrderListCalendarEventType } from '@src/apis/order-list.api'
import { OrderListType } from '@src/types/orders/order-list'
import { useGetOrderListCalendar } from '@src/queries/order/order.query'
import OrderListCalendarView from './order-list-calendar-view'
import OrdersList from '../list/list'
import { useRouter } from 'next/router'
import OrderListCalendarSidebar from './order-list-calendar-sidebar'

type Props = {
  user: UserDataType
}

const OrderListCalendar = ({ user }: Props) => {
  // ** States
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [hideFilter, setHideFilter] = useState(false)
  const [seeMyOrders, setSeeMyOrders] = useState(false)
  const router = useRouter()

  // ** Hooks
  const { settings } = useSettings()

  // ** calendar values
  const leftSidebarWidth = 260
  const { skin, direction } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const { data, refetch, isLoading } = useGetOrderListCalendar(year, month)
  const [event, setEvent] = useState<Array<OrderListCalendarEventType>>([])

  const [currentListId, setCurrentListId] = useState<null | number>(null)
  const [currentList, setCurrentList] = useState<
    Array<OrderListCalendarEventType>
  >([])

  const [selected, setSelected] = useState<number | null>(null)

  const handleRowClick = (row: OrderListType) => {
    router.push(`/orders/order-list/detail/${row.id}`)
  }

  const isSelected = (index: number) => {
    return index === selected
  }

  useEffect(() => {
    refetch()
  }, [year, month])

  useEffect(() => {
    console.log(currentListId)

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

          status: 'Canceled',
          client: {
            name: '',
            email: '',
          },
          projectName: '',
          category: '',
          serviceType: [],
          orderedAt: '',
          projectDueAt: '',
          currency: 'USD',
          totalPrice: 0,
          extendedProps: {
            calendar: 'primary',
          },
        },
      ])
    }
  }, [data])

  useEffect(() => {
    if (data?.data.length && hideFilter) {
      setEvent(data.data.filter(item => item.status !== 'Completed'))
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
        <OrderListCalendarSidebar
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
            <Box display='flex' alignItems='center' gap='8px'>
              <Typography>See only my orders</Typography>
              <Switch
                checked={hideFilter}
                onChange={e => setHideFilter(e.target.checked)}
              />
            </Box>
            <Box display='flex' alignItems='center' gap='8px'>
              <Typography>Hide completed orders</Typography>
              <Switch
                checked={seeMyOrders}
                onChange={e => setSeeMyOrders(e.target.checked)}
              />
            </Box>
          </Box>
          <OrderListCalendarView
            event={event}
            setYear={setYear}
            setMonth={setMonth}
            direction={direction}
            setCurrentListId={setCurrentListId}
          />
        </Box>
      </CalendarWrapper>

      {currentList.length ? (
        <OrdersList
          list={currentList}
          listCount={currentList.length}
          handleRowClick={handleRowClick}
          user={user}
          isLoading={isLoading}
          isCardHeader={false}
        />
      ) : null}
    </Box>
  )
}

export default OrderListCalendar
