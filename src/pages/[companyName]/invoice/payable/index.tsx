import { Fragment, useContext, useEffect, useMemo, useState } from 'react'

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

// ** contexts
import { AbilityContext } from '@src/layouts/components/acl/Can'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

// ** types
import { InvoicePayableFilterType } from '@src/types/invoice/payable.type'

// ** components
import Filter from './components/list/filter'
import PayableList from './components/list/list'
import CalendarContainer from './components/calendar'

// ** apis
import { useGetPayableList } from '@src/queries/invoice/payable.query'
import { Icon } from '@iconify/react'
import { updateInvoicePaidStatus } from '@src/apis/invoice/payable.api'
import { useGetStatusList } from '@src/queries/common.query'

// ** hooks
import useModal from '@src/hooks/useModal'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'

import { convertLocalToUtc } from '@src/shared/helpers/date.helper'
import moment from 'moment-timezone'
import { getInvoicePayableListColumns } from '@src/shared/const/columns/invoice-payable'
import { timezoneSelector } from '@src/states/permission'
import ModalWithDatePicker from 'src/pages/[companyName]/client/components/modals/modal-with-datepicker'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import {
  FilterKey,
  getUserFilters,
  saveUserFilters,
} from '@src/shared/filter-storage'

const initialFilter: InvoicePayableFilterType = {
  invoiceStatus: [],
  proId: [],
  invoicedDateFrom: '',
  invoicedDateTo: '',
  payDueDateFrom: '',
  payDueDateTo: '',
  paidDateFrom: '',
  paidDateTo: '',
  search: '',
  skip: 0,
  take: 10,
}

export default function Payable() {
  const queryClient = useQueryClient()
  const ability = useContext(AbilityContext)
  const user = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const savedFilter: InvoicePayableFilterType | null = getUserFilters(
    FilterKey.INVOICE_PAYABLE_LIST,
  )
    ? JSON.parse(getUserFilters(FilterKey.INVOICE_PAYABLE_LIST)!)
    : null

  const { data: statusList } = useGetStatusList('InvoicePayable')

  const { openModal, closeModal } = useModal()

  const isAccountManager = ability.can('read', 'account_manage')

  const [menu, setMenu] = useState<ToggleMenuType>('list')

  const [skip, setSkip] = useState(0)
  const [hidePaidInvoices, setHidePaidInvoices] = useState(false)
  const [seeMyInvoices, setSeeMyInvoices] = useState(false)

  const [defaultFilter, setDefaultFilter] =
    useState<InvoicePayableFilterType>(initialFilter)
  const [filter, setFilter] = useState<InvoicePayableFilterType>(initialFilter)
  const [activeFilter, setActiveFilter] =
    useState<InvoicePayableFilterType | null>(null)

  const [statuses, setStatuses] = useState<number[]>([])

  const { data: list, isLoading } = useGetPayableList(activeFilter)

  const userTimezone = useMemo(() => {
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return user.getValue().user?.timezone.label || browserTimezone
  }, [user])

  const onSearch = () => {
    if (activeFilter) {
      const postFilter = {
        ...filter,
        skip: skip * activeFilter.take,
        take: activeFilter.take,
        invoicedDateFrom: filter.invoicedDateFrom
          ? convertLocalToUtc(
              moment(filter.invoicedDateFrom).format('YYYY-MM-DD'),
              userTimezone,
            )
          : undefined,
        invoicedDateTo: filter.invoicedDateTo
          ? convertLocalToUtc(
              moment(filter.invoicedDateTo).add(1, 'day').format(),
              userTimezone,
              true,
            )
          : undefined,
        payDueDateFrom: filter.payDueDateFrom
          ? convertLocalToUtc(
              moment(filter.payDueDateFrom).format(),
              userTimezone,
            )
          : undefined,
        payDueDateTo: filter.payDueDateTo
          ? convertLocalToUtc(
              moment(filter.payDueDateTo).add(1, 'day').format(),
              userTimezone,
              true,
            )
          : undefined,
        paidDateFrom: filter.paidDateFrom
          ? convertLocalToUtc(
              moment(filter.paidDateFrom).format(),
              userTimezone,
            )
          : undefined,
        paidDateTo: filter.paidDateTo
          ? convertLocalToUtc(
              moment(filter.paidDateTo).add(1, 'day').format(),
              userTimezone,
              true,
            )
          : undefined,
      }
      setActiveFilter(postFilter)
      saveUserFilters(FilterKey.INVOICE_PAYABLE_LIST, postFilter)
      setDefaultFilter(postFilter)
    }
  }

  const onReset = () => {
    setFilter({ ...initialFilter })
    setActiveFilter({ ...initialFilter })
    saveUserFilters(FilterKey.INVOICE_PAYABLE_LIST, {
      ...initialFilter,
      isHidePaid: hidePaidInvoices ? '1' : '0',
      isMyJobs: seeMyInvoices ? '1' : '0',
    })
  }

  const updateInvoicePaidStatusMutation = useMutation(
    (data: {
      payableId: number
      paidAt: string
      paidDateTimezone: CountryType
    }) =>
      updateInvoicePaidStatus(
        data.payableId,
        data.paidAt,
        data.paidDateTimezone,
      ),
    {
      onSuccess: () => {
        setStatuses([])
        queryClient.invalidateQueries({ queryKey: 'invoice/payable/detail' })
        queryClient.invalidateQueries({ queryKey: 'invoice/payable/list' })
      },
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )

  const onChangeStatusToPaid = () => {
    openModal({
      type: 'changeStatus',
      children: (
        <ModalWithDatePicker
          title={`Mark as paid?`}
          message={`Are you sure you want to mark ${statuses.length} invoice(s) as paid? The payment date will be applied to all selected invoice(s).`}
          onClick={({
            paymentAt,
            paymentTimezone,
          }: {
            paymentAt: Date
            paymentTimezone: CountryType
          }) => {
            statuses.forEach(st => {
              updateInvoicePaidStatusMutation.mutateAsync({
                payableId: st,
                paidAt: paymentAt.toISOString(),
                paidDateTimezone: paymentTimezone,
              })
            })
          }}
          onClose={() => closeModal('changeStatus')}
          rightButtonName='Confirm'
          leftButtonName='Cancel'
          contactPersonTimezone={user.getValue().user?.timezone ?? null}
        />
      ),
    })
  }

  useEffect(() => {
    queryClient.invalidateQueries(['invoice/payable/list'])
    queryClient.invalidateQueries(['invoice/payable/detail'])
    queryClient.invalidateQueries(['invoice/payable/calendar'])
    queryClient.invalidateQueries(['invoice/payable/detail/jobs'])
    queryClient.invalidateQueries(['invoice/payable/history'])
  }, [])

  useEffect(() => {
    if (savedFilter) {
      if (JSON.stringify(defaultFilter) !== JSON.stringify(savedFilter)) {
        setDefaultFilter(savedFilter)
        setFilter(savedFilter)
        setActiveFilter(savedFilter)
        setHidePaidInvoices(savedFilter.hidePaid === '1')
        setSeeMyInvoices(savedFilter.mine === '1')
      }
    } else {
      setFilter(initialFilter)
      setActiveFilter(initialFilter)
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
              filter={filter}
              setFilter={setFilter}
              onReset={onReset}
              search={onSearch}
              statusList={statusList!}
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
              <Switch
                checked={seeMyInvoices}
                onChange={e => {
                  setSeeMyInvoices(e.target.checked)
                  setActiveFilter({
                    ...activeFilter!,
                    mine: e.target.checked ? '1' : '0',
                  })
                  saveUserFilters(FilterKey.INVOICE_PAYABLE_LIST, {
                    ...defaultFilter,
                    mine: e.target.checked ? '1' : '0',
                  })
                }}
              />
            </Box>
            <Box display='flex' alignItems='center' gap='4px'>
              <Typography>Hide paid invoices</Typography>
              <Switch
                checked={hidePaidInvoices}
                onChange={e => {
                  setHidePaidInvoices(e.target.checked)
                  setActiveFilter({
                    ...activeFilter!,
                    hidePaid: e.target.checked ? '1' : '0',
                  })
                  saveUserFilters(FilterKey.INVOICE_PAYABLE_LIST, {
                    ...defaultFilter,
                    hidePaid: e.target.checked ? '1' : '0',
                  })
                }}
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
                    {isAccountManager ? (
                      <Button
                        variant='contained'
                        disabled={!statuses.length}
                        onClick={onChangeStatusToPaid}
                        startIcon={<Icon icon='gg:check-o' />}
                      >
                        Paid
                      </Button>
                    ) : null}
                  </Box>
                }
                sx={{
                  pb: 4,
                  '& .MuiCardHeader-title': { letterSpacing: '.15px' },
                }}
              />
              <PayableList
                list={list || { data: [], totalCount: 0 }}
                statusList={statusList!}
                statuses={statuses}
                setStatuses={setStatuses}
                isLoading={isLoading}
                isAccountManager={isAccountManager}
                pageSize={activeFilter?.take ?? 10}
                skip={skip}
                setSkip={(n: number) => {
                  setSkip(n)
                  setActiveFilter({
                    ...activeFilter!,
                    skip: n * (activeFilter?.take ?? 10),
                  })
                }}
                setPageSize={(n: number) =>
                  setActiveFilter({ ...activeFilter!, take: n })
                }
                type='list'
                columns={getInvoicePayableListColumns(
                  statusList!,
                  user,
                  timezone,
                  'list',
                )}
              />
            </Card>
          </Grid>
        </Fragment>
      ) : (
        <Grid item xs={12}>
          <CalendarContainer type='lpm' statusList={statusList!} />
        </Grid>
      )}
    </Grid>
  )
}

Payable.acl = {
  subject: 'invoice_payable',
  action: 'read',
}
