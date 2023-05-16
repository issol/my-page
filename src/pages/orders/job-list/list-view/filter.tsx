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
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

import styled from 'styled-components'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** values
import { ClientListIncludeGloz } from '@src/shared/const/client/clients'
import { CategoryList } from '@src/shared/const/category/categories'
import { JobStatus } from '@src/shared/const/status/statuses'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'

// ** types
import { FilterType } from './list-view'
import { ConstType } from '@src/pages/onboarding/client-guideline'
import { ClientRowType } from '@src/apis/client.api'

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
  const [collapsed, setCollapsed] = useState<boolean>(true)
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] =
    direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  function filterValue(
    option: any,
    keyName: keyof Pick<
      FilterType,
      'status' | 'client' | 'category' | 'serviceType'
    >,
  ): Array<{ value: string; label: string }> {
    return !filter[keyName]
      ? option[0]
      : option?.filter((item: { value: string; label: string }) =>
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
                <Grid item xs={6} sm={6} md={3}>
                  <FormControl fullWidth>
                    <FormControl fullWidth>
                      <Autocomplete
                        autoHighlight
                        fullWidth
                        multiple
                        options={JobStatus}
                        value={filterValue(JobStatus, 'status')}
                        onChange={(e, v) =>
                          setFilter({
                            ...filter,
                            status: v.map(i => i.value),
                          })
                        }
                        filterSelectedOptions
                        getOptionLabel={option => option.label}
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
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <FormControl fullWidth>
                    <FormControl fullWidth>
                      <Autocomplete
                        autoHighlight
                        fullWidth
                        multiple
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
                        filterSelectedOptions
                        getOptionLabel={option => option?.name}
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
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <FormControl fullWidth>
                    <FormControl fullWidth>
                      <Autocomplete
                        fullWidth
                        multiple
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
                          <TextField {...params} label='Category' />
                        )}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox checked={selected} sx={{ mr: 2 }} />
                            {option.label}
                          </li>
                        )}
                      />
                    </FormControl>
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <FormControl fullWidth>
                    <Autocomplete
                      autoHighlight
                      fullWidth
                      multiple
                      options={serviceTypeOptions || []}
                      value={filterValue(ServiceTypeList, 'serviceType')}
                      onChange={(e, v) =>
                        setFilter({
                          ...filter,
                          serviceType: v.map(item => item.value),
                        })
                      }
                      filterSelectedOptions
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
                <Grid item xs={6} sm={6} md={3}>
                  <FormControl fullWidth>
                    <DatePicker
                      selectsRange
                      monthsShown={2}
                      startDate={filter?.startedAt?.[0] ?? null}
                      endDate={filter?.startedAt?.[1] ?? null}
                      placeholderText='MM/DD/YYYY - MM/DD/YYYY'
                      id='date-range-picker-months'
                      onChange={e => {
                        setFilter({
                          ...filter,
                          startedAt: e,
                        })
                      }}
                      popperPlacement={popperPlacement}
                      customInput={
                        <CustomInput label='Job start date' icon='calendar' />
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <FormControl fullWidth>
                    <DatePicker
                      selectsRange
                      monthsShown={2}
                      startDate={filter?.dueAt?.[0] ?? null}
                      endDate={filter?.dueAt?.[1] ?? null}
                      placeholderText='MM/DD/YYYY - MM/DD/YYYY'
                      id='date-range-picker-months'
                      onChange={e => {
                        setFilter({
                          ...filter,
                          dueAt: e,
                        })
                      }}
                      popperPlacement={popperPlacement}
                      customInput={
                        <CustomInput label='Job due date' icon='calendar' />
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Search projects</InputLabel>
                    <OutlinedInput
                      label='Search projects'
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
                      type='button'
                      onClick={onReset}
                    >
                      Reset
                    </Button>
                    <Button
                      variant='contained'
                      size='medium'
                      onClick={onSearch}
                    >
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

const CustomDatePicker = styled(DatePicker)`
  width: 100%;
`