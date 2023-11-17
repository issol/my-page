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
  Tooltip,
  useTheme,
} from '@mui/material'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** apis
import { useGetClientList } from '@src/queries/client.query'
import { useGetClientRequestStatus } from '@src/queries/requests/client-request.query'

// ** types
import { RequestFilterType } from '@src/types/requests/filters.type'
import { ConstType } from '@src/pages/onboarding/client-guideline'

// ** values
import {
  CategoryList,
  CategoryListPair,
} from '@src/shared/const/category/categories'
import {
  ServiceTypeList,
  ServiceTypePair,
} from '@src/shared/const/service-type/service-types'
import { ServiceType } from '@src/shared/const/service-type/service-type.enum'
import { Category } from '@src/shared/const/category/category.enum'

import _ from 'lodash'
import { FilterType } from '..'
import {
  Control,
  Controller,
  UseFormHandleSubmit,
  UseFormTrigger,
} from 'react-hook-form'
import { UserRoleType } from '@src/context/types'
import dayjs from 'dayjs'

type Props = {
  filters: RequestFilterType
  setFilters: (n: RequestFilterType) => void
  // serviceType: Array<ConstType>
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
  handleSubmit: UseFormHandleSubmit<FilterType>
  clientList: {
    label: string
    value: number
  }[]
  control: Control<FilterType, any>
  trigger: UseFormTrigger<FilterType>
  statusList: {
    value: number
    label: string
  }[]
  statusListLoading: boolean

  companyList: Array<{ label: string; value: string }>
  companyListLoading: boolean
  role: UserRoleType
}

export default function Filter({
  filters,
  setFilters,
  onReset,
  onSubmit,
  categoryList,
  setCategoryList,
  serviceTypeList,
  setServiceTypeList,
  control,
  handleSubmit,
  trigger,
  statusListLoading,
  statusList,
  clientList,
  companyList,
  companyListLoading,
  role,
}: Props) {
  const theme = useTheme()
  const { direction } = theme
  const [collapsed, setCollapsed] = useState<boolean>(true)
  const popperPlacement: ReactDatePickerProps['popperPlacement'] =
    direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const dateValue = (startDate: Date | null, endDate: Date | null) => {
    if (startDate === null && endDate === null) return ''
    return startDate?.toDateString() === endDate?.toDateString()
      ? dayjs(startDate).format('MM/DD/YYYY')
      : `${dayjs(startDate).format('MM/DD/YYYY')}${
          endDate ? ` - ${dayjs(endDate).format('MM/DD/YYYY')}` : ''
        }`
  }

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
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={6} rowSpacing={4}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      control={control}
                      name='status'
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          {...commonOptions}
                          multiple
                          fullWidth
                          disableCloseOnSelect
                          loading={statusListLoading}
                          options={statusList || []}
                          getOptionLabel={option => option.label}
                          value={value}
                          isOptionEqualToValue={(option, newValue) => {
                            return option.value === newValue.value
                          }}
                          limitTags={1}
                          onChange={(event, item) => {
                            onChange(item)
                          }}
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
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
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
                            getOptionLabel={option =>
                              `${option.label.slice(0, 12)}${
                                option.label.length > 12 ? '...' : ''
                              }`
                            }
                            value={value}
                            limitTags={1}
                            onChange={onChange}
                            renderInput={params => (
                              <TextField
                                {...params}
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
                        name='client'
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
                              `${option.label.slice(0, 12)}${
                                option.label.length > 12 ? '...' : ''
                              }`
                            }
                            renderInput={params => (
                              <TextField {...params} label='Client' />
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
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      control={control}
                      name='category'
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          fullWidth
                          multiple
                          limitTags={1}
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
                            <TextField {...params} label='Category' />
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
                  <Grid item xs={12} sm={6} md={3}>
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
                              setCategoryList(_.uniqBy(arr, 'value'))

                              // setCategoryList(arr)
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
                            <TextField {...params} label='Service type' />
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
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      control={control}
                      name='requestDate'
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
                                label='Request date'
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
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      control={control}
                      name='desiredDueDate'
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
                                label='Desired due date'
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

                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl fullWidth>
                      <Controller
                        control={control}
                        name='search'
                        render={({ field: { onChange, value } }) => (
                          <>
                            <InputLabel>Search items</InputLabel>
                            <OutlinedInput
                              label='Search Items'
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
