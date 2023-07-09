import { Grid, TextField, Typography } from '@mui/material'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import { Fragment, useState } from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'
import { OffDayEventType } from '@src/types/common/calendar.type'

type Props = {
  options: string[]
  control: Control<OffDayEventType, any>
  setValue: UseFormSetValue<OffDayEventType>
  watch: UseFormWatch<OffDayEventType>
}
export default function OffDayForm({
  options,
  control,
  setValue,
  watch,
}: Props) {
  const end = watch('end')
  const reason = watch('reason')
  return (
    <Fragment>
      <Grid item xs={12}>
        <Typography variant='h6'>Add unavailable days</Typography>
      </Grid>
      <Grid item xs={12}>
        <DatePickerWrapper>
          <Controller
            control={control}
            name='start'
            render={({ field: { onChange, value } }) => (
              <DatePicker
                selectsRange
                endDate={!end ? null : new Date(end)}
                selected={!value ? null : new Date(value)}
                startDate={!value ? null : new Date(value)}
                minDate={new Date()}
                onChange={(dates: any) => {
                  const [start, end] = dates
                  onChange(start)
                  setValue('end', end, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }}
                placeholderText='MM/DD/YYYY-MM/DD/YYYY'
                customInput={
                  <CustomInput label='unavailable days*' icon='calendar' />
                }
              />
            )}
          />
        </DatePickerWrapper>
      </Grid>
      <Grid item xs={12}>
        <Typography fontWeight={600}>Message to LPM</Typography>
        <FormControl sx={{ flexWrap: 'wrap', flexDirection: 'row' }}>
          <Controller
            control={control}
            name='reason'
            render={({ field: { onChange, value } }) => (
              <RadioGroup
                style={{ marginLeft: '14px' }}
                value={value ?? ''}
                name='reasons'
                onChange={onChange}
                aria-label='message to lpm'
              >
                {options.map(opt => (
                  <FormControlLabel
                    key={opt}
                    value={opt}
                    checked={opt === value}
                    control={<Radio />}
                    label={opt}
                  />
                ))}
              </RadioGroup>
            )}
          />
        </FormControl>
      </Grid>
      {reason === 'etc.' ? (
        <Controller
          control={control}
          name='reason'
          render={({ field: { onChange, value } }) => (
            <Grid item xs={12}>
              <TextField
                rows={4}
                multiline
                fullWidth
                placeholder='Write down a reason for setting off days.'
                value={value ?? ''}
                onChange={onChange}
                inputProps={{ maxLength: 50 }}
              />
            </Grid>
          )}
        />
      ) : null}
      <Grid item xs={12}>
        <Typography variant='subtitle2'>
          *The selected date will be shared with LPM and TAD and will be used as
          a reference when assigning jobs.
        </Typography>
      </Grid>
    </Fragment>
  )
}
