import { Fragment } from 'react'

// ** mui
import { Autocomplete, FormHelperText, Grid, TextField } from '@mui/material'

// ** types
import { ClientAddressType } from '@src/types/schema/client-address.schema'

// ** react hook form
import { Control, Controller, FieldErrors } from 'react-hook-form'

import { getTypeList } from '@src/shared/transformer/type.transformer'

type Props = {
  control: Control<ClientAddressType, any>
  errors: FieldErrors<ClientAddressType>
}
export default function ClientBillingAddressesForm({ control, errors }: Props) {
  const country = getTypeList('CountryCode')

  function renderForm(
    key:
      | 'baseAddress'
      | 'detailAddress'
      | 'city'
      | 'state'
      | 'zipCode'
      | 'name',
    label: string,
    maxLength: number,
  ) {
    return (
      <>
        <Controller
          name={`${key}`}
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              error={
                key !== 'name'
                  ? false
                  : errors?.[key]
                  ? Boolean(errors?.[key])
                  : false
              }
              label={label}
              value={value ?? ''}
              onChange={onChange}
              inputProps={{ maxLength }}
            />
          )}
        />
        {key === 'name' && errors?.[key] && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {errors?.[key]?.message}
          </FormHelperText>
        )}
      </>
    )
  }

  return (
    <Fragment>
      <Grid item xs={6}>
        {renderForm('baseAddress', 'Street 1*', 200)}
      </Grid>
      <Grid item xs={6}>
        {renderForm('detailAddress', 'Street 2', 200)}
      </Grid>
      <Grid item xs={6}>
        {renderForm('city', 'City*', 100)}
      </Grid>
      <Grid item xs={6}>
        {renderForm('state', 'State', 100)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name={`country`}
          control={control}
          render={({ field }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              {...field}
              options={country}
              onChange={(e, v) => field.onChange(v.value)}
              disableClearable
              value={
                !field?.value
                  ? { value: '', label: '' }
                  : country.filter(item => item.value === field?.value)[0]
              }
              renderInput={params => (
                <TextField
                  {...params}
                  label='Country*'
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        {renderForm('zipCode', 'ZIP code*', 20)}
      </Grid>
    </Fragment>
  )
}
