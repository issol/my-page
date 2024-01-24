import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { FilterType } from '..'
import { useState } from 'react'
import { Control, Controller, UseFormHandleSubmit } from 'react-hook-form'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import { Icon } from '@iconify/react'
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'
import dayjs from 'dayjs'

type Props = {
  handleSubmit: UseFormHandleSubmit<FilterType>
  control: Control<FilterType, any>
  clientList: {
    name: string
    id: number
  }[]
  clientListLoading: boolean
  onSubmit: (data: FilterType) => void
  onReset: () => void
}
const JobFilters = ({
  handleSubmit,
  control,
  onSubmit,
  clientList,
  clientListLoading,
  onReset,
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
      <Card
        sx={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant='h6'>Search Filters</Typography>
          <IconButton
            size='small'
            aria-label='collapse'
            sx={{ color: 'text.secondary' }}
            onClick={() => setCollapsed(!collapsed)}
          >
            <Icon
              fontSize={24}
              icon={!collapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'}
            />
          </IconButton>
        </Box>
        <Collapse in={collapsed}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6} rowSpacing={4} sx={{ padding: '0' }}>
              <Grid xs={4} item>
                <Controller
                  control={control}
                  name={'client'}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      // multiple
                      fullWidth
                      loading={clientListLoading}
                      onChange={(event, item) => {
                        onChange(item)
                      }}
                      value={value}
                      isOptionEqualToValue={(option, newValue) => {
                        return option.id === newValue.id
                      }}
                      disableCloseOnSelect
                      limitTags={1}
                      options={clientList}
                      id='client'
                      getOptionLabel={option => option.name}
                      renderInput={params => (
                        <TextField {...params} label={'Client'} />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {option.name}
                        </li>
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  control={control}
                  name='jobDueDate'
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
                          <Box>
                            <CustomInput
                              label='Job due date'
                              icon='calendar'
                              value={
                                value.length > 0
                                  ? dateValue(value[0], value[1])
                                  : ''
                              }
                            />
                          </Box>
                        }
                      />
                    </Box>
                  )}
                />
              </Grid>
              <Grid xs={4} item>
                <FormControl fullWidth>
                  <Controller
                    control={control}
                    name='search'
                    render={({ field: { onChange, value } }) => (
                      <>
                        <InputLabel>Search by job name</InputLabel>
                        <OutlinedInput
                          label='Search by job name'
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
        </Collapse>
      </Card>
    </DatePickerWrapper>
  )
}

export default JobFilters
