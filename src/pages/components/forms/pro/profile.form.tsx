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
import { getTypeList } from '@src/shared/transformer/type.transformer'
import { CountryType, PersonalInfo } from '@src/types/sign/personalInfoTypes'
import { Fragment } from 'react'
import { Control, Controller, FieldErrors, UseFormWatch } from 'react-hook-form'
import { Pronunciation } from 'src/shared/const/pronunciation'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Data
import { countries } from 'src/@fake-db/autocomplete'
import { isInvalidPhoneNumber } from '@src/shared/helpers/phone-number.validator'

type Props = {
  control: Control<PersonalInfo, any>
  errors: FieldErrors<PersonalInfo>
  watch: UseFormWatch<PersonalInfo>
}
export default function ProProfileForm({ control, errors, watch }: Props) {
  const country = getTypeList('CountryCode')
  return (
    <Fragment>
      <Grid item xs={6}>
        <Controller
          name='legalNamePronunciation'
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
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
          rules={{ required: true }}
          render={({ field: { value, onChange, onBlur } }) => (
            <FormControl fullWidth>
              <InputLabel id='Pronounce'>Pronounce</InputLabel>
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
          rules={{ required: true }}
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
        <Divider />
      </Grid>
      <Grid item xs={6}>
        <DatePickerWrapper>
          <Controller
            name='dateOfBirth'
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
      <Grid item xs={6}>
        <Controller
          name='timezone'
          control={control}
          render={({ field }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              {...field}
              options={countries as CountryType[]}
              onChange={(e, v) => field.onChange(v)}
              disableClearable
              renderOption={(props, option) => (
                <Box component='li' {...props}>
                  {option.label} ({option.code}) +{option.phone}
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Time zone*'
                  error={Boolean(errors.timezone)}
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
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
          name='residence'
          control={control}
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              options={country}
              onChange={(e, v) => onChange(v?.value ?? null)}
              value={
                !value
                  ? null
                  : country.find(item => item.value === value) || null
              }
              renderInput={params => (
                <TextField
                  {...params}
                  label='Residence'
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
        />
        {errors.residence && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {errors.residence.message}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='mobile'
          control={control}
          rules={{ required: false }}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              fullWidth
              label='Mobile phone'
              variant='outlined'
              value={value}
              onBlur={onBlur}
              onChange={e => {
                if (isInvalidPhoneNumber(e.target.value)) return
                onChange(e)
              }}
              inputProps={{ maxLength: 50 }}
              error={Boolean(errors.mobile)}
              placeholder={
                !watch('timezone')?.phone ? `+ 1) 012 345 6789` : `012 345 6789`
              }
              InputProps={{
                startAdornment: watch('timezone')?.phone && (
                  <InputAdornment position='start'>
                    {'+' + watch('timezone')?.phone}
                  </InputAdornment>
                ),
              }}
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
