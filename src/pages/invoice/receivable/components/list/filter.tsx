import { useState } from 'react'

// ** style components
import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePicker from 'react-datepicker'

// ** apis
import { useGetInvoiceStatus } from '@src/queries/invoice/common.query'
import { InvoiceReceivableFilterType } from '@src/types/invoice/receivable.type'
import { CategoryList } from '@src/shared/const/category/categories'
import { ConstType } from '@src/pages/onboarding/client-guideline'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'
import { RevenueFrom } from '@src/shared/const/revenue-from'
import { SalesCategory } from '@src/shared/const/sales-category'
import { useGetClientList } from '@src/queries/client.query'

// ** types

type Props = {
  filter: InvoiceReceivableFilterType
  setFilter: (n: InvoiceReceivableFilterType) => void
  onReset: () => void
  search: () => void
  serviceType: Array<ConstType>
}

type FilterType = Pick<
  InvoiceReceivableFilterType,
  | 'invoiceStatus'
  | 'clientId'
  | 'category'
  | 'serviceType'
  | 'revenueFrom'
  | 'salesCategory'
>

export default function Filter({
  filter,
  setFilter,
  onReset,
  search,
  serviceType,
}: Props) {
  const [collapsed, setCollapsed] = useState<boolean>(true)

  const { data: statusList, isLoading } = useGetInvoiceStatus()
  const { data, isLoading: isClientLoading } = useGetClientList({
    skip: 0,
    take: 1000,
  })
  const clientList = data?.data || []

  const commonOptions = {
    autoHighlight: true,
    fullWidth: true,
    disableCloseOnSelect: true,
  }

  function filterValue(option: any, keyName: keyof FilterType) {
    return !filter[keyName]
      ? option[0]
      : option.filter((item: { value: string; label: string }) =>
          filter[keyName]?.includes(item.value),
        )
  }

  return (
    <DatePickerWrapper>
      <Grid item xs={12}>
        <Card style={{ overflow: 'visible' }}>
          <CardHeader
            title='Search Filters'
            action={
              <IconButton
                size='small'
                aria-label='collapse'
                sx={{ color: 'text.secondary' }}
                onClick={() => setCollapsed(!collapsed)}
              >
                <Icon
                  fontSize={20}
                  icon={!collapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'}
                />
              </IconButton>
            }
          />
          <Collapse in={collapsed}>
            <CardContent>
              <Grid container spacing={6} rowSpacing={4}>
                {/* status */}
                <Grid item xs={6} sm={6} md={3}>
                  <FormControl fullWidth>
                    <Autocomplete
                      {...commonOptions}
                      multiple
                      loading={isLoading}
                      options={statusList || []}
                      getOptionLabel={option => option.statusName}
                      value={
                        !statusList
                          ? []
                          : statusList?.filter(item =>
                              filter.invoiceStatus?.includes(item.statusName),
                            )
                      }
                      limitTags={1}
                      onChange={(e, v) =>
                        setFilter({
                          ...filter,
                          invoiceStatus: v.map(item => item.statusName),
                        })
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Status'
                          placeholder='Status'
                        />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {option.statusName}
                        </li>
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* client */}
                <Grid item xs={6} sm={6} md={3}>
                  <FormControl fullWidth>
                    <Autocomplete
                      {...commonOptions}
                      multiple
                      loading={isClientLoading}
                      options={clientList || []}
                      getOptionLabel={option => option.name}
                      value={
                        !clientList
                          ? []
                          : clientList?.filter(item =>
                              filter.invoiceStatus?.includes(item.name),
                            )
                      }
                      limitTags={1}
                      onChange={(e, v) =>
                        setFilter({
                          ...filter,
                          clientId: v.map(item => item.name),
                        })
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Client'
                          placeholder='Client'
                        />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {option.name}
                        </li>
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* category */}
                <Grid item xs={6} sm={6} md={3}>
                  <FormControl fullWidth>
                    <Autocomplete
                      {...commonOptions}
                      multiple
                      options={CategoryList}
                      value={filterValue(CategoryList, 'category')}
                      limitTags={1}
                      onChange={(e, v) =>
                        setFilter({
                          ...filter,
                          category: v.map(item => item.value),
                        })
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Status'
                          placeholder='Status'
                        />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {option.label}
                        </li>
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* service type */}
                <Grid item xs={6} sm={6} md={3}>
                  <FormControl fullWidth>
                    <Autocomplete
                      autoHighlight
                      fullWidth
                      multiple
                      options={serviceType || []}
                      value={filterValue(ServiceTypeList, 'serviceType')}
                      onChange={(e, v) =>
                        setFilter({
                          ...filter,
                          serviceType: v.map(item => item.value),
                        })
                      }
                      id='serviceType'
                      getOptionLabel={option => option.label}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Service type'
                          placeholder='Service type'
                        />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {option.label}
                        </li>
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* invoice date */}
                <Grid item xs={6} sm={6} md={3}>
                  <FormControl fullWidth>
                    <DatePicker
                      selectsRange
                      monthsShown={2}
                      endDate={
                        filter?.invoicedDateTo
                          ? new Date(filter.invoicedDateTo)
                          : null
                      }
                      startDate={
                        filter?.invoicedDateFrom
                          ? new Date(filter.invoicedDateFrom)
                          : null
                      }
                      shouldCloseOnSelect={false}
                      onChange={e => {
                        if (!e.length) return
                        setFilter({
                          ...filter,
                          invoicedDateFrom: e[0]?.toString(),
                          invoicedDateTo: e[1]?.toString(),
                        })
                      }}
                      customInput={
                        <CustomInput label='Invoice date' icon='calendar' />
                      }
                    />
                  </FormControl>
                </Grid>

                {/* payment due */}
                <Grid item xs={6} sm={6} md={3}>
                  <FormControl fullWidth>
                    <DatePicker
                      selectsRange
                      monthsShown={2}
                      endDate={
                        filter?.payDueDateTo
                          ? new Date(filter.payDueDateTo)
                          : null
                      }
                      startDate={
                        filter?.payDueDateFrom
                          ? new Date(filter.payDueDateFrom)
                          : null
                      }
                      shouldCloseOnSelect={false}
                      onChange={e => {
                        if (!e.length) return
                        setFilter({
                          ...filter,
                          payDueDateFrom: e[0]?.toString(),
                          payDueDateTo: e[1]?.toString(),
                        })
                      }}
                      customInput={
                        <CustomInput label='Payment due' icon='calendar' />
                      }
                    />
                  </FormControl>
                </Grid>

                {/* payment date */}
                <Grid item xs={6} sm={6} md={3}>
                  <FormControl fullWidth>
                    <DatePicker
                      selectsRange
                      monthsShown={2}
                      endDate={
                        filter?.paidDateTo ? new Date(filter.paidDateTo) : null
                      }
                      startDate={
                        filter?.paidDateFrom
                          ? new Date(filter.paidDateFrom)
                          : null
                      }
                      shouldCloseOnSelect={false}
                      onChange={e => {
                        if (!e.length) return
                        setFilter({
                          ...filter,
                          paidDateFrom: e[0]?.toString(),
                          paidDateTo: e[1]?.toString(),
                        })
                      }}
                      customInput={
                        <CustomInput label='Payment date' icon='calendar' />
                      }
                    />
                  </FormControl>
                </Grid>

                {/* sales recognition date */}
                <Grid item xs={6} sm={6} md={3}>
                  <FormControl fullWidth>
                    <DatePicker
                      selectsRange
                      monthsShown={2}
                      endDate={
                        filter?.salesCheckedDateTo
                          ? new Date(filter.salesCheckedDateTo)
                          : null
                      }
                      startDate={
                        filter?.salesCheckedDateFrom
                          ? new Date(filter.salesCheckedDateFrom)
                          : null
                      }
                      shouldCloseOnSelect={false}
                      onChange={e => {
                        if (!e.length) return
                        setFilter({
                          ...filter,
                          salesCheckedDateFrom: e[0]?.toString(),
                          salesCheckedDateTo: e[1]?.toString(),
                        })
                      }}
                      customInput={
                        <CustomInput
                          label='Sales recognition date'
                          icon='calendar'
                        />
                      }
                    />
                  </FormControl>
                </Grid>

                {/* revenue from */}
                <Grid item xs={6} sm={6} md={3}>
                  <FormControl fullWidth>
                    <Autocomplete
                      {...commonOptions}
                      multiple
                      options={RevenueFrom}
                      value={filterValue(RevenueFrom, 'revenueFrom')}
                      limitTags={1}
                      onChange={(e, v) =>
                        setFilter({
                          ...filter,
                          revenueFrom: v.map(item => item.value),
                        })
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Revenue from'
                          placeholder='Revenue from'
                        />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {option.label}
                        </li>
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* sales category */}
                <Grid item xs={6} sm={6} md={3}>
                  <FormControl fullWidth>
                    <Autocomplete
                      {...commonOptions}
                      multiple
                      options={SalesCategory}
                      value={filterValue(SalesCategory, 'salesCategory')}
                      limitTags={1}
                      onChange={(e, v) =>
                        setFilter({
                          ...filter,
                          salesCategory: v.map(item => item.value),
                        })
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Sales category'
                          placeholder='Sales category'
                        />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {option.label}
                        </li>
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* search projects */}
                <Grid item xs={12} sm={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Search Pros</InputLabel>
                    <OutlinedInput
                      label='Search Pros'
                      value={filter.search}
                      onChange={e =>
                        setFilter({ ...filter, search: e.target.value })
                      }
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton edge='end'>
                            <Icon icon='mdi:magnify' />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>

                {/* buttons */}
                <Grid item xs={12}>
                  <Box display='flex' justifyContent='flex-end' gap='15px'>
                    <Button
                      variant='outlined'
                      size='medium'
                      color='secondary'
                      onClick={onReset}
                    >
                      Reset
                    </Button>
                    <Button variant='contained' size='medium' onClick={search}>
                      Search
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Collapse>
        </Card>
      </Grid>
    </DatePickerWrapper>
  )
}
