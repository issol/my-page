import { Fragment } from 'react'

import {
  Autocomplete,
  Box,
  Divider,
  Grid,
  InputAdornment,
  TextField,
} from '@mui/material'

// ** helper
import { isInvalidPhoneNumber } from '@src/shared/helpers/phone-number.validator'

// ** types
import { ContactPersonType } from '@src/types/schema/client-contact-person.schema'

// ** react hook form
import { Control, Controller, FieldErrors, UseFormWatch } from 'react-hook-form'

// ** Data
import { countries } from 'src/@fake-db/autocomplete'
import { CountryType } from '@src/types/sign/personalInfoTypes'

// ** components
import { renderErrorMsg } from '@src/@core/components/error/form-error-renderer'
import { v4 as uuidv4 } from 'uuid'

type Props<T extends number | string = number> = {
  control: Control<ContactPersonType, any>
  errors: FieldErrors<ContactPersonType>
  watch: UseFormWatch<ContactPersonType<T>>
}

// ** TAD가 직접 contact person을 등록하는 경우에 사용되는 schema
export default function CreateContactPersonForm<
  T extends number | string = number,
>(props: Props<T>) {
  const { control, errors, watch } = props

  function renderTextFieldForm(
    key: keyof Omit<ContactPersonType, 'timezone'>,
    label: string,
    maxLength: number,
    placeholder?: string,
  ) {
    {
      return (
        <Fragment>
          <Controller
            name={key}
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                error={Boolean(errors?.[key])}
                label={label}
                value={value ?? ''}
                onChange={onChange}
                placeholder={placeholder}
                inputProps={{ maxLength }}
              />
            )}
          />
          {renderErrorMsg(errors[key])}
        </Fragment>
      )
    }
  }

  function renderPhoneField(key: keyof ContactPersonType, label: string) {
    return (
      <>
        <Controller
          name={key}
          control={control}
          rules={{ required: false }}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              autoFocus
              label={label}
              variant='outlined'
              value={value ?? ''}
              onChange={e => {
                if (isInvalidPhoneNumber(e.target.value)) return
                onChange(e)
              }}
              inputProps={{ maxLength: 50 }}
              placeholder={
                !watch(`timezone`)?.phone ? `+ 1) 012 345 6789` : `012 345 6789`
              }
              InputProps={{
                startAdornment: watch(`timezone`)?.phone && (
                  <InputAdornment position='start'>
                    {'+' + watch(`timezone`)?.phone}
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        {renderErrorMsg(errors[key])}
      </>
    )
  }

  return (
    <Fragment>
      <Grid item xs={4}>
        {renderTextFieldForm('firstName', 'First name*', 50)}
      </Grid>
      <Grid item xs={4}>
        {renderTextFieldForm('middleName', 'Middle name', 50)}
      </Grid>
      <Grid item xs={4}>
        {renderTextFieldForm('lastName', 'Last name*', 50)}
      </Grid>
      <Grid item xs={6}>
        {renderTextFieldForm('department', 'Department', 50, 'IP business')}
      </Grid>
      <Grid item xs={6}>
        {renderTextFieldForm('jobTitle', 'Job title', 50, 'Manager')}
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name={`timezone`}
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
                <Box component='li' {...props} key={uuidv4()}>
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
        {renderErrorMsg(errors.timezone)}
      </Grid>
      <Grid item xs={6}>
        {renderPhoneField('phone', 'Telephone')}
      </Grid>
      <Grid item xs={6}>
        {renderPhoneField('mobile', 'Mobile phone')}
      </Grid>
      <Grid item xs={6}>
        {renderPhoneField('fax', 'Fax')}
      </Grid>
    </Fragment>
  )
}
