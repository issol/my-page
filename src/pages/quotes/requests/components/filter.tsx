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
import { RequestFilterType } from '@src/types/requests/filters'
import { useGetProList } from '@src/queries/pro/pro-list.query'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { ConstType } from '@src/pages/onboarding/client-guideline'
import { CategoryList } from '@src/shared/const/category/categories'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'

type Props = {
  filter: RequestFilterType
  setFilter: (n: RequestFilterType) => void
  serviceType: Array<ConstType>
  onReset: () => void
  search: () => void
}

export default function Filter({ filter, setFilter, onReset, search }: Props) {
  const [collapsed, setCollapsed] = useState<boolean>(true)

  function filterValue(
    option: any,
    keyName: keyof Pick<RequestFilterType, 'category' | 'serviceType'>,
  ) {
    return !filter[keyName]
      ? option[0]
      : option.filter((item: { value: string; label: string }) =>
          filter[keyName]?.includes(item.value),
        )
  }

  /* TODO: lsp받는 api로 변경하기 */
  const { data: lpmList } = useGetProList({ take: 100, skip: 0 })

  /* TODO: api변경하기 */
  const { data: statusList, isLoading } = useGetInvoicePayableStatus()
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
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <Autocomplete
                      {...commonOptions}
                      multiple
                      disableCloseOnSelect
                      loading={isLoading}
                      options={statusList || []}
                      getOptionLabel={option => option.statusName}
                      value={
                        !statusList || !filter.lsp?.length
                          ? []
                          : statusList?.filter(item =>
                              filter.status?.includes(item.statusName),
                            )
                      }
                      limitTags={1}
                      onChange={(e, v) =>
                        setFilter({
                          ...filter,
                          status: v.map(item => item.statusName),
                        })
                      }
                      id='status'
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
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <Autocomplete
                      {...commonOptions}
                      multiple
                      disableCloseOnSelect
                      options={lpmList?.data || []}
                      getOptionLabel={option => option.id}
                      value={
                        !lpmList
                          ? []
                          : lpmList.data?.filter(lsp =>
                              filter.lsp?.includes(lsp.userId),
                            )
                      }
                      limitTags={1}
                      onChange={(e, v) =>
                        setFilter({
                          ...filter,
                          lsp: v.map(i => i.userId),
                        })
                      }
                      renderInput={params => (
                        <TextField {...params} label='LSP' placeholder='LSP' />
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
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <Autocomplete
                      autoHighlight
                      fullWidth
                      multiple
                      disableCloseOnSelect
                      limitTags={1}
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
                          label='Category'
                          placeholder='Category'
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
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <Autocomplete
                      autoHighlight
                      fullWidth
                      multiple
                      limitTags={1}
                      disableCloseOnSelect
                      options={ServiceTypeList || []}
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
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <DatePicker
                      selectsRange
                      monthsShown={1}
                      endDate={
                        filter?.requestDateTo
                          ? new Date(filter.requestDateTo)
                          : null
                      }
                      startDate={
                        filter?.requestDateFrom
                          ? new Date(filter.requestDateFrom)
                          : null
                      }
                      shouldCloseOnSelect={false}
                      onChange={e => {
                        if (!e.length) return
                        setFilter({
                          ...filter,
                          requestDateFrom: e[0]?.toString(),
                          requestDateTo: e[1]?.toString(),
                        })
                      }}
                      customInput={
                        <CustomInput label='Request date' icon='calendar' />
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <DatePicker
                      selectsRange
                      monthsShown={1}
                      endDate={
                        filter?.desiredDueDateTo
                          ? new Date(filter.desiredDueDateTo)
                          : null
                      }
                      startDate={
                        filter?.desiredDueDateFrom
                          ? new Date(filter.desiredDueDateFrom)
                          : null
                      }
                      shouldCloseOnSelect={false}
                      onChange={e => {
                        if (!e.length) return
                        setFilter({
                          ...filter,
                          desiredDueDateFrom: e[0]?.toString(),
                          desiredDueDateTo: e[1]?.toString(),
                        })
                      }}
                      customInput={
                        <CustomInput label='Desired due date' icon='calendar' />
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Search Items</InputLabel>
                    <OutlinedInput
                      label='Search Items'
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
