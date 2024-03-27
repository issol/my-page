import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
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
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box width='100%' display='flex' gap={6}>
            <Controller
              control={control}
              name={'client'}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
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
                    <TextField
                      {...params}
                      size='small'
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
              )}
            />

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
                          size='small'
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

            <FormControl fullWidth size='small'>
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
            <Box display='flex' gap='16px'>
              <Button
                fullWidth
                variant='outlined'
                size='small'
                color='secondary'
                type='button'
                sx={{ height: '38px' }}
                onClick={onReset}
              >
                Reset
              </Button>
              <Button
                fullWidth
                variant='contained'
                size='small'
                type='submit'
                sx={{ height: '38px', background: 'rgba(109, 120, 141, 1)' }}
              >
                Search
              </Button>
            </Box>
          </Box>
        </form>
      </Card>
    </DatePickerWrapper>
  )
}

export default JobFilters
