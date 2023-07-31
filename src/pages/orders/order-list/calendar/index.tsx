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
import { OrderListType, OrderStatusType } from '@src/types/orders/order-list'
import { useGetOrderListCalendar } from '@src/queries/order/order.query'
import OrdersList from '../list/list'
import { useRouter } from 'next/router'
import { AuthContext } from '@src/context/AuthContext'
import { getCurrentRole } from '@src/shared/auth/storage'
import { useGetStatusList } from '@src/queries/common.query'
import CalendarStatusSideBar from '@src/pages/components/sidebar/status-sidebar'
import { CalendarEventType } from '@src/types/common/calendar.type'
import Calendar from './order-list-calendar-view'

const OrderListCalendar = () => {
  // ** States
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [hideFilter, setHideFilter] = useState(false)
  const [seeMyOrders, setSeeMyOrders] = useState(false)
  const router = useRouter()
  const { user } = useContext(AuthContext)
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

  function getColor(status: OrderStatusType) {
    return status === 'New'
      ? '#666CFF'
      : status === 'In preparation'
      ? '#F572D8'
      : status === 'In progress'
      ? '#FDB528'
      : status === 'Internal review'
      ? '#D8AF1D'
      : status === 'Order sent'
      ? '#B06646'
      : status === 'Under revision'
      ? '#26C6F9'
      : status === 'Partially delivered'
      ? '#BA971A'
      : status === 'Delivery completed'
      ? '#1A6BBA'
      : status === 'Redelivery requested'
      ? '#A81988'
      : status === 'Delivery confirmed'
      ? '#64C623'
      : status === 'Invoiced'
      ? '#9B6CD8'
      : status === 'Paid'
      ? '#1B8332'
      : status === 'Canceled'
      ? '#FF4D49'
      : ''
  }

  useEffect(() => {
    // console.log(currentListId)

    if (currentListId && data?.data) {
      // console.log(currentListId)

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
    // console.log(data)

    if (data?.data.length && hideFilter) {
      // console.log(data.data)

      setEvent(
        data.data.filter(
          item =>
            item.status !== 'Delivery confirmed' &&
            item.status !== 'Canceled' &&
            item.status !== 'Invoiced' &&
            item.status !== 'Paid',
        ),
      )
    } else if (data?.data.length && !hideFilter) {
      // console.log(data.data)
      setEvent([...data.data])
    }
  }, [data, hideFilter])

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

  useEffect(() => {
    if (statusList) {
      const res = statusList.map(value => ({
        ...value,
        color: getColor(value.label as OrderStatusType),
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
