import { Dispatch, SetStateAction, useState } from 'react'

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
  useTheme,
} from '@mui/material'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** apis

import { InvoiceReceivableFilterType } from '@src/types/invoice/receivable.type'
import {
  CategoryList,
  CategoryListPair,
} from '@src/shared/const/category/categories'

import { RevenueFrom } from '@src/shared/const/revenue-from'
import { SalesCategory } from '@src/shared/const/sales-category'

import { UserRoleType } from '@src/context/types'
import dayjs from 'dayjs'
import { FilterType } from '../..'

import { Category } from '@src/shared/const/category/category.enum'
import {
  Control,
  Controller,
  UseFormHandleSubmit,
  UseFormTrigger,
} from 'react-hook-form'
import _ from 'lodash'
import {
  ServiceTypeList,
  ServiceTypePair,
} from '@src/shared/const/service-type/service-types'

import { ServiceType } from '@src/shared/const/service-type/service-type.enum'

// ** types

type Props = {
  filter: InvoiceReceivableFilterType
  setFilter: Dispatch<SetStateAction<InvoiceReceivableFilterType>>
  onReset: () => void
  onSubmit: (data: FilterType) => void
  serviceTypeList: {
    label: ServiceType
    value: ServiceType
  }[]
  categoryList: {
    label: Category
    value: Category
  }[]

  setCategoryList: Dispatch<
    SetStateAction<
      {
        label: Category
        value: Category
      }[]
    >
  >

  setServiceTypeList: Dispatch<
    SetStateAction<
      {
        label: ServiceType
        value: ServiceType
      }[]
    >
  >

  role: UserRoleType
  clientList: Array<{ label: string; value: number }>

  companyList: Array<{ label: string; value: string }>
  clientListLoading: boolean
  companyListLoading: boolean
  statusList: {
    value: number
    label: string
  }[]
  statusListLoading: boolean
  handleSubmit: UseFormHandleSubmit<FilterType>
  control: Control<FilterType, any>
  trigger: UseFormTrigger<FilterType>
}

export default function Filter({
  filter,
  setFilter,
  onReset,
  onSubmit,
  serviceTypeList,
  categoryList,
  setServiceTypeList,
  setCategoryList,
  clientList,
  companyList,
  clientListLoading,
  companyListLoading,
  role,
  statusListLoading,
  statusList,
  handleSubmit,
  control,
  trigger,
}: Props) {
  const theme = useTheme()
  const { direction } = theme
  const [collapsed, setCollapsed] = useState<boolean>(true)
  const popperPlacement: ReactDatePickerProps['popperPlacement'] =
    direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const commonOptions = {
    autoHighlight: true,
    fullWidth: true,
    disableCloseOnSelect: true,
  }

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
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={6} rowSpacing={4}>
                  {/* status */}
                  <Grid item xs={6} sm={6} md={3}>
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
                          // getOptionLabel={option =>
                          //   `${option.label.slice(0, 12)}${
                          //     option.label.length > 12 ? '...' : ''
                          //   }`
                          // }
                          getOptionLabel={option => option.label}
                          renderInput={params => (
                            <TextField {...params} autoComplete='off' label='Status' />
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

                  {/* client */}
                  <Grid item xs={6} sm={6} md={3}>
                    {role.name === 'CLIENT' ? (
                      <Controller
                        control={control}
                        name='lsp'
                        render={({ field: { onChange, value } }) => (
                          <Autocomplete
                            {...commonOptions}
                            multiple
                            loading={companyListLoading}
                            options={companyList || []}
                            getOptionLabel={option => option.label}
                            isOptionEqualToValue={(option, newValue) => {
                              return option.value === newValue.value
                            }}
                            value={value}
                            limitTags={1}
                            disableCloseOnSelect
                            onChange={(event, item) => onChange(item)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                autoComplete='off'
                                label='LSP'
                                // placeholder='Lsp'
                              />
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
                    ) : (
                      <Controller
                        control={control}
                        name='clientId'
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
                            options={clientList}
                            id='client'
                            getOptionLabel={option =>
                              `${option.label.slice(0, 15)}${
                                option.label.length > 15 ? '...' : ''
                              }`
                            }
                            renderInput={params => (
                              <TextField {...params} autoComplete='off' label='Client' />
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
                    )}
                  </Grid>

                  {/* category */}
                  <Grid item xs={3}>
                    <Controller
                      control={control}
                      name='category'
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          fullWidth
                          multiple
                          limitTags={1}
                          disableCloseOnSelect
                          isOptionEqualToValue={(option, newValue) => {
                            return option.value === newValue.value
                          }}
                          onChange={(event, item) => {
                            onChange(item)
                            if (item.length) {
                              const arr: {
                                label: ServiceType
                                value: ServiceType
                              }[] = []

                              item.map(value => {
                                /* @ts-ignore */
                                const res = ServiceTypePair[value.value]
                                arr.push(...res)
                              })

                              setServiceTypeList(_.uniqBy(arr, 'value'))
                              trigger('serviceType')
                            } else {
                              setServiceTypeList(ServiceTypeList)
                              trigger('serviceType')
                            }
                          }}
                          value={value}
                          options={categoryList}
                          id='category'
                          getOptionLabel={option => option.label}
                          renderInput={params => (
                            <TextField {...params} autoComplete='off' label='Category' />
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
                  <Grid item xs={3}>
                    <Controller
                      control={control}
                      name='serviceType'
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          fullWidth
                          multiple
                          disableCloseOnSelect
                          isOptionEqualToValue={(option, newValue) => {
                            return option.value === newValue.value
                          }}
                          onChange={(event, item) => {
                            onChange(item)

                            if (item.length) {
                              const arr: {
                                label: Category
                                value: Category
                              }[] = []

                              item.map(value => {
                                /* @ts-ignore */
                                const res = CategoryListPair[value.value]
                                arr.push(...res)
                              })

                              setCategoryList(arr)
                              trigger('category')
                            } else {
                              setCategoryList(CategoryList)
                              trigger('category')
                            }
                          }}
                          value={value}
                          options={serviceTypeList}
                          id='ServiceType'
                          limitTags={1}
                          getOptionLabel={option => option.label || ''}
                          renderInput={params => (
                            <TextField {...params} autoComplete='off' label='Service type' />
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
                  {/* invoice date */}
                  <Grid item xs={6} sm={6} md={3}>
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

                  {/* payment due */}
                  <Grid item xs={6} sm={6} md={3}>
                    <Controller
                      control={control}
                      name='payDueDate'
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
                                label='Payment due'
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

                  {/* payment date */}
                  {role.name === 'CLIENT' ? null : (
                    <Grid item xs={6} sm={6} md={3}>
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
                  )}

                  {/* sales recognition date */}
                  {role.name === 'CLIENT' ? null : (
                    <Grid item xs={6} sm={6} md={3}>
                      <Controller
                        control={control}
                        name='salesCheckedDate'
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
                                  label='Sales recognition date'
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
                  )}

                  {/* revenue from */}
                  {role.name === 'CLIENT' ? null : (
                    <Grid item xs={6} sm={6} md={3}>
                      <Controller
                        control={control}
                        name='revenueFrom'
                        render={({ field: { onChange, value } }) => (
                          <Autocomplete
                            {...commonOptions}
                            multiple
                            options={RevenueFrom.sort((a, b) =>
                              a.value > b.value
                                ? 1
                                : b.value > a.value
                                  ? -1
                                  : 0,
                            )}
                            value={value}
                            limitTags={1}
                            onChange={(e, v) => onChange(v)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                autoComplete='off'
                                label='Revenue from'
                                // placeholder='Revenue from'
                              />
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
                  )}

                  {/* sales category */}
                  {role.name === 'CLIENT' ? null : (
                    <Grid item xs={6} sm={6} md={3}>
                      <Controller
                        control={control}
                        name='salesCategory'
                        render={({ field: { onChange, value } }) => (
                          <Autocomplete
                            {...commonOptions}
                            multiple
                            options={SalesCategory}
                            value={value}
                            limitTags={1}
                            onChange={(e, v) => {
                              onChange(v)
                              console.log(v)
                            }}
                            renderInput={params => (
                              <TextField
                                {...params}
                                autoComplete='off'
                                label='Sales category'
                                // placeholder='Sales category'
                              />
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
                  )}

                  {/* search projects */}
                  <Grid item xs={12} sm={12} md={6}>
                    <FormControl fullWidth>
                      <Controller
                        control={control}
                        name='search'
                        render={({ field: { onChange, value } }) => (
                          <>
                            <InputLabel>Search projects</InputLabel>
                            <OutlinedInput
                              label='Search projects'
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
