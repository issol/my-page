import { Fragment } from 'react'

// ** mui
import { Autocomplete, FormHelperText, Grid, TextField } from '@mui/material'

// ** types
import { ClientAddressType } from '@src/types/schema/client-address.schema'

// ** react hook form
import { Control, Controller, FieldErrors } from 'react-hook-form'

import { getTypeList } from '@src/shared/transformer/type.transformer'
import { renderErrorMsg } from '@src/@core/components/error/form-error-renderer'

type Props = {
  control: Control<ClientAddressType, any>
  errors: FieldErrors<ClientAddressType>
}
export default function ClientBillingAddressesForm({ control, errors }: Props) {
  const country = getTypeList('CountryCode')

  return (
    <Fragment>
      <Grid item xs={6}>
        <Controller
          name={'baseAddress'}
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              autoComplete='off'
              error={Boolean(errors.baseAddress)}
              label='Street 1*'
              value={value ?? ''}
              onChange={onChange}
              inputProps={{ maxLength: 200 }}
            />
          )}
        />
        {renderErrorMsg(errors.baseAddress)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name={'detailAddress'}
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              autoComplete='off'
              error={Boolean(errors.detailAddress)}
              label='Street 2'
              value={value ?? ''}
              onChange={onChange}
              inputProps={{ maxLength: 200 }}
            />
          )}
        />
        {renderErrorMsg(errors.detailAddress)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name={'city'}
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              autoComplete='off'
              error={Boolean(errors.city)}
              label='City*'
              value={value ?? ''}
              onChange={onChange}
              inputProps={{ maxLength: 100 }}
            />
          )}
        />
        {renderErrorMsg(errors.city)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name={'state'}
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              autoComplete='off'
              error={Boolean(errors.state)}
              label='State'
              value={value ?? ''}
              onChange={onChange}
              inputProps={{ maxLength: 100 }}
            />
          )}
        />
        {renderErrorMsg(errors.state)}
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
                  autoComplete='off'
                  error={Boolean(errors.country)}
                  label='Country*'
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
        />
        {renderErrorMsg(errors.country)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name={'zipCode'}
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              autoComplete='off'
              error={Boolean(errors.zipCode)}
              label='ZIP code*'
              value={value ?? ''}
              onChange={onChange}
              inputProps={{ maxLength: 20 }}
            />
          )}
        />
        {renderErrorMsg(errors.zipCode)}
      </Grid>
    </Fragment>
  )
}
