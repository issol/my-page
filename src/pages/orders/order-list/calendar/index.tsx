// ** React Imports
import { Suspense, useEffect, useState } from 'react'

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
import {
  OrderListFilterType,
  OrderListType,
} from '@src/types/orders/order-list'
import { useGetOrderListCalendar } from '@src/queries/order/order.query'
import OrdersList from '../list/list'
import { useRouter } from 'next/router'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { getCurrentRole } from '@src/shared/auth/storage'
import { useGetStatusList } from '@src/queries/common.query'
import CalendarStatusSideBar from '@src/pages/components/sidebar/status-sidebar'
import { CalendarEventType } from '@src/types/common/calendar.type'
import Calendar from './order-list-calendar-view'
import { OrderStatusType } from '@src/types/common/orders.type'
import { getOrderStatusColor } from '@src/shared/helpers/colors.helper'
import { hide } from '@popperjs/core'

const defaultFilters: OrderListFilterType = {
  hideCompleted: '0',
  mine: '0',
}

const OrderListCalendar = () => {
  // ** States
  const [hideCompletedOrders, setHideCompletedOrders] = useState(false)
  const [seeMyOrders, setSeeMyOrders] = useState(false)

  const router = useRouter()
  const auth = useRecoilValueLoadable(authState)
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
  const { data, isLoading } = useGetOrderListCalendar(year, month, {
    hideCompleted: hideCompletedOrders ? '1' : '0',
    mine: seeMyOrders ? '1' : '0',
  })
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

  const handleHideCompletedOrders = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHideCompletedOrders(event.target.checked)
  }

  const handleSeeMyOrders = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeeMyOrders(event.target.checked)
  }

  useEffect(() => {
    if (currentListId && data?.data?.length) {
      setCurrentList(data?.data.filter(item => item.id === currentListId))
    }
  }, [currentListId, data])

  useEffect(() => {
    if (data?.data?.length && !isLoading) {
      setEvent([...data.data])
    } else {
      setEvent([])
    }
  }, [data, isLoading])

  // useEffect(() => {
  //   if (data?.data.length && hideCompletedOrders) {
  //     setEvent(
  //       data.data.filter(
  //         item =>
  //           item.status !== 10700 &&
  //           item.status !== 101200 &&
  //           item.status !== 101000 &&
  //           item.status !== 101100,
  //       ),
  //     )
  //   } else if (data?.data.length && !hideCompletedOrders) {
  //     setEvent([...data.data])
  //   }
  // }, [data, hideCompletedOrders])

  useEffect(() => {
    if (statusList) {
      const res = statusList.map(value => ({
        ...value,
        color: getOrderStatusColor(value.value as OrderStatusType),
      }))
      setStatuses(res)
    }
  }, [statusList])

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
              <Switch checked={seeMyOrders} onChange={handleSeeMyOrders} />
            </Box>
            <Box display='flex' alignItems='center' gap='8px'>
              <Typography>Hide completed orders</Typography>
              <Switch
                checked={hideCompletedOrders}
                onChange={handleHideCompletedOrders}
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
          user={auth.getValue().user!}
          isLoading={isLoading}
          isCardHeader={false}
          role={currentRole!}
        />
      ) : null}
    </Box>
  )
}

export default OrderListCalendar
