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

// **values
import { JobList, RoleList } from 'src/shared/const/common'
import { ExperiencedYears } from 'src/shared/const/personalInfo'

import { getGloLanguage } from 'src/shared/transformer/language.transformer'

// ** types
import { FilterOmitType } from '..'

type Filter = { value: string; label: string }
type Props = {
  filter: FilterOmitType
  setFilter: <T extends FilterOmitType>(v: T) => void
  search: () => void
  onReset: () => void
  jobTypeOption: Array<Filter>
  roleOption: Array<Filter>
}

export default function Filters({
  filter,
  setFilter,
  search,
  onReset,
  jobTypeOption,
  roleOption,
}: Props) {
  const languageList = getGloLanguage()
  const [collapsed, setCollapsed] = useState<boolean>(true)

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] =
    direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  function filterValue(option: any, keyName: keyof FilterOmitType) {
    return !filter[keyName]
      ? { value: '', label: '' }
      : option.filter(
          (item: { value: string; label: string }) =>
            filter[keyName] === item.value,
        )[0]
  }

  return (
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
            <Grid container spacing={6} rowSpacing={4}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <FormControl fullWidth>
                    <Autocomplete
                      autoHighlight
                      fullWidth
                      options={!jobTypeOption.length ? JobList : jobTypeOption}
                      value={filterValue(JobList, 'jobType')}
                      onChange={(e, v) =>
                        setFilter({
                          ...filter,
                          jobType: v?.value ?? '',
                        })
                      }
                      filterSelectedOptions
                      id='jobType'
                      getOptionLabel={option => option.label}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Job type'
                          placeholder='Job type'
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
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    options={!roleOption.length ? RoleList : roleOption}
                    value={filterValue(RoleList, 'role')}
                    onChange={(e, v) =>
                      setFilter({
                        ...filter,
                        role: v?.value ?? '',
                      })
                    }
                    filterSelectedOptions
                    id='role'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField {...params} label='Role' placeholder='Role' />
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
                    autoHighlight
                    fullWidth
                    options={ExperiencedYears}
                    value={filterValue(ExperiencedYears, 'yearsOfExperience')}
                    onChange={(e, v) =>
                      setFilter({
                        ...filter,
                        yearsOfExperience: v?.value ?? '',
                      })
                    }
                    filterSelectedOptions
                    id='yearsOfExperience'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Years of experience'
                        placeholder='Years of experience'
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
              <Grid item xs={12} sm={4} md={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    options={languageList}
                    value={filterValue(languageList, 'source')}
                    onChange={(e, v) => {
                      setFilter({
                        ...filter,
                        source: v?.value ?? '',
                      })
                    }}
                    filterSelectedOptions
                    id='source'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Source'
                        placeholder='Source'
                      />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <li {...props} key={option.value}>
                        <Checkbox checked={selected} sx={{ mr: 2 }} />
                        {option.label}
                      </li>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    options={languageList}
                    value={filterValue(languageList, 'target')}
                    onChange={(e, v) =>
                      setFilter({
                        ...filter,
                        target: v?.value ?? '',
                      })
                    }
                    filterSelectedOptions
                    id='target'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Target'
                        placeholder='Target'
                      />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <li {...props} key={option.value}>
                        <Checkbox checked={selected} sx={{ mr: 2 }} />
                        {option.label}
                      </li>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <FormControl fullWidth>
                  <DatePickerWrapper>
                    <CustomDatePicker
                      selected={
                        filter.dueDate ? new Date(filter.dueDate) : null
                      }
                      id='dueDate'
                      popperPlacement={popperPlacement}
                      onChange={date =>
                        setFilter({ ...filter, dueDate: date?.toString() })
                      }
                      placeholderText='Due date'
                      customInput={<CustomInput icon='calendar' />}
                    />
                  </DatePickerWrapper>
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
  )
}

const CustomDatePicker = styled(DatePicker)`
  z-index: 100000;
  width: 100%;
`
