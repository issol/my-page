import { FormHelperText, Grid, TextField } from '@mui/material'
import { PayPalFormType } from '@src/types/payment-info/client/index.type'
import { Control, Controller, FieldError, FieldErrors } from 'react-hook-form'

type Props = {
  control: Control<PayPalFormType, any>
  errors: FieldErrors<PayPalFormType>
  placeholder?: string
  label?: string
}
export default function PayPalForm({
  control,
  errors,
  placeholder,
  label,
}: Props) {
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
      <Grid item xs={12}>
        <Controller
          control={control}
          name='email'
          render={({ field: { onChange, value } }) => (
            <TextField
              fullWidth
              error={Boolean(errors.email)}
              value={value}
              inputProps={{ maxLength: 100 }}
              onChange={onChange}
              label={label ?? 'Email*'}
              placeholder={placeholder ?? 'username@example.com'}
            />
          )}
        />
        {renderError(errors.email)}
      </Grid>
    </Grid>
  )
}
