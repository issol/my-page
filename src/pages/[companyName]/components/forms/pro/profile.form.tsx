import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { CountryType, PersonalInfo } from '@src/types/sign/personalInfoTypes'
import { Fragment, useEffect, useState } from 'react'
import { Control, Controller, FieldErrors, UseFormWatch } from 'react-hook-form'
import { Pronunciation } from 'src/shared/const/pronunciation'
import { styled } from '@mui/system'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'
import { v4 as uuidv4 } from 'uuid'

// ** Data
import { countries } from '@src/@fake-db/autocomplete'
import { isInvalidPhoneNumber } from '@src/shared/helpers/phone-number.validator'
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'

import MuiPhone from '../../phone/mui-phone'
import { timezoneSelector } from '@src/states/permission'
import { useRecoilValueLoadable } from 'recoil'

type Props = {
  control: Control<Omit<PersonalInfo, 'address'>, any>
  errors: FieldErrors<Omit<PersonalInfo, 'address'>>
  watch: UseFormWatch<Omit<PersonalInfo, 'address'>>
}
export default function ProProfileForm({ control, errors, watch }: Props) {
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
    <Fragment>
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
          render={({ field: { value, onChange, onBlur } }) => (
            <FormControl fullWidth>
              <InputLabel id='Pronounce'>Pronouns</InputLabel>
              <Select
                label='Pronounce'
                value={value}
                onBlur={onBlur}
                onChange={onChange}
              >
                {Pronunciation.map((item, idx) => (
                  <MenuItem value={item.value} key={idx}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
          name='havePreferred'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControlLabel
              control={
                <Checkbox
                  value={value || false}
                  onChange={onChange}
                  checked={value || false}
                />
              }
              label='I have my preferred name'
            />
          )}
        />
      </Grid>
      {watch('havePreferred') && (
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
              onChange={(e, v) => field.onChange(v)}
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
          name='phone'
          control={control}
          rules={{ required: false }}
          render={({ field: { value, onChange, onBlur } }) => (
            <MuiPhone
              value={value || ''}
              onChange={onChange}
              label={'Telephone'}
            />
          )}
        />
        {errors.phone && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {errors.phone.message}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='mobile'
          control={control}
          rules={{ required: false }}
          render={({ field: { value, onChange, onBlur } }) => (
            <MuiPhone
              value={value || ''}
              onChange={onChange}
              label={'Mobile phone'}
            />
          )}
        />
        {errors.mobile && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {errors.mobile.message}
          </FormHelperText>
        )}
      </Grid>
    </Fragment>
  )
}

const FullWidthDatePicker = styled(DatePicker)`
  width: 100%;
`