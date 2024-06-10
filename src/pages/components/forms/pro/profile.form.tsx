import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  TextField,
} from '@mui/material'
import { CountryType, ProProfileInfo } from '@src/types/sign/personalInfoTypes'
import { useEffect, useState } from 'react'
import { Control, Controller, FieldErrors, UseFormWatch } from 'react-hook-form'
import { styled } from '@mui/system'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'
import { v4 as uuidv4 } from 'uuid'

// ** Data
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'

import MuiPhone from '../../phone/mui-phone'
import { timezoneSelector } from '@src/states/permission'
import { useRecoilValueLoadable } from 'recoil'
import { Pronunciation } from '@src/shared/const/pronunciation'

type Props = {
  control: Control<ProProfileInfo>
  errors: FieldErrors<ProProfileInfo>
  watch: UseFormWatch<ProProfileInfo>
}

const ProProfileForm = ({ control, errors, watch }: Props) => {
  const [timeZoneList, setTimeZoneList] = useState<
    {
      code: string
      label: string
      phone: string
    }[]
  >([])
  const timezone = useRecoilValueLoadable(timezoneSelector)

  useEffect(() => {
    const timezoneList = timezone.getValue()
    const filteredTimezone = timezoneList.map(list => {
      return {
        code: list.timezoneCode,
        label: list.timezone,
        phone: '',
      }
    })
    setTimeZoneList(filteredTimezone)
  }, [timezone])

  return (
    <Grid container spacing={5}>
      <Grid item xs={6}>
        <Controller
          name='legalNamePronunciation'
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              autoComplete='off'
              label='Pronunciation of legal name'
              value={value}
              onChange={onChange}
              inputProps={{ maxLength: 200 }}
              error={Boolean(errors.legalNamePronunciation)}
            />
          )}
        />
        {errors.legalNamePronunciation && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {errors.legalNamePronunciation.message}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='pronounce'
          control={control}
          render={({ field }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              {...field}
              options={Pronunciation}
              getOptionLabel={option => option.label}
              value={
                field.value
                  ? Pronunciation.find(p => p.value === field.value)
                  : null
              }
              onChange={(event: any, newValue) => {
                field.onChange(newValue?.value || undefined)
              }}
              renderInput={params => (
                <TextField {...params} label='pronounce' />
              )}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
            />
          )}
        />
        {errors.pronounce && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {errors.pronounce.message}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12}>
        <Controller
          name='havePreferredName'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControlLabel
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: 14,
                },
              }}
              control={
                <Checkbox
                  size='small'
                  value={value || false}
                  onChange={onChange}
                  checked={value || false}
                  sx={{
                    padding: '0 20px',
                  }}
                />
              }
              label='I have my preferred name'
            />
          )}
        />
      </Grid>
      {watch('havePreferredName') && (
        <>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Controller
                name='preferredName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    value={value}
                    autoComplete='off'
                    onBlur={onBlur}
                    onChange={onChange}
                    inputProps={{ maxLength: 200 }}
                    error={Boolean(errors.preferredName)}
                    placeholder='Preferred name'
                  />
                )}
              />
              {errors.preferredName && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.preferredName.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Controller
                name='preferredNamePronunciation'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    value={value}
                    autoComplete='off'
                    onBlur={onBlur}
                    onChange={onChange}
                    inputProps={{ maxLength: 200 }}
                    error={Boolean(errors.preferredNamePronunciation)}
                    placeholder='Pronunciation'
                  />
                )}
              />
              {errors.preferredNamePronunciation && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.preferredNamePronunciation.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
        </>
      )}

      <Grid item xs={12}>
        <DatePickerWrapper>
          <Controller
            name='birthday'
            control={control}
            render={({ field: { value, onChange } }) => (
              <FullWidthDatePicker
                dateFormat='MM/dd/yyyy'
                selected={!value ? null : new Date(value)}
                onChange={onChange}
                customInput={
                  <CustomInput label='Date of birth' icon='calendar' />
                }
              />
            )}
          />
        </DatePickerWrapper>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name='timezone'
          control={control}
          render={({ field }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              {...field}
              options={timeZoneList as CountryType[]}
              onChange={(e, v) => {
                field.onChange(v)
              }}
              disableClearable
              renderOption={(props, option) => (
                <Box component='li' {...props} key={uuidv4()}>
                  {timeZoneFormatter(option, timezone.getValue())}
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  autoComplete='off'
                  label='Time zone*'
                  error={Boolean(errors.timezone)}
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              getOptionLabel={option =>
                timeZoneFormatter(option, timezone.getValue()) ?? ''
              }
            />
          )}
        />
        {errors.timezone && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {errors.timezone.message}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='telephone'
          control={control}
          rules={{ required: false }}
          render={({ field: { value, onChange, onBlur } }) => (
            <MuiPhone
              height='auto'
              value={value || ''}
              onChange={onChange}
              label={'Telephone'}
            />
          )}
        />
        {errors.telephone && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {errors.telephone.message}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='mobilePhone'
          control={control}
          rules={{ required: false }}
          render={({ field: { value, onChange, onBlur } }) => (
            <MuiPhone
              height='auto'
              value={value || ''}
              onChange={onChange}
              label={'Mobile phone'}
            />
          )}
        />
        {errors.mobilePhone && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {errors.mobilePhone.message}
          </FormHelperText>
        )}
      </Grid>
    </Grid>
  )
}

const FullWidthDatePicker = styled(DatePicker)`
  width: 100%;
`

export default ProProfileForm
