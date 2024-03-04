// ** React imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { Box } from '@mui/system'
import Collapse from '@mui/material/Collapse'
import CardContent from '@mui/material/CardContent'
import {
  Button,
  Card,
  CardHeader,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

// ** Styled Component Import
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'

import { styled } from '@mui/system'

// ** Icon Imports
import Icon from '@src/@core/components/icon'

// ** values
import { CategoryList } from '@src/shared/const/category/categories'
// import { JobStatus } from '@src/shared/const/status/statuses'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'

// ** types
import { FilterType } from './list-view'
import { ConstType } from '@src/pages/onboarding/client-guideline'
import { ClientRowType } from '@src/apis/client.api'
import { useGetStatusList } from '@src/queries/common.query'
import moment from 'moment'
import dayjs from 'dayjs'

type Props = {
  filter: FilterType
  setFilter: <T extends FilterType>(v: T) => void
  onSearch: () => void
  onReset: () => void
  serviceTypeOptions: Array<ConstType>
  clients: Array<ClientRowType>
}

export default function Filters({
  filter,
  setFilter,
  onSearch,
  onReset,
  serviceTypeOptions,
  clients,
}: Props) {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] =
    direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const { data: statusList } = useGetStatusList('Job')

  function filterValue(
    option: any,
    keyName: keyof Pick<FilterType, 'client' | 'category' | 'serviceType'>,
  ): Array<{ value: string; label: string }> {
    return !filter[keyName]
      ? option[0]
      : option?.filter((item: { value: string; label: string }) =>
          filter[keyName]?.includes(item.value),
        )
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
      <Box width='100%'>
        <Card style={{ overflow: 'visible' }}>
          {/* <CardHeader
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
          /> */}

          <CardContent>
            <Grid container spacing={6} rowSpacing={4}>
              <Grid item xs={6} sm={6} md={3}>
                <Box className='filterFormAutoComplete'>
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    multiple
                    limitTags={1}
                    disableCloseOnSelect
                    // TODO 고도화 이후 변경
                    options={statusList!.filter(
                      value => value.value !== 601100,
                    )}
                    value={statusList?.filter(status =>
                      filter.status?.includes(status.value!),
                    )}
                    onChange={(e, v) =>
                      setFilter({
                        ...filter,
                        status: v.map(i => i.value),
                      })
                    }
                    // filterSelectedOptions
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
                        autoComplete='off'
                        label='Status'
                      />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox checked={selected} sx={{ mr: 2 }} />
                        {option.label}
                      </li>
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} md={3}>
                <Box className='filterFormAutoComplete'>
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    multiple
                    limitTags={1}
                    disableCloseOnSelect
                    options={clients}
                    value={clients.filter(client =>
                      filter?.client?.includes(String(client.clientId)),
                    )}
                    onChange={(e, v) =>
                      setFilter({
                        ...filter,
                        client: v.map(i => String(i.clientId)),
                      })
                    }
                    // filterSelectedOptions
                    getOptionLabel={option => option?.name}
                    renderInput={params => (
                      <TextField
                        {...params}
                        autoComplete='off'
                        label='Client'
                      />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox checked={selected} sx={{ mr: 2 }} />
                        {option.name}
                      </li>
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} md={3}>
                <Box className='filterFormAutoComplete'>
                  <Autocomplete
                    fullWidth
                    multiple
                    limitTags={1}
                    disableCloseOnSelect
                    options={CategoryList}
                    value={filterValue(CategoryList, 'category')}
                    onChange={(e, v) =>
                      setFilter({
                        ...filter,
                        category: v.map(item => item.value),
                      })
                    }
                    id='category'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
                        autoComplete='off'
                        label='Category'
                      />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox checked={selected} sx={{ mr: 2 }} />
                        {option.label}
                      </li>
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} md={3}>
                <Box className='filterFormAutoComplete'>
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    multiple
                    limitTags={1}
                    options={serviceTypeOptions || []}
                    disableCloseOnSelect
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
                        autoComplete='off'
                        label='Service type'
                      />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox checked={selected} sx={{ mr: 2 }} />
                        {option.label}
                      </li>
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} md={3}>
                <FormControl fullWidth className='filterFormControl'>
                  <DatePicker
                    selectsRange
                    monthsShown={2}
                    startDate={
                      filter?.startedAt?.[0]
                        ? new Date(filter?.startedAt?.[0])
                        : null
                    }
                    endDate={
                      filter?.startedAt?.[1]
                        ? new Date(filter?.startedAt?.[1])
                        : null
                    }
                    placeholderText='MM/DD/YYYY - MM/DD/YYYY'
                    id='date-range-picker-months'
                    onChange={([start, end]) => {
                      console.log(start, end)

                      if (!start && !end) return
                      setFilter({
                        ...filter,
                        startedAt: [
                          moment(start).toISOString(),
                          moment(end).toISOString(),
                        ],
                      })
                    }}
                    onCalendarClose={() => {
                      if (
                        filter.startedAt &&
                        (!filter.startedAt[0] || !filter.startedAt[1])
                      ) {
                        setFilter({
                          ...filter,
                          startedAt: [null, null],
                        })
                      }
                    }}
                    popperPlacement={popperPlacement}
                    customInput={
                      <Box>
                        <CustomInput
                          label='Job start date'
                          icon='calendar'
                          sx={{ height: '46px' }}
                          placeholder='MM/DD/YYYY - MM/DD/YYYY'
                          value={
                            filter?.startedAt?.[0] || filter?.startedAt?.[1]
                              ? dateValue(
                                  filter?.startedAt?.[0]!,
                                  filter?.startedAt?.[1]!,
                                )
                              : ''
                          }
                        />
                      </Box>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={6} md={3}>
                <FormControl fullWidth className='filterFormControl'>
                  <DatePicker
                    selectsRange
                    monthsShown={2}
                    startDate={
                      filter?.dueAt?.[0] ? new Date(filter?.dueAt?.[0]) : null
                    }
                    endDate={
                      filter?.dueAt?.[1] ? new Date(filter?.dueAt?.[1]) : null
                    }
                    placeholderText='MM/DD/YYYY - MM/DD/YYYY'
                    id='date-range-picker-months'
                    onChange={([start, end]) => {
                      console.log(start, end)

                      if (!start && !end) return
                      setFilter({
                        ...filter,
                        dueAt: [
                          moment(start).toISOString(),
                          moment(end).toISOString(),
                        ],
                      })
                    }}
                    onCalendarClose={() => {
                      if (
                        filter.dueAt &&
                        (!filter.dueAt[0] || !filter.dueAt[1])
                      ) {
                        setFilter({
                          ...filter,
                          dueAt: [null, null],
                        })
                      }
                    }}
                    popperPlacement={popperPlacement}
                    customInput={
                      <Box>
                        <CustomInput
                          label='Job due date'
                          icon='calendar'
                          sx={{
                            height: '46px',
                          }}
                          placeholder='MM/DD/YYYY - MM/DD/YYYY'
                          value={
                            filter?.dueAt?.[0] || filter?.dueAt?.[1]
                              ? dateValue(
                                  filter?.dueAt?.[0]!,
                                  filter?.dueAt?.[1]!,
                                )
                              : ''
                          }
                        />
                      </Box>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <FormControl fullWidth className='filterFormControl'>
                  <InputLabel>Search projects</InputLabel>
                  <OutlinedInput
                    label='Search projects'
                    value={filter.search}
                    sx={{
                      height: '46px',
                    }}
                    inputProps={{
                      style: {
                        height: '46px',
                        padding: '0 14px',
                      },
                    }}
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
              <Grid item xs={12} sm={12} md={2}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '46px',
                    gap: '16px',
                  }}
                >
                  <Button
                    variant='outlined'
                    color='secondary'
                    type='button'
                    onClick={onReset}
                    sx={{ flex: 1 }}
                  >
                    Reset
                  </Button>
                  <Button
                    variant='contained'
                    onClick={onSearch}
                    color='secondary'
                    sx={{ flex: 1 }}
                  >
                    Search
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </DatePickerWrapper>
  )
}

const CustomDatePicker = styled(DatePicker)`
  width: 100%;
`
