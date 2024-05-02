import { Fragment, useEffect, useState } from 'react'

// ** style components
import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  Switch,
  Typography,
} from '@mui/material'
import ToggleViewButton, {
  ToggleMenuType,
} from '@src/@core/components/toggle-view-button'

// ** types
import { InvoiceReceivableFilterType } from '@src/types/invoice/receivable.type'

// ** components
import Filter from './components/list/filter'
import ReceivableList from './components/list/list'
import CalendarContainer from './components/calendar'

// ** apis
import { useGetReceivableList } from '@src/queries/invoice/receivable.query'

// ** values
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'

// ** hooks
import useModal from '@src/hooks/useModal'

import { useGetCompanyOptions } from '@src/queries/options.query'
import { getCurrentRole } from '@src/shared/auth/storage'
import { useGetClientList } from '@src/queries/client.query'
import { useGetStatusList } from '@src/queries/common.query'
import { useForm } from 'react-hook-form'
import { CategoryList } from '@src/shared/const/category/categories'
import { getInvoiceReceivableListColumns } from '@src/shared/const/columns/invoice-receivable'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import SelectOrder from './components/list/select-order'
import { useQueryClient } from 'react-query'
import { timezoneSelector } from '@src/states/permission'
import {
  FilterKey,
  getUserFilters,
  saveUserFilters,
} from '@src/shared/filter-storage'
import dayjs from 'dayjs'

export type FilterType = {
  invoiceDate: Date[]
  payDueDate: Date[]
  paidDueDate: Date[]
  paidDate: Date[]
  salesCheckedDate: Date[]

  revenueFrom?: Array<{ label: string; value: string }>
  salesCategory?: Array<{ label: string; value: string }>

  invoiceStatus: Array<{ label: string; value: number }>
  clientId?: Array<{ label: string; value: number }>
  lsp?: Array<{ label: string; value: string }>
  category: Array<{ label: string; value: string }>
  serviceType: Array<{ label: string; value: string }>

  search: string
  mine: '1' | '0'
  hidePaid: '1' | '0'
}

const defaultValues: FilterType = {
  invoiceDate: [],
  payDueDate: [],
  paidDueDate: [],
  paidDate: [],
  salesCheckedDate: [],
  invoiceStatus: [],
  clientId: [],
  category: [],
  serviceType: [],
  revenueFrom: [],
  salesCategory: [],
  lsp: [],
  search: '',
  mine: '0',
  hidePaid: '0',
}

const defaultFilters: InvoiceReceivableFilterType = {
  invoiceStatus: [],
  clientId: [],
  category: [],
  serviceType: [],
  revenueFrom: [],
  salesCategory: [],
  lsp: [],

  invoicedDateFrom: '',
  invoicedDateTo: '',
  payDueDateFrom: '',
  payDueDateTo: '',
  paidDateFrom: '',
  paidDateTo: '',
  salesCheckedDateFrom: '',
  salesCheckedDateTo: '',
  search: '',

  mine: '0',
  hidePaid: '0',

  skip: 0,
  take: 10,
}
export default function Receivable() {
  const queryClient = useQueryClient()
  const savedFilter: FilterType | null = getUserFilters(
    FilterKey.INVOICE_RECEIVABLE_LIST,
  )
    ? JSON.parse(getUserFilters(FilterKey.INVOICE_RECEIVABLE_LIST)!)
    : null
  const [filters, setFilters] = useState<InvoiceReceivableFilterType | null>(
    null,
  )
  const [defaultFilter, setDefaultFilter] = useState<FilterType>(defaultValues)

  const { openModal, closeModal } = useModal()
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const [menu, setMenu] = useState<ToggleMenuType>('list')

  const [clientList, setClientList] = useState<
    {
      label: string
      value: number
    }[]
  >([])
  const [companyList, setCompanyList] = useState<
    {
      label: string
      value: string
    }[]
  >([])

  const [invoiceListPage, setInvoiceListPage] = useState(0)
  const [invoiceListRowsPerPage, setInvoiceListRowsPerPage] = useState(10)

  const [hidePaidInvoices, setHidePaidInvoices] = useState(false)
  const [seeMyInvoices, setSeeMyInvoices] = useState(false)

  const { control, handleSubmit, trigger, reset, getValues } =
    useForm<FilterType>({
      defaultValues: defaultFilter,
      mode: 'onSubmit',
    })

  console.log(getValues())

  const [serviceTypeList, setServiceTypeList] = useState(ServiceTypeList)
  const [categoryList, setCategoryList] = useState(CategoryList)
  const currentRole = getCurrentRole()

  const { data: list, isLoading } = useGetReceivableList(filters)
  //인보이스의 전체 status 리스트
  const { data: statusList, isLoading: statusListLoading } =
    useGetStatusList('InvoiceReceivable')

  //각 롤에 필요한 인보이스 리스트만 필터
  const { data: statusListForRole, isLoading: statusListForRoleLoading } =
    useGetStatusList('InvoiceReceivable', '1')

  const { data: statusListOrder } = useGetStatusList('Order')

  const { data: clients, isLoading: clientListLoading } = useGetClientList({
    take: 1000,
    skip: 0,
    sort: 'name',
    ordering: 'asc',
  })

  const handleHidePaidInvoices = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked
    setHidePaidInvoices(event.target.checked)
    setFilters(prevState => ({
      ...prevState!,
      hidePaid: checked ? '1' : '0',
    }))
    saveUserFilters(FilterKey.INVOICE_RECEIVABLE_LIST, {
      ...defaultFilter,
      hidePaid: checked ? '1' : '0',
    })
  }

  const handleSeeMyInvoices = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    setSeeMyInvoices(event.target.checked)

    setFilters(prevState => ({
      ...prevState!,
      mine: checked ? '1' : '0',
    }))
    saveUserFilters(FilterKey.INVOICE_RECEIVABLE_LIST, {
      ...defaultFilter,
      mine: checked ? '1' : '0',
    })
  }

  const { data: companies, isLoading: companiesListLoading } =
    currentRole?.name === 'CLIENT'
      ? useGetCompanyOptions('LSP')
      : { data: [], isLoading: false }

  const onSubmit = (data: FilterType) => {
    const {
      invoiceDate,
      payDueDate,
      paidDueDate,
      paidDate,
      salesCheckedDate,
      revenueFrom,
      invoiceStatus,
      clientId,
      serviceType,
      category,
      lsp,
      search,
      salesCategory,
    } = data

    if (invoiceStatus.find(value => value.value === 301000))
      invoiceStatus.push({
        label: 'Overdue',
        value: 301100,
      })

    saveUserFilters(FilterKey.INVOICE_RECEIVABLE_LIST, data)
    setDefaultFilter(data)

    const filter: InvoiceReceivableFilterType = {
      revenueFrom: revenueFrom?.map(value => value.value) ?? [],
      invoiceStatus: invoiceStatus.map(value => value.value),
      clientId: clientId?.map(value => value.value) ?? [],
      lsp: lsp?.map(value => value.label) ?? [],

      serviceType: serviceType.map(value => value.value),
      category: category.map(value => value.value),
      invoicedDateFrom: invoiceDate[0]
        ? dayjs(invoiceDate[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
        : '',
      invoicedDateTo: invoiceDate[1]
        ? dayjs(invoiceDate[1]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
        : '',
      payDueDateFrom: payDueDate[0]
        ? dayjs(payDueDate[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
        : '',
      payDueDateTo: payDueDate[1]
        ? dayjs(payDueDate[1]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
        : '',
      paidDateFrom: paidDate[0]
        ? dayjs(paidDate[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
        : '',
      paidDateTo: paidDate[1]
        ? dayjs(paidDate[1]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
        : '',
      salesCheckedDateFrom: salesCheckedDate[0]
        ? dayjs(salesCheckedDate[0])
            .startOf('day')
            .format('YYYY-MM-DD HH:mm:ss')
        : '',
      salesCheckedDateTo: salesCheckedDate[1]
        ? dayjs(salesCheckedDate[1])
            .startOf('day')
            .format('YYYY-MM-DD HH:mm:ss')
        : '',
      salesCategory: salesCategory?.map(value => value.value) ?? [],

      search: search,
      take: invoiceListRowsPerPage,
      skip: invoiceListRowsPerPage * invoiceListPage,
    }

    setFilters(filter)
    // queryClient.invalidateQueries(['invoice/receivable/list', filter])
  }

  function onReset() {
    reset(defaultValues)
    saveUserFilters(FilterKey.INVOICE_RECEIVABLE_LIST, {
      invoiceDate: [],
      payDueDate: [],
      paidDueDate: [],
      paidDate: [],
      salesCheckedDate: [],
      invoiceStatus: [],
      clientId: [],
      category: [],
      serviceType: [],
      revenueFrom: [],
      salesCategory: [],
      lsp: [],
      search: '',
      hidePaid: hidePaidInvoices ? '1' : '0',
      mine: seeMyInvoices ? '1' : '0',
    })
    setFilters({ ...defaultFilters })
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
        setCompanyList(res)
      }
    }
  }, [companies, companiesListLoading])

  function onClickCreateInvoice() {
    openModal({
      type: 'order-list',
      children: (
        <SelectOrder
          onClose={() => closeModal('order-list')}
          type='invoice'
          statusList={statusListOrder ?? []}
          clientList={clientList}
          from='create'
        />
      ),
    })
  }

  useEffect(() => {
    queryClient.invalidateQueries(['invoice/receivable/list'])
    queryClient.invalidateQueries(['invoice/receivable/calendar'])
    queryClient.invalidateQueries(['invoiceReceivableDetail'])
  }, [])

  useEffect(() => {
    if (savedFilter) {
      const {
        invoiceDate,
        payDueDate,
        paidDueDate,
        paidDate,
        salesCheckedDate,
        revenueFrom,
        invoiceStatus,
        clientId,
        serviceType,
        category,
        lsp,
        search,
        salesCategory,
        hidePaid,
        mine,
      } = savedFilter

      if (invoiceStatus.find(value => value.value === 301000))
        invoiceStatus.push({
          label: 'Overdue',
          value: 301100,
        })

      console.log(payDueDate)

      const filter: InvoiceReceivableFilterType = {
        revenueFrom: revenueFrom?.map(value => value.value) ?? [],
        invoiceStatus: invoiceStatus.map(value => value.value),
        clientId: clientId?.map(value => value.value) ?? [],
        lsp: lsp?.map(value => value.label) ?? [],

        serviceType: serviceType.map(value => value.value),
        category: category.map(value => value.value),
        invoicedDateFrom: invoiceDate[0]
          ? dayjs(invoiceDate[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
          : '',
        invoicedDateTo: invoiceDate[1]
          ? dayjs(invoiceDate[1]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
          : '',
        payDueDateFrom: payDueDate[0]
          ? dayjs(payDueDate[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
          : '',
        payDueDateTo: payDueDate[1]
          ? dayjs(payDueDate[1]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
          : '',
        paidDateFrom: paidDate[0]
          ? dayjs(paidDate[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
          : '',
        paidDateTo: paidDate[1]
          ? dayjs(paidDate[1]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
          : '',
        salesCheckedDateFrom: salesCheckedDate[0]
          ? dayjs(salesCheckedDate[0])
              .startOf('day')
              .format('YYYY-MM-DD HH:mm:ss')
          : '',
        salesCheckedDateTo: salesCheckedDate[1]
          ? dayjs(salesCheckedDate[1])
              .startOf('day')
              .format('YYYY-MM-DD HH:mm:ss')
          : '',
        salesCategory: salesCategory?.map(value => value.value) ?? [],

        search: search,
        take: invoiceListRowsPerPage,
        skip: invoiceListRowsPerPage * invoiceListPage,
        hidePaid: hidePaid,
        mine: mine,
      }

      if (JSON.stringify(defaultFilter) !== JSON.stringify(savedFilter)) {
        setDefaultFilter({
          ...savedFilter,
          payDueDate: payDueDate.map(item =>
            item ? dayjs(item).toDate() : undefined,
          ) as Date[],
          paidDate: paidDate.map(item =>
            item ? dayjs(item).toDate() : undefined,
          ) as Date[],
          invoiceDate: invoiceDate.map(item =>
            item ? dayjs(item).toDate() : undefined,
          ) as Date[],
          salesCheckedDate: salesCheckedDate.map(item =>
            item ? dayjs(item).toDate() : undefined,
          ) as Date[],
        })
        reset({
          ...savedFilter,
          payDueDate: payDueDate.map(item =>
            item ? dayjs(item).toDate() : undefined,
          ),
          paidDate: paidDate.map(item =>
            item ? dayjs(item).toDate() : undefined,
          ),
          invoiceDate: invoiceDate.map(item =>
            item ? dayjs(item).toDate() : undefined,
          ),
          salesCheckedDate: salesCheckedDate.map(item =>
            item ? dayjs(item).toDate() : undefined,
          ),
        })
      }
      if (JSON.stringify(filters) !== JSON.stringify(filter)) {
        setFilters(filter)
      }
      setHidePaidInvoices(hidePaid === '1')
      setSeeMyInvoices(mine === '1')
    } else {
      setFilters({ ...defaultFilters })
    }
  }, [savedFilter])

  return (
    <Grid container spacing={6}>
      <Grid
        item
        xs={12}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
      >
        <Typography variant='h5'>Invoice list</Typography>
        <ToggleViewButton menu={menu} setMenu={setMenu} />
      </Grid>
      {menu === 'list' ? (
        <Fragment>
          <Grid item xs={12}>
            <Filter
              serviceTypeList={serviceTypeList}
              categoryList={categoryList}
              setCategoryList={setCategoryList}
              setServiceTypeList={setServiceTypeList}
              onReset={onReset}
              onSubmit={onSubmit}
              role={currentRole!}
              clientList={clientList}
              clientListLoading={clientListLoading}
              companyList={companyList}
              companyListLoading={companiesListLoading}
              statusList={statusListForRole || []}
              statusListLoading={statusListForRoleLoading}
              handleSubmit={handleSubmit}
              control={control}
              trigger={trigger}
            />
          </Grid>
          <Grid
            item
            xs={12}
            display='flex'
            gap='10px'
            alignItems='center'
            justifyContent='flex-end'
          >
            <Box display='flex' alignItems='center' gap='4px'>
              <Typography>See only my invoices</Typography>
              <Switch checked={seeMyInvoices} onChange={handleSeeMyInvoices} />
            </Box>
            <Box display='flex' alignItems='center' gap='4px'>
              <Typography>Hide paid invoices</Typography>
              <Switch
                checked={hidePaidInvoices}
                onChange={handleHidePaidInvoices}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader
                title={
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='h6'>
                      Invoices ({list?.totalCount ?? 0})
                    </Typography>{' '}
                    {currentRole!.name !== 'CLIENT' ? (
                      <Button
                        variant='contained'
                        onClick={onClickCreateInvoice}
                      >
                        Create new invoice
                      </Button>
                    ) : null}
                  </Box>
                }
                sx={{
                  pb: 4,
                  '& .MuiCardHeader-title': { letterSpacing: '.15px' },
                }}
              />
              <ReceivableList
                isLoading={isLoading}
                list={list || { data: [], totalCount: 0, count: 0 }}
                page={invoiceListPage}
                pageSize={invoiceListRowsPerPage}
                setPage={setInvoiceListPage}
                setPageSize={setInvoiceListRowsPerPage}
                role={currentRole!}
                setFilters={setFilters}
                columns={getInvoiceReceivableListColumns(
                  statusList!,
                  currentRole!,
                  auth,
                  timezone.getValue(),
                )}
                type='list'
              />
            </Card>
          </Grid>
        </Fragment>
      ) : (
        <Grid item xs={12}>
          <CalendarContainer />
        </Grid>
      )}
    </Grid>
  )
}

Receivable.acl = {
  subject: 'invoice_receivable',
  action: 'read',
}
