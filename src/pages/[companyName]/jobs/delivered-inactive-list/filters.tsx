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
import { Control, Controller, UseFormHandleSubmit } from 'react-hook-form'
import { FilterType } from '.'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import { Icon } from '@iconify/react'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'
import { useState } from 'react'

type Props = {
  handleSubmit: UseFormHandleSubmit<FilterType>
  control: Control<FilterType, any>
  clientList: {
    name: string
    id: number
  }[]
  contactPersonList: {
    name: string
    id: number
  }[]

  statusList: {
    value: number
    label: string
  }[]

  clientListLoading: boolean
  contactPersonListLoading: boolean
  onSubmit: (data: FilterType) => void
  onReset: () => void
}
const Filters = ({
  handleSubmit,
  control,
  clientList,
  contactPersonList,
  clientListLoading,
  contactPersonListLoading,
  onSubmit,
  onReset,
  statusList,
}: Props) => {
  const theme = useTheme()
  const { direction } = theme
  const [collapsed, setCollapsed] = useState<boolean>(true)
  const popperPlacement: ReactDatePickerProps['popperPlacement'] =
    direction === 'ltr' ? 'bottom-start' : 'bottom-end'

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
                  name={'contactPerson'}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      fullWidth
                      loading={contactPersonListLoading}
                      onChange={(event, item) => {
                        onChange(item)
                      }}
                      value={value}
                      isOptionEqualToValue={(option, newValue) => {
                        return option.id === newValue.id
                      }}
                      disableCloseOnSelect
                      limitTags={1}
                      options={contactPersonList}
                      id='contactPerson'
                      getOptionLabel={option => option.name}
                      renderInput={params => (
                        <TextField
                          {...params}
                          autoComplete='off'
                          label={'Contact person'}
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
              </Grid>
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
                        <TextField
                          {...params}
                          autoComplete='off'
                          label={'Client'}
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
              </Grid>
              <Grid xs={4} item>
                <Controller
                  control={control}
                  name={'status'}
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
                        <TextField
                          {...params}
                          autoComplete='off'
                          label={'Status'}
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

              <Grid item xs={4}>
                <Controller
                  control={control}
                  name='requestedDate'
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
                          <CustomInput label='Requested date' icon='calendar' />
                        }
                      />
                    </Box>
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
                          <CustomInput label='Job due date' icon='calendar' />
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

export default Filters
