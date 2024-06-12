import { FormHelperText, Grid, TextField } from '@mui/material'
import { USTaxFormType } from '@src/types/payment-info/client/index.type'
import { Control, Controller, FieldError, FieldErrors } from 'react-hook-form'

type Props = {
  control: Control<USTaxFormType, any>
  errors: FieldErrors<USTaxFormType>
}
export default function USTaxForm({ control, errors }: Props) {
  function renderError(errors: FieldError | undefined) {
    if (!errors) return null
    return (
      <FormHelperText sx={{ color: 'error.main' }}>
        {errors?.message}
      </FormHelperText>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <Controller
          control={control}
          name='clientName'
          render={({ field: { onChange, value } }) => (
            <TextField
              fullWidth
              autoComplete='off'
              error={Boolean(errors.clientName)}
              value={value}
              inputProps={{ maxLength: 50 }}
              onChange={onChange}
              label='Client name/Business name*'
            />
          )}
        />
        {renderError(errors.clientName)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          control={control}
          name='clientAddress'
          render={({ field: { onChange, value } }) => (
            <TextField
              fullWidth
              autoComplete='off'
              error={Boolean(errors.clientAddress)}
              value={value}
              inputProps={{ maxLength: 500 }}
              onChange={onChange}
              label='Client address*'
            />
          )}
        />
        {renderError(errors.clientAddress)}
      </Grid>
    </Grid>
  )
}
