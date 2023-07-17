import { FormHelperText, Grid, TextField } from '@mui/material'
import { BankTransferFormType } from '@src/types/payment-info/client/index.type'
import { Control, Controller, FieldError, FieldErrors } from 'react-hook-form'

type Props = {
  control: Control<BankTransferFormType, any>
  errors: FieldErrors<BankTransferFormType>
}
export default function BankTransferForm({ control, errors }: Props) {
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
          name='bankName'
          render={({ field: { onChange, value } }) => (
            <TextField
              fullWidth
              error={Boolean(errors.bankName)}
              value={value}
              inputProps={{ maxLength: 100 }}
              onChange={onChange}
              label='Bank name*'
              placeholder='Hana Bank'
            />
          )}
        />
        {renderError(errors.bankName)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          control={control}
          name='accountHolder'
          render={({ field: { onChange, value } }) => (
            <TextField
              fullWidth
              error={Boolean(errors.accountHolder)}
              value={value}
              inputProps={{ maxLength: 100 }}
              onChange={onChange}
              label='Account holder name*'
            />
          )}
        />
        {renderError(errors.accountHolder)}
      </Grid>
    </Grid>
  )
}
