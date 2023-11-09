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
  TextField,
} from '@mui/material'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePicker from 'react-datepicker'

// ** apis
import { ProInvoiceListFilterType } from '@src/types/invoice/common.type'
import { useGetStatusList } from '@src/queries/common.query'
import { InvoicePayableFilterType } from '@src/types/invoice/payable.type'

// ** types

type Props = {
  filter: InvoicePayableFilterType
  setFilter: (n: InvoicePayableFilterType) => void
  onReset: () => void
  search: () => void
  statusList: Array<{
    label: string
    value: number
  }>
}

type FilterType = Pick<InvoicePayableFilterType, 'invoiceStatus'>

export default function Filter({ filter, setFilter, onReset, search, statusList }: Props) {
  const [collapsed, setCollapsed] = useState<boolean>(true)

  const commonOptions = {
    autoHighlight: true,
    fullWidth: true,
    disableCloseOnSelect: true,
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
                <Grid item xs={6} sm={6} md={6}>
                  <FormControl fullWidth>
                    <Autocomplete
                      {...commonOptions}
                      multiple
                      options={statusList || []}
                      getOptionLabel={option => option.label}
                      value={
                        !statusList
                          ? []
                          : statusList?.filter(item =>
                              filter.invoiceStatus?.includes(item.value),
                            )
                      }
                      limitTags={1}
                      onChange={(e, v) =>
                        setFilter({
                          ...filter,
                          invoiceStatus: v.map(item => item.value),
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

                {/* invoice date */}
                <Grid item xs={6} sm={6} md={6}>
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
                <Grid item xs={6} sm={6} md={6}>
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
                <Grid item xs={6} sm={6} md={6}>
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
