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

import { ProInvoiceListFilterType } from '@src/types/invoice/common.type'
import { Fragment, Suspense, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Filter from './list/filters'
import ProInvoiceList from './list/list'
import CalendarContainer from './calendar'
import { useGetPayableList } from '@src/queries/invoice/payable.query'
import { InvoicePayableFilterType } from '@src/types/invoice/payable.type'
import { useGetStatusList } from '@src/queries/common.query'
import { useQueryClient } from 'react-query'

// const initialFilter: ProInvoiceListFilterType = {
//   status: [],
//   invoicedDateFrom: '',
//   invoicedDateTo: '',
//   payDueDateFrom: '',
//   payDueDateTo: '',
//   paidDateFrom: '',
//   paidDateTo: '',

//   mine: 0,
//   hidePaid: 0,

//   skip: 0,
//   take: 10,
// }

const defaultFilters: InvoicePayableFilterType = {
  invoiceStatus: [],

  invoicedDateFrom: '',
  invoicedDateTo: '',

  paidDateFrom: '',
  paidDateTo: '',

  search: '',

  mine: '0',
  hidePaid: '0',

  skip: 0,
  take: 10,
}

type Props = { id: number }

const ProInvoices = ({ id }: Props) => {
  const queryClient = useQueryClient()
  const [menu, setMenu] = useState<ToggleMenuType>('list')
  const [skip, setSkip] = useState(0)
  const [filter, setFilter] = useState<InvoicePayableFilterType>(defaultFilters)
  const [activeFilter, setActiveFilter] =
    useState<InvoicePayableFilterType>(defaultFilters)

  // const { data: invoices, isLoading } = useGetProInvoiceList(id, activeFilter)
  const { data: invoices, isLoading } = useGetPayableList({
    ...activeFilter,
    pro: [id],
  })
  const { data: statusList } = useGetStatusList('InvoicePayable')
  function onSearch() {
    setActiveFilter({
      ...filter,
      skip: skip * activeFilter.take,
      take: activeFilter.take,
    })
    queryClient.invalidateQueries([
      'invoice/payable/list',
      { ...filter, skip: skip * activeFilter.take, take: activeFilter.take },
    ])
  }

  function onReset() {
    setFilter({ ...defaultFilters })
    setActiveFilter({ ...defaultFilters })
    queryClient.invalidateQueries([
      'invoice/payable/list',
      { ...defaultFilters },
    ])
  }

  useEffect(() => {
    queryClient.invalidateQueries(['invoice/payable/list'])
  }, [])
  return (
    <Suspense>
      <Grid container spacing={6}>
        <Grid
          item
          xs={12}
          display='flex'
          justifyContent='flex-end'
          alignItems='center'
        >
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
                  checked={activeFilter.mine === '1'}
                  onChange={e =>
                    setActiveFilter({
                      ...activeFilter,
                      mine: e.target.checked ? '1' : '0',
                    })
                  }
                />
              </Box>
              <Box display='flex' alignItems='center' gap='4px'>
                <Typography>Hide paid invoices</Typography>
                <Switch
                  checked={activeFilter.hidePaid === '1'}
                  onChange={e =>
                    setActiveFilter({
                      ...activeFilter,
                      hidePaid: e.target.checked ? '1' : '0',
                    })
                  }
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title={
                    <Box display='flex' justifyContent='space-between'>
                      <Typography variant='h6'>
                        Invoices ({invoices?.totalCount ?? 0})
                      </Typography>{' '}
                    </Box>
                  }
                  sx={{
                    pb: 4,
                    '& .MuiCardHeader-title': { letterSpacing: '.15px' },
                  }}
                />
                <ProInvoiceList
                  isLoading={isLoading}
                  list={invoices || { data: [], totalCount: 0 }}
                  pageSize={activeFilter.take}
                  skip={skip}
                  setSkip={(n: number) => {
                    setSkip(n)
                    setActiveFilter({
                      ...activeFilter,
                      skip: n * activeFilter.take!,
                    })
                  }}
                  setPageSize={(n: number) =>
                    setActiveFilter({ ...activeFilter, take: n })
                  }
                  statusList={statusList!}
                />
              </Card>
            </Grid>
          </Fragment>
        ) : (
          <Grid item xs={12}>
            <CalendarContainer statusList={statusList!} userId={id} />
          </Grid>
        )}
      </Grid>
    </Suspense>
  )
}

export default ProInvoices
