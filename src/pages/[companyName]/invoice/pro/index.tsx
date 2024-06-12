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
import { useState } from 'react'
import Filter from './components/list/filter'
import { InvoiceProFilterType } from '@src/types/invoice/pro.type'
import { useForm } from 'react-hook-form'
import { useGetStatusList } from '@src/queries/common.query'
import { useGetProInvoiceList } from '@src/queries/invoice/pro.query'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { createInvoicePayable } from '@src/apis/invoice/payable.api'
import { useMutation } from 'react-query'
import useModal from '@src/hooks/useModal'
import SelectJobModal from 'src/pages/[companyName]/jobs/delivered-inactive-list/components/select-job-modal'
import List from './components/list/list'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { getInvoiceProListColumns } from '@src/shared/const/columns/pro-invoice'
import { useGetPayableList } from '@src/queries/invoice/payable.query'
import { InvoicePayableFilterType } from '@src/types/invoice/payable.type'
import CalendarContainer from '../payable/components/calendar'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { AxiosError } from 'axios'
import { timezoneSelector } from '@src/states/permission'

export type FilterType = {
  invoiceDate: Date[]

  paidDate: Date[]

  invoiceStatus: Array<{ label: string; value: number }>

  search: string
}

const defaultValues: FilterType = {
  invoiceDate: [],

  paidDate: [],

  invoiceStatus: [],

  search: '',
}

const defaultFilters: InvoicePayableFilterType = {
  invoiceStatus: [],

  invoicedDateFrom: '',
  invoicedDateTo: '',

  paidDateFrom: '',
  paidDateTo: '',

  search: '',

  hidePaid: '0',

  skip: 0,
  take: 10,
}

const ProInvoice = () => {
  const { openModal, closeModal } = useModal()
  const router = useRouter()

  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const [invoiceListPage, setInvoiceListPage] = useState(0)
  const [invoiceListRowsPerPage, setInvoiceListRowsPerPage] = useState(10)

  const [hidePaidInvoices, setHidePaidInvoices] = useState(false)
  const [menu, setMenu] = useState<ToggleMenuType>('list')

  const { control, handleSubmit, trigger, reset } = useForm<FilterType>({
    defaultValues,
    mode: 'onSubmit',
  })

  const [filters, setFilters] =
    useState<InvoicePayableFilterType>(defaultFilters)
  // const { data: list, isLoading } = useGetProInvoiceList(defaultFilters)
  const { data: list, isLoading } = useGetPayableList(filters)

  const { data: statusList, isLoading: statusListLoading } =
    useGetStatusList('InvoicePayable')

  const handleHidePaidInvoices = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHidePaidInvoices(event.target.checked)
    setFilters(prevState => ({
      ...prevState,
      hidePaid: event.target.checked ? '1' : '0',
    }))
  }

  const createInvoiceMutation = useMutation(
    (params: {
      // invoiceStatus: string
      // description: string
      // taxInfo: string
      // taxRate: number
      currency: string
      // totalPrice: number
      subtotal: number
      // tax: number
      jobIds: number[]
      // invoicedAt: string
      // invoicedTimezone: CountryType
    }) => createInvoicePayable(params),
    {
      onSuccess: res => {
        closeModal('CreateInvoiceModal')
        router.push(`/invoice/pro/detail/${res?.id}`)
        toast.success('Success', {
          position: 'bottom-left',
        })
      },
      onError: (res: any) => {
        if (
          res.response?.data?.message ===
          `Pro's payment information is not saved`
        ) {
          openModal({
            type: 'ErrorModal',
            children: (
              <CustomModal
                title={
                  <>
                    Payment information is a prerequisite for invoice creation.
                    Please register your payment information first.
                  </>
                }
                onClose={() => closeModal('ErrorModal')}
                soloButton={true}
                rightButtonText='Go to payment info.'
                vary='error'
                onClick={() => {
                  closeModal('ErrorModal')
                  closeModal('CreateInvoiceModal')
                  router.push('/mypage/pro/')
                }}
              />
            ),
          })
        } else {
          toast.error('Something went wrong. Please try again.', {
            position: 'bottom-left',
          })
        }
      },
    },
  )

  const onSubmit = (data: FilterType) => {
    const {
      invoiceDate,

      paidDate,
      invoiceStatus,
      search,
    } = data

    const filter: InvoicePayableFilterType = {
      invoiceStatus: invoiceStatus.map(value => value.value),

      invoicedDateFrom: invoiceDate[0]?.toISOString() ?? '',
      invoicedDateTo: invoiceDate[1]?.toISOString() ?? '',

      paidDateFrom: paidDate[0]?.toISOString() ?? '',
      paidDateTo: paidDate[1]?.toISOString() ?? '',

      search: search,
      take: invoiceListRowsPerPage,
      skip: invoiceListRowsPerPage * invoiceListPage,
    }

    setFilters(filter)
  }

  function onReset() {
    reset(defaultValues)
    setFilters({ ...defaultFilters })
  }

  const handleCreateInvoice = (data: {
    // invoiceStatus: string
    // description: string
    // taxInfo: string
    // taxRate: number
    currency: string
    // totalPrice: number
    subtotal: number
    // tax: number
    jobIds: number[]
    // invoicedAt: string
    // invoicedTimezone: CountryType
  }) => {
    createInvoiceMutation.mutate(data)
  }

  const onClickCreateInvoice = () => {
    openModal({
      type: 'CreateInvoiceModal',
      children: (
        <SelectJobModal
          onClose={() => closeModal('CreateInvoiceModal')}
          onClick={handleCreateInvoice}
        />
      ),
    })
  }

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
      <Grid item xs={12}>
        <Card
          sx={{
            padding: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <ul style={{ paddingLeft: '24px' }}>
            <li
              style={{
                color: '#666CFF',
              }}
            >
              <Typography variant='body1'>
                All approved jobs in each month&nbsp;
                <Typography variant='body1' fontWeight={700} component={'span'}>
                  must be invoiced
                </Typography>
                &nbsp;by the 15th of the following month.
              </Typography>
            </li>
            <li
              style={{
                color: '#666CFF',
              }}
            >
              <Typography variant='body1'>
                <Typography variant='body1' fontWeight={700} component={'span'}>
                  Payment process begins
                </Typography>
                &nbsp;in the middle of the month following the day the invoice
                is created.
              </Typography>
            </li>
          </ul>
          <img
            src='/images/icons/invoice/announce.png'
            alt='invoice list'
            style={{ marginRight: '30px' }}
          />
        </Card>
      </Grid>

      {menu === 'list' ? (
        <>
          <Grid item xs={12}>
            <Filter
              filter={filters}
              setFilter={setFilters}
              control={control}
              statusList={statusList ?? []}
              onReset={onReset}
              onSubmit={onSubmit}
              handleSubmit={handleSubmit}
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
              <Typography variant='body2'>Hide paid invoices</Typography>
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
                    <Button variant='contained' onClick={onClickCreateInvoice}>
                      Create new invoice
                    </Button>
                  </Box>
                }
                sx={{
                  pb: 4,
                  '& .MuiCardHeader-title': { letterSpacing: '.15px' },
                }}
              />
              <List
                isLoading={isLoading}
                // TODO: invoice pro  status code 확인해야함
                columns={getInvoiceProListColumns(
                  // [
                  //   { value: 50000, label: 'Invoiced' },
                  //   { value: 50100, label: 'Under revision' },
                  //   { value: 50200, label: 'Revised' },
                  //   { value: 50300, label: 'Paid' },
                  // ],
                  statusList!,
                  auth,
                  timezone.getValue(),
                )}
                page={invoiceListPage}
                pageSize={invoiceListRowsPerPage}
                setPage={(num: number) => {
                  setInvoiceListPage(num)
                  setFilters({ ...filters, skip: num * invoiceListRowsPerPage })
                }}
                setPageSize={(num: number) => {
                  setInvoiceListRowsPerPage(num)
                  setFilters({ ...filters, take: num })
                }}
                list={list || { data: [], totalCount: 0, count: 0 }}
                type='list'
              />
            </Card>
          </Grid>
        </>
      ) : (
        <Grid item xs={12}>
          <CalendarContainer type='pro' statusList={statusList!} />
        </Grid>
      )}
    </Grid>
  )
}

export default ProInvoice

ProInvoice.acl = {
  subject: 'invoice_pro',
  action: 'read',
}
