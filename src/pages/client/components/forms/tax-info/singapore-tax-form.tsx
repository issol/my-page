import { FormHelperText, Grid, TextField } from '@mui/material'
import { SingaporeTaxFormType } from '@src/types/payment-info/client/index.type'
import { Control, Controller, FieldError, FieldErrors } from 'react-hook-form'

type Props = {
  control: Control<SingaporeTaxFormType, any>
  errors: FieldErrors<SingaporeTaxFormType>
}
export default function SingaporeTaxForm({ control, errors }: Props) {
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
              error={Boolean(errors.clientName)}
              value={value}
              inputProps={{ maxLength: 100 }}
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
      <Grid item xs={6}>
        <Controller
          control={control}
          name='taxId'
          render={({ field: { onChange, value } }) => (
            <TextField
              fullWidth
              error={Boolean(errors.taxId)}
              value={value}
              type='number'
              onChange={e => {
                const value = e.target.value
                if (value.length > 50) return
                onChange(value)
              }}
              label='Tax ID'
            />
          )}
        />
        {renderError(errors.taxId)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          control={control}
          name='uenId'
          render={({ field: { onChange, value } }) => (
            <TextField
              fullWidth
              error={Boolean(errors.uenId)}
              value={value}
              type='number'
              onChange={e => {
                const value = e.target.value
                if (value.length > 50) return
                onChange(value)
              }}
              label='UEN ID'
            />
          )}
        />
        {renderError(errors.uenId)}
      </Grid>
    </Grid>
  )
}
