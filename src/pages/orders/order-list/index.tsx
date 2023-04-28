import { useContext, useState } from 'react'

import styled from 'styled-components'

// ** MUI Imports
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { Switch, Typography } from '@mui/material'
import { Box } from '@mui/system'

import { UserDataType } from '@src/context/types'
import PageHeader from '@src/@core/components/page-header'
import {
  OrderListFilterType,
  OrderListType,
} from '@src/types/orders/order-list'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'
import { CategoryList } from '@src/shared/const/category/categories'
import { useForm } from 'react-hook-form'
import OrdersFilters from './list/filters'
import { useGetOrderList } from '@src/queries/order/order.query'
import OrdersList from './list/list'
import { AuthContext } from '@src/context/AuthContext'
import { useRouter } from 'next/router'
import OrderListCalendar from './calendar'

export type FilterType = {
  orderDate: Date[]
  projectDueDate: Date[]
  revenueFrom: Array<{ label: string; value: string }>

  status: Array<{ label: string; value: string }>
  client: Array<{ label: string; value: string }>
  category: Array<{ label: string; value: string }>
  serviceType: Array<{ label: string; value: string }>

  search: string
}

const defaultValues: FilterType = {
  orderDate: [],
  projectDueDate: [],
  revenueFrom: [],
  status: [],
  client: [],
  category: [],
  serviceType: [],
  search: '',
}

const defaultFilters: OrderListFilterType = {
  take: 10,
  skip: 0,
  search: '',
  status: [],
  client: [],
  category: [],
  serviceType: [],
  orderDateFrom: '',
  orderDateTo: '',
  projectDueDateFrom: '',
  projectDueDateTo: '',
  revenueFrom: [],
}

type MenuType = 'list' | 'calendar'

export default function OrderList() {
  const [menu, setMenu] = useState<MenuType>('list')
  const router = useRouter()
  const { user } = useContext(AuthContext)
  const [orderListPage, setOrderListPage] = useState(0)
  const [orderListRowsPerPage, setOrderListRowsPerPage] = useState(10)

  const [hideCompletedOrders, setHideCompletedOrders] = useState(false)
  const [seeMyOrders, setSeeMyOrders] = useState(false)

  const [filters, setFilters] = useState<OrderListFilterType>(defaultFilters)
  const [serviceTypeList, setServiceTypeList] = useState(ServiceTypeList)
  const [categoryList, setCategoryList] = useState(CategoryList)

  const { data: orderList, isLoading } = useGetOrderList(filters)

  const { control, handleSubmit, trigger, reset } = useForm<FilterType>({
    defaultValues,
    mode: 'onSubmit',
  })

  const onClickResetButton = () => {
    reset(defaultValues)

    setFilters(defaultFilters)
  }

  const handleRowClick = (row: OrderListType) => {
    router.push(`/orders/order-list/detail/${row.id}`)
  }

  const handleHideCompletedOrders = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHideCompletedOrders(event.target.checked)
    setFilters(prevState => ({
      ...prevState,
      hideCompletedOrders: event.target.checked ? '1' : '0',
    }))
  }

  const handleSeeMyOrders = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeeMyOrders(event.target.checked)

    setFilters(prevState => ({
      ...prevState,
      mine: event.target.checked ? '1' : '0',
    }))
  }

  const onSubmit = (data: FilterType) => {
    const {
      orderDate,
      projectDueDate,
      revenueFrom,
      status,
      client,
      serviceType,
      category,
      search,
    } = data

    const filter: OrderListFilterType = {
      revenueFrom: revenueFrom.map(value => value.value),
      status: status.map(value => value.value),
      client: client.map(value => value.value),
      serviceType: serviceType.map(value => value.value),
      category: category.map(value => value.value),
      orderDateFrom: orderDate[0]?.toISOString() ?? '',
      orderDateTo: orderDate[1]?.toISOString() ?? '',
      projectDueDateFrom: projectDueDate[0]?.toISOString() ?? '',
      projectDueDateTo: projectDueDate[1]?.toISOString() ?? '',

      search: search,
      take: orderListRowsPerPage,
      skip: orderListRowsPerPage * orderListPage,
      ordering: 'desc',
      sort: 'corporationId',
    }

    setFilters(filter)
  }

  return (
    <Box display='flex' flexDirection='column' sx={{ pb: '64px' }}>
      <PageHeader title={<Typography variant='h5'>Order list</Typography>} />
      <Box
        display='flex'
        width={'100%'}
        justifyContent='right'
        padding='10px 0 24px'
      >
        <ButtonGroup variant='outlined'>
          <CustomBtn
            value='list'
            $focus={menu === 'list'}
            onClick={e => setMenu(e.currentTarget.value as MenuType)}
          >
            List view
          </CustomBtn>
          <CustomBtn
            $focus={menu === 'calendar'}
            value='calendar'
            onClick={e => setMenu(e.currentTarget.value as MenuType)}
          >
            Calendar view
          </CustomBtn>
        </ButtonGroup>
      </Box>
      <Box>
        {menu === 'list' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <OrdersFilters
              filter={filters}
              control={control}
              setFilter={setFilters}
              onReset={onClickResetButton}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              trigger={trigger}
              serviceTypeList={serviceTypeList}
              setServiceTypeList={setServiceTypeList}
              categoryList={categoryList}
              setCategoryList={setCategoryList}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '24px',
              }}
            >
              <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <Typography>See only my Orders</Typography>
                <Switch checked={seeMyOrders} onChange={handleSeeMyOrders} />
              </Box>
              <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <Typography>Hide completed Orders</Typography>
                <Switch
                  checked={hideCompletedOrders}
                  onChange={handleHideCompletedOrders}
                />
              </Box>
            </Box>
            <OrdersList
              pageSize={orderListPage}
              setPageSize={setOrderListPage}
              rowsPerPage={orderListRowsPerPage}
              setRowsPerPage={setOrderListRowsPerPage}
              user={user!}
              list={orderList?.data!}
              listCount={orderList?.count!}
              isLoading={isLoading}
              setFilters={setFilters}
              isCardHeader={true}
              handleRowClick={handleRowClick}
            />
          </Box>
        ) : (
          <OrderListCalendar user={user!} />
        )}
      </Box>
    </Box>
  )
}

const CustomBtn = styled(Button)<{ $focus: boolean }>`
  width: 145px;
  background: ${({ $focus }) => ($focus ? 'rgba(102, 108, 255, 0.08)' : '')};
`

OrderList.acl = {
  subject: 'order_list',
  action: 'read',
}
