import { useContext, useEffect, useState } from 'react'

import { styled } from '@mui/system'

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
import {
  FilterKey,
  getUserFilters,
  saveUserFilters,
} from '@src/shared/filter-storage'
import { getOrderList } from '@src/apis/order/order-list.api'

export type FilterType = {
  orderDate: Date[]
  projectDueDate: Date[]
  revenueFrom?: Array<{ label: string; value: string }>

  status: Array<{ label: string; value: number }>
  client?: Array<{ label: string; value: number }>
  category: Array<{ label: string; value: string }>
  serviceType: Array<{ label: string; value: string }>
  ordering?: 'asc' | 'desc'
  sort?: 'corporationId' | 'projectDueDate' | 'orderDate' | 'totalPrice'
  lsp?: Array<{ label: string; value: string }>

  search: string
  hideCompleted: '1' | '0'
  mine: '1' | '0'
}

const defaultValues: FilterType = {
  orderDate: [],
  projectDueDate: [],
  status: [],
  client: [],
  lsp: [],
  category: [],
  serviceType: [],
  revenueFrom: [],
  search: '',
  hideCompleted: '0',
  mine: '0',
}

const defaultFilters: OrderListFilterType = {
  take: 500,
  skip: 0,
  search: '',
  status: [],
  client: [],
  lsp: [],
  category: [],
  serviceType: [],
  orderDateFrom: '',
  orderDateTo: '',
  projectDueDateFrom: '',
  projectDueDateTo: '',
}

export type MenuType = 'list' | 'calendar'

export default function OrderList() {
  const currentRole = getCurrentRole()
  const queryClient = useQueryClient()

  const savedFilter: FilterType | null = getUserFilters(FilterKey.ORDER_LIST)
    ? JSON.parse(getUserFilters(FilterKey.ORDER_LIST)!)
    : null

  const { data: statusList } = useGetStatusList('Order')
  const [menu, setMenu] = useState<MenuType>('list')
  const router = useRouter()
  const auth = useRecoilValueLoadable(authState)
  const [orderListPage, setOrderListPage] = useState(0)
  const [orderListRowsPerPage, setOrderListRowsPerPage] = useState(500)

  const [hideCompletedOrders, setHideCompletedOrders] = useState(false)
  const [seeMyOrders, setSeeMyOrders] = useState(false)

  const [filters, setFilters] = useState<OrderListFilterType | null>(null)
  const [defaultFilter, setDefaultFilter] = useState<FilterType>(defaultValues)

  const [rows, setRows] = useState<OrderListType[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)

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

  // const {
  //   data: orderList,
  //   isLoading,
  //   isFetched,
  // } = useGetOrderList(filters, 'order')

  const { data: clients, isLoading: clientListLoading } = useGetClientList({
    take: 1000,
    skip: 0,
    sort: 'name',
    ordering: 'asc',
  })

  const { data: companies, isLoading: companiesListLoading } =
    currentRole?.name === 'CLIENT'
      ? useGetCompanyOptions('LSP')
      : { data: [], isLoading: false }

  const { control, handleSubmit, trigger, reset } = useForm<FilterType>({
    defaultValues: defaultFilter,
    mode: 'onSubmit',
  })

  const onClickResetButton = () => {
    reset(defaultValues)
    saveUserFilters(FilterKey.ORDER_LIST, {
      orderDate: [],
      projectDueDate: [],
      status: [],
      client: [],
      lsp: [],
      category: [],
      serviceType: [],
      revenueFrom: [],
      search: '',
      hideCompleted: hideCompletedOrders ? '1' : '0',
      mine: seeMyOrders ? '1' : '0',
    })
    setFilters(defaultFilters)

    // queryClient.invalidateQueries([
    //   'orderList',
    //   { type: 'list' },
    //   defaultFilters,
    //   'order',
    // ])
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
    saveUserFilters(FilterKey.ORDER_LIST, {
      ...defaultFilter,
      hideCompleted: checked ? '1' : '0',
    })
  }

  const handleSeeMyOrders = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    setSeeMyOrders(checked)

    setFilters(prevState => ({
      ...prevState,
      mine: checked ? '1' : '0',
    }))

    saveUserFilters(FilterKey.ORDER_LIST, {
      ...defaultFilter,
      mine: checked ? '1' : '0',
    })
  }

  const onSubmit = async (data: FilterType) => {
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
    saveUserFilters(FilterKey.ORDER_LIST, data)
    setDefaultFilter(data)
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

    // setFilters(filter)
    // queryClient.invalidateQueries([
    //   'orderList',
    //   { type: 'list' },
    //   filter,
    //   'order',
    // ])

    setLoading(true)
    const rows = await getOrderList(filter!)
    setLoading(false)
    setRows(rows.data ?? [])
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

  // useEffect(() => {
  //   queryClient.invalidateQueries(['orderList'])
  //   queryClient.invalidateQueries(['orderDetail'])
  // }, [])

  useEffect(() => {
    let mounted = true
    if (savedFilter && mounted) {
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
        hideCompleted,
        mine,
      } = savedFilter

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
        take: 500,
        skip: 0,
        // take: orderListRowsPerPage,
        // skip: orderListRowsPerPage * orderListPage,
        ordering: 'desc',
        sort: 'corporationId',
        hideCompleted: hideCompleted,
        mine: mine,
      }

      if (JSON.stringify(defaultFilter) !== JSON.stringify(savedFilter)) {
        setDefaultFilter(savedFilter)
        reset(savedFilter)
      }
      if (JSON.stringify(filters) !== JSON.stringify(filter)) {
        setFilters(filter)
      }
      setHideCompletedOrders(hideCompleted === '1')
      setSeeMyOrders(mine === '1')
    } else {
      setFilters({ ...defaultFilters })
    }

    return () => {
      mounted = true
    }
  }, [savedFilter])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (filters) {
        console.log(filters, 'filters')

        setLoading(true)
        const rows = await getOrderList(filters!)

        if (mounted) {
          setLoading(false)
          setRows(rows.data ?? [])
          setTotalCount(rows.totalCount)
        }
      }
    })()

    return () => {
      mounted = false
    }
  }, [filters])

  return (
    <Box display='flex' flexDirection='column' sx={{ pb: '64px' }}>
      <Box>
        {menu === 'list' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <OrdersFilters
              control={control}
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
              menu={menu}
              setMenu={setMenu}
              listCount={totalCount ?? 0}
            />

            <OrdersList
              page={orderListPage}
              setPageSize={setOrderListPage}
              rowsPerPage={orderListRowsPerPage}
              setRowsPerPage={setOrderListRowsPerPage}
              user={auth.getValue().user!}
              list={rows || []}
              listCount={totalCount ?? 0}
              isLoading={loading}
              setFilters={setFilters}
              filters={filters!}
              isCardHeader={true}
              handleRowClick={handleRowClick}
              role={currentRole!}
              defaultFilter={defaultFilter}
              seeMyOrders={seeMyOrders}
              handleSeeMyOrders={handleSeeMyOrders}
              hideCompletedOrders={hideCompletedOrders}
              handleHideCompletedOrders={handleHideCompletedOrders}
              setRows={setRows}
              setLoading={setLoading}
            />
          </Box>
        ) : (
          <OrderListCalendar menu={menu} setMenu={setMenu} />
        )}
      </Box>
    </Box>
  )
}

OrderList.acl = {
  subject: 'order',
  action: 'read',
}
