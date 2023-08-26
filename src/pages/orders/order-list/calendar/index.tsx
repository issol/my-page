// ** React Imports
import { Suspense, useContext, useEffect, useState } from 'react'

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

import { OrderListCalendarEventType } from '@src/apis/order-list.api'
import { OrderListType } from '@src/types/orders/order-list'
import { useGetOrderListCalendar } from '@src/queries/order/order.query'
import OrdersList from '../list/list'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import { authState } from '@src/states/auth'
import { getCurrentRole } from '@src/shared/auth/storage'
import { useGetStatusList } from '@src/queries/common.query'
import CalendarStatusSideBar from '@src/pages/components/sidebar/status-sidebar'
import { CalendarEventType } from '@src/types/common/calendar.type'
import Calendar from './order-list-calendar-view'
import { OrderStatusType } from '@src/types/common/orders.type'
import { getOrderStatusColor } from '@src/shared/helpers/colors.helper'

const OrderListCalendar = () => {
  // ** States
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [hideFilter, setHideFilter] = useState(false)
  const [seeMyOrders, setSeeMyOrders] = useState(false)
  const router = useRouter()
  const { user } = useRecoilValue(authState)
  const currentRole = getCurrentRole()
  const { data: statusList } = useGetStatusList('Order')

  // ** Hooks
  const { settings } = useSettings()

  // ** calendar valuesee
  const leftSidebarWidth = 260
  const { skin, direction } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const { data, isLoading } = useGetOrderListCalendar(year, month, {})
  const [event, setEvent] = useState<Array<CalendarEventType<OrderListType>>>(
    [],
  )

  const [currentListId, setCurrentListId] = useState<null | number>(null)
  const [currentList, setCurrentList] = useState<
    Array<OrderListCalendarEventType>
  >([])

  const [statuses, setStatuses] = useState<
    Array<{ color: string; value: number; label: string }>
  >([])

  const handleRowClick = (row: OrderListType) => {
    router.push(`/orders/order-list/detail/${row.id}`)
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

  useEffect(() => {
    if (data?.data.length && hideFilter) {
      setEvent(
        data.data.filter(
          item =>
            item.status !== 10700 &&
            item.status !== 101200 &&
            item.status !== 101000 &&
            item.status !== 101100,
        ),
      )
    } else if (data?.data.length && !hideFilter) {
      setEvent([...data.data])
    }
  }, [data, hideFilter])

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

  useEffect(() => {
    if (statusList) {
      const res = statusList.map(value => ({
        ...value,
        color: getOrderStatusColor(value.value as OrderStatusType),
      }))
      setStatuses(res)
    }
  }, [statusList])

  useEffect(() => {
    // console.log(event)
  }, [event])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
          <Calendar
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
          user={user!}
          isLoading={isLoading}
          isCardHeader={false}
          role={currentRole!}
        />
      ) : null}
    </Box>
  )
}

export default OrderListCalendar
