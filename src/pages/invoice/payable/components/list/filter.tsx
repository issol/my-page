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
import { useGetInvoicePayableStatus } from '@src/queries/invoice/common.query'

// ** types
import { InvoicePayableFilterType } from '@src/types/invoice/payable.type'
import { useGetProList } from '@src/queries/pro/pro-list.query'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { useGetStatusList } from '@src/queries/common.query'
import dayjs from 'dayjs'

type Props = {
  filter: InvoicePayableFilterType
  setFilter: (n: InvoicePayableFilterType) => void
  onReset: () => void
  search: () => void
  statusList: {
    value: number
    label: string
  }[]
}

export default function Filter({
  filter,
  setFilter,
  onReset,
  search,
  statusList,
}: Props) {
  const [collapsed, setCollapsed] = useState<boolean>(true)

  //TODO: 프로 전체 list를 필터에 표시하는건 pro가 많아질 수록 좋지 않음. 이런식의 필터는 일괄 변경하는 방향으로 기획에 문의하기 (추후에) [bon]
  const { data: proList } = useGetProList({ take: 100, skip: 0 })

  const commonOptions = {
    autoHighlight: true,
    fullWidth: true,
    disableCloseOnSelect: true,
  }

  const dateValue = (startDate?: string, endDate?: string) => {
    return startDate === endDate
      ? dayjs(startDate).format('MM/DD/YYYY')
      : `${dayjs(startDate).format('MM/DD/YYYY')}${
          endDate ? ` - ${dayjs(endDate).format('MM/DD/YYYY')}` : ''
        }`
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
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <Autocomplete
                      {...commonOptions}
                      multiple
                      disableCloseOnSelect
                      // loading={isLoading}
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
                      id='status'
                      renderInput={params => (
                        <TextField {...params} label='Status' />
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
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <Autocomplete
                      {...commonOptions}
                      multiple
                      disableCloseOnSelect
                      options={proList?.data || []}
                      getOptionLabel={option => option.id}
                      value={
                        !proList
                          ? []
                          : proList.data?.filter(pro =>
                              filter.proId?.includes(pro.userId),
                            )
                      }
                      limitTags={1}
                      onChange={(e, v) =>
                        setFilter({
                          ...filter,
                          proId: v.map(i => i.userId),
                        })
                      }
                      renderInput={params => (
                        <TextField {...params} label='Pro' />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {getLegalName({
                            firstName: option.firstName,
                            middleName: option.middleName,
                            lastName: option.lastName,
                          })}
                        </li>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
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
                          invoicedDateFrom: e[0]?.toISOString(),
                          invoicedDateTo: e[1]?.toISOString(),
                        })
                      }}
                      placeholderText=''
                      customInput={
                        <Box>
                          <CustomInput
                            label='Invoice date'
                            icon='calendar'
                            placeholder='MM/DD/YYYY - MM/DD/YYYY'
                            value={
                              filter?.invoicedDateTo || filter?.invoicedDateFrom
                                ? dateValue(
                                    filter?.invoicedDateFrom,
                                    filter?.invoicedDateTo,
                                  )
                                : ''
                            }
                          />
                        </Box>
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
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
                        <Box>
                          <CustomInput
                            label='Payment due'
                            icon='calendar'
                            placeholder='MM/DD/YYYY - MM/DD/YYYY'
                            value={
                              filter?.payDueDateTo || filter?.payDueDateFrom
                                ? dateValue(
                                    filter?.payDueDateFrom,
                                    filter?.payDueDateTo,
                                  )
                                : ''
                            }
                          />
                        </Box>
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
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
                        <Box>
                          <CustomInput
                            label='Payment date'
                            icon='calendar'
                            placeholder='MM/DD/YYYY - MM/DD/YYYY'
                            value={
                              filter?.paidDateTo || filter?.paidDateFrom
                                ? dateValue(
                                    filter?.paidDateFrom,
                                    filter?.paidDateTo,
                                  )
                                : ''
                            }
                          />
                        </Box>
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
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
