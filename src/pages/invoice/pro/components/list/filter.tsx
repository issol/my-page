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
  useTheme,
} from '@mui/material'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import { useGetInvoicePayableStatus } from '@src/queries/invoice/common.query'
import { InvoiceProFilterType } from '@src/types/invoice/pro.type'
import { Dispatch, SetStateAction, useState } from 'react'
import { Control, Controller, UseFormHandleSubmit } from 'react-hook-form'
import { FilterType } from '../..'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import dayjs from 'dayjs'

type Props = {
  control: Control<FilterType, any>
  filter: InvoiceProFilterType
  setFilter: Dispatch<SetStateAction<InvoiceProFilterType>>
  statusList: Array<{ label: string; value: number }>
  onReset: () => void
  handleSubmit: UseFormHandleSubmit<FilterType>
  onSubmit: (data: FilterType) => void
}

const Filter = ({
  filter,
  setFilter,
  control,
  statusList,
  onReset,
  handleSubmit,
  onSubmit,
}: Props) => {
  const theme = useTheme()
  const { direction } = theme
  const [collapsed, setCollapsed] = useState<boolean>(true)
  const popperPlacement: ReactDatePickerProps['popperPlacement'] =
    direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const dateValue = (startDate: Date, endDate: Date) => {
    return startDate.toDateString() === endDate?.toDateString()
      ? dayjs(startDate).format('MM/DD/YYYY')
      : `${dayjs(startDate).format('MM/DD/YYYY')}${
          endDate ? ` - ${dayjs(endDate).format('MM/DD/YYYY')}` : ''
        }`
  }

  return (
    <DatePickerWrapper>
      <Grid item xs={12}>
        <Card>
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
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={6} rowSpacing={4}>
                  <Grid item xs={12} sm={6} md={6}>
                    <Controller
                      control={control}
                      name='invoiceStatus'
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          multiple
                          fullWidth
                          onChange={(event, item) => {
                            onChange(item)
                          }}
                          value={value}
                          isOptionEqualToValue={(option, newValue) => {
                            return option.value === newValue.value
                          }}
                          disableCloseOnSelect
                          limitTags={1}
                          options={statusList}
                          id='status'
                          getOptionLabel={option => option.label}
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
                      )}
                    />
                  </Grid>

                  <Grid item xs={6} sm={6} md={6}>
                    <Controller
                      control={control}
                      name='invoiceDate'
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          selectsRange
                          autoComplete='off'
                          monthsShown={2}
                          endDate={value[1]}
                          selected={value[0]}
                          startDate={value[0]}
                          // shouldCloseOnSelect={false}
                          id='date-range-picker-months'
                          onChange={onChange}
                          popperPlacement={popperPlacement}
                          customInput={
                            <Box>
                              <CustomInput
                                label='Invoice date'
                                icon='calendar'
                                placeholder='MM/DD/YYYY - MM/DD/YYYY'
                                value={
                                  value.length > 0
                                    ? dateValue(value[0], value[1])
                                    : ''
                                }
                              />
                            </Box>
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6}>
                    <Controller
                      control={control}
                      name='paidDate'
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          selectsRange
                          autoComplete='off'
                          monthsShown={2}
                          endDate={value[1]}
                          selected={value[0]}
                          startDate={value[0]}
                          // shouldCloseOnSelect={false}
                          id='date-range-picker-months'
                          onChange={onChange}
                          popperPlacement={popperPlacement}
                          customInput={
                            <Box>
                              <CustomInput
                                label='Payment date'
                                icon='calendar'
                                placeholder='MM/DD/YYYY - MM/DD/YYYY'
                                value={
                                  value.length > 0
                                    ? dateValue(value[0], value[1])
                                    : ''
                                }
                              />
                            </Box>
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6}>
                    <FormControl fullWidth>
                      <Controller
                        control={control}
                        name='search'
                        render={({ field: { onChange, value } }) => (
                          <>
                            <InputLabel>Search job name</InputLabel>
                            <OutlinedInput
                              label='Search job name'
                              value={value}
                              onChange={onChange}
                              endAdornment={
                                <InputAdornment position='end'>
                                  <IconButton edge='end'>
                                    <Icon icon='mdi:magnify' />
                                  </IconButton>
                                </InputAdornment>
                              }
                            />
                          </>
                        )}
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
                      <Button variant='contained' size='medium' type='submit'>
                        Search
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Collapse>
        </Card>
      </Grid>
    </DatePickerWrapper>
  )
}

export default Filter
