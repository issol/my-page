import { FormHelperText, Grid, TextField } from '@mui/material'
import { AccountMethodFormType } from '@src/types/schema/payment-method/account-method.schema'
import { Control, Controller, FieldError, FieldErrors } from 'react-hook-form'

type Props = {
  control: Control<AccountMethodFormType, any>
  errors: FieldErrors<AccountMethodFormType>
}
export default function AccountMethodForm({ control, errors }: Props) {
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
          name='account'
          render={({ field: { onChange, value } }) => (
            <TextField
              fullWidth
              error={Boolean(errors.account)}
              value={value}
              inputProps={{ maxLength: 100 }}
              onChange={onChange}
              label='Account*'
            />
          )}
        />
        {renderError(errors.account)}
      </Grid>
    </Grid>
  )
}
