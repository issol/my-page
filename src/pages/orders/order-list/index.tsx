import { useContext, useEffect, useState } from 'react'

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
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { useRouter } from 'next/router'
import OrderListCalendar from './calendar'
import { useGetStatusList } from '@src/queries/common.query'
import { getCurrentRole } from '@src/shared/auth/storage'
import { useGetClientList } from '@src/queries/client.query'
import { useGetCompanyOptions } from '@src/queries/options.query'
import { useQueryClient } from 'react-query'

export type FilterType = {
  orderDate: Date[]
  projectDueDate: Date[]
  revenueFrom?: Array<{ label: string; value: string }>

  status: Array<{ label: string; value: number }>
  client?: Array<{ label: string; value: number }>
  category: Array<{ label: string; value: string }>
  serviceType: Array<{ label: string; value: string }>

  lsp?: Array<{ label: string; value: string }>

  search: string
}

const defaultValues: FilterType = {
  orderDate: [],
  projectDueDate: [],
  status: [],
  client: [],
  category: [],
  serviceType: [],
  revenueFrom: [],
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
}

type MenuType = 'list' | 'calendar'

export default function OrderList() {
  const currentRole = getCurrentRole()
  const queryClient = useQueryClient()

  const { data: statusList } = useGetStatusList('Order')
  const [menu, setMenu] = useState<MenuType>('list')
  const router = useRouter()
  const auth = useRecoilValueLoadable(authState)
  const [orderListPage, setOrderListPage] = useState(0)
  const [orderListRowsPerPage, setOrderListRowsPerPage] = useState(10)

  const [hideCompletedOrders, setHideCompletedOrders] = useState(false)
  const [seeMyOrders, setSeeMyOrders] = useState(false)

  const [filters, setFilters] = useState<OrderListFilterType>(defaultFilters)
  const [serviceTypeList, setServiceTypeList] = useState(ServiceTypeList)
  const [categoryList, setCategoryList] = useState(CategoryList)
  const [clientList, setClientList] = useState<
    {
      label: string
      value: number
    }[]
  >([])
  const [companiesList, setCompaniesList] = useState<
    {
      label: string
      value: string
    }[]
  >([])

  const { data: orderList, isLoading } = useGetOrderList(filters, 'order')
  const { data: clients, isLoading: clientListLoading } = useGetClientList({
    take: 1000,
    skip: 0,
  })

  const { data: companies, isLoading: companiesListLoading } =
    currentRole?.name === 'CLIENT'
      ? useGetCompanyOptions('LSP')
      : { data: [], isLoading: false }

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
    const checked = event.target.checked
    setHideCompletedOrders(checked)
    setFilters(prevState => ({
      ...prevState,
      hideCompleted: checked ? '1' : '0',
    }))
  }

  const handleSeeMyOrders = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    setSeeMyOrders(checked)

    setFilters(prevState => ({
      ...prevState,
      mine: checked ? '1' : '0',
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
      lsp,
    } = data

    const filter: OrderListFilterType = {
      revenueFrom: revenueFrom?.map(value => value.value) ?? [],
      status: status.map(value => value.value),
      client: client?.map(value => value.label) ?? [],
      serviceType: serviceType.map(value => value.value),
      category: category.map(value => value.value),
      orderDateFrom: orderDate[0]?.toISOString() ?? '',
      orderDateTo: orderDate[1]?.toISOString() ?? '',
      projectDueDateFrom: projectDueDate[0]?.toISOString() ?? '',
      projectDueDateTo: projectDueDate[1]?.toISOString() ?? '',
      lsp: lsp?.map(value => value.label),
      search: search,
      take: orderListRowsPerPage,
      skip: orderListRowsPerPage * orderListPage,
      ordering: 'desc',
      sort: 'corporationId',
    }

    setFilters(filter)
  }

  useEffect(() => {
    if (clients && !clientListLoading) {
      const res = clients.data.map(client => ({
        label: client.name,
        value: client.clientId,
      }))
      setClientList(res)
    }
  }, [clients, clientListLoading])

  useEffect(() => {
    if (currentRole?.name === 'CLIENT') {
      if (companies && !companiesListLoading) {
        const res = companies.map(company => ({
          label: company.name,
          value: company.id,
        }))
        setCompaniesList(res)
      }
    }
  }, [companies, companiesListLoading])

  useEffect(() => {
    queryClient.invalidateQueries(['orderList'])
    queryClient.invalidateQueries(['orderDetail'])
  }, [])

  return (
    <Box display='flex' flexDirection='column' sx={{ pb: '64px' }}>
      <Box
        display='flex'
        width={'100%'}
        alignItems='center'
        justifyContent='space-between'
        padding='10px 0 24px'
      >
        <PageHeader title={<Typography variant='h5'>Order list</Typography>} />
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
              clientList={clientList}
              companiesList={companiesList}
              statusList={statusList!}
              role={currentRole!}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '24px',
              }}
            >
              <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <Typography>See only my orders</Typography>
                <Switch checked={seeMyOrders} onChange={handleSeeMyOrders} />
              </Box>
              <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <Typography>Hide completed orders</Typography>
                <Switch
                  checked={hideCompletedOrders}
                  onChange={handleHideCompletedOrders}
                />
              </Box>
            </Box>
            <OrdersList
              page={orderListPage}
              setPageSize={setOrderListPage}
              rowsPerPage={orderListRowsPerPage}
              setRowsPerPage={setOrderListRowsPerPage}
              user={auth.getValue().user!}
              list={orderList?.data!}
              listCount={orderList?.totalCount!}
              isLoading={isLoading}
              setFilters={setFilters}
              isCardHeader={true}
              handleRowClick={handleRowClick}
              role={currentRole!}
            />
          </Box>
        ) : (
          <OrderListCalendar />
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
  subject: 'order',
  action: 'read',
}
