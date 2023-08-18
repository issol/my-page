// ** React imports
import {
  Dispatch,
  SetStateAction,
  forwardRef,
  useEffect,
  useState,
} from 'react'

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
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  useTheme,
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import { FilterType } from '..'
import {
  ClientQuoteStatus,
  ClientStatus,
  QuotesStatus,
  WorkStatus,
} from '@src/shared/const/status/statuses'
import {
  ClientInvoiceFilterType,
  ClientProjectFilterType,
} from '@src/types/client/client-projects.type'
import {
  Control,
  UseFormHandleSubmit,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form/dist/types'
import { Controller } from 'react-hook-form'
import { ProjectType } from '@src/shared/const/project/project-type'
import {
  CategoryList,
  CategoryListPair,
} from '@src/shared/const/category/categories'
import { ServiceType } from '@src/shared/const/service-type/service-type.enum'
import { FormErrors } from '@src/shared/const/formErrors'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import {
  ServiceTypeList,
  ServiceTypePair,
} from '@src/shared/const/service-type/service-types'
import { Category } from '@src/shared/const/category/category.enum'
import _ from 'lodash'
import { QuotesFilterType } from '@src/types/quotes/quote'
import { UserRoleType } from '@src/context/types'

type Props = {
  filter: QuotesFilterType
  setFilter: Dispatch<SetStateAction<QuotesFilterType>>
  onSubmit: (data: FilterType) => void
  handleSubmit: UseFormHandleSubmit<FilterType>
  onReset: () => void
  control: Control<FilterType, any>
  trigger: UseFormTrigger<FilterType>
  serviceTypeList: {
    label: ServiceType
    value: ServiceType
  }[]
  setServiceTypeList: Dispatch<
    SetStateAction<
      {
        label: ServiceType
        value: ServiceType
      }[]
    >
  >
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
  role: UserRoleType
  quoteStatusList: Array<{ value: number; label: string }>
  clientList: Array<{ value: number; label: string }>
  companiesList?: Array<{ value: string; label: string }>
}

export default function QuotesFilters({
  filter,
  setFilter,
  onReset,
  onSubmit,
  handleSubmit,
  trigger,
  control,
  serviceTypeList,
  setServiceTypeList,
  categoryList,
  setCategoryList,
  role,
  quoteStatusList,
  clientList,
  companiesList,
}: Props) {
  const theme = useTheme()
  const { direction } = theme
  const [collapsed, setCollapsed] = useState<boolean>(true)
  const popperPlacement: ReactDatePickerProps['popperPlacement'] =
    direction === 'ltr' ? 'bottom-start' : 'bottom-end'

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
                <Grid
                  container
                  spacing={6}
                  rowSpacing={4}
                  sx={{ padding: '0' }}
                >
                  <Grid item xs={3}>
                    <Controller
                      control={control}
                      name='status'
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
                          options={
                            quoteStatusList
                            // role.name === 'CLIENT'
                            //   ? ClientQuoteStatus
                            //   : QuotesStatus
                          }
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
                  {role.name !== 'CLIENT' ? (
                    <Grid item xs={3}>
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
                            getOptionLabel={option => option.label}
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
                    </Grid>
                  ) : (
                    <Grid item xs={3}>
                      <Controller
                        control={control}
                        name='lsp'
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
                            options={companiesList || []}
                            id='lsp'
                            getOptionLabel={option => option.label}
                            renderInput={params => (
                              <TextField {...params} label='LSP' />
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

                  <Grid item xs={3}>
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
                  <Grid item xs={3}>
                    <Controller
                      control={control}
                      name='quoteDate'
                      render={({ field: { onChange, value } }) => (
                        <Box sx={{ width: '100%' }}>
                          <DatePicker
                            selectsRange
                            autoComplete='off'
                            monthsShown={2}
                            endDate={value[1]}
                            selected={value[0]}
                            startDate={value[0]}
                            shouldCloseOnSelect={false}
                            id='date-range-picker-months'
                            onChange={onChange}
                            popperPlacement={popperPlacement}
                            customInput={
                              <CustomInput label='Quote date' icon='calendar' />
                            }
                          />
                        </Box>
                      )}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <Controller
                      control={control}
                      name={
                        role.name === 'CLIENT'
                          ? 'estimatedDeliveryDate'
                          : 'quoteDeadline'
                      }
                      render={({ field: { onChange, value } }) => (
                        <Box sx={{ width: '100%' }}>
                          <DatePicker
                            selectsRange
                            autoComplete='off'
                            monthsShown={2}
                            endDate={value && value![1]}
                            selected={value && value![0]}
                            startDate={value && value![0]}
                            shouldCloseOnSelect={false}
                            id='date-range-picker-months'
                            onChange={onChange}
                            popperPlacement={popperPlacement}
                            customInput={
                              <CustomInput
                                label={
                                  role.name === 'CLIENT'
                                    ? 'Estimated delivery date'
                                    : 'Quote deadline'
                                }
                                icon='calendar'
                              />
                            }
                          />
                        </Box>
                      )}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <Controller
                      control={control}
                      name={
                        role.name === 'CLIENT'
                          ? 'projectDueDate'
                          : 'quoteExpiryDate'
                      }
                      render={({ field: { onChange, value } }) => (
                        <Box sx={{ width: '100%' }}>
                          {value && (
                            <DatePicker
                              selectsRange
                              autoComplete='off'
                              monthsShown={2}
                              endDate={value && value![1]}
                              selected={value && value![0]}
                              startDate={value && value![0]}
                              shouldCloseOnSelect={false}
                              id='date-range-picker-months'
                              onChange={onChange}
                              popperPlacement={popperPlacement}
                              customInput={
                                <CustomInput
                                  label={
                                    role.name === 'CLIENT'
                                      ? 'Project due date'
                                      : 'Quote expiry date'
                                  }
                                  icon='calendar'
                                />
                              }
                            />
                          )}
                        </Box>
                      )}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <Controller
                        control={control}
                        name='search'
                        render={({ field: { onChange, value } }) => (
                          <>
                            <InputLabel>Search projects</InputLabel>
                            <OutlinedInput
                              label='Search invoice name'
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
                        type='button'
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
