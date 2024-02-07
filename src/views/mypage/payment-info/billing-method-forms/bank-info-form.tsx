import { Grid, TextField, Typography } from '@mui/material'
import { renderErrorMsg } from '@src/@core/components/error/form-error-renderer'
import { BankInfo } from '@src/types/payment-info/pro/billing-method.type'
import { Control, Controller, FieldErrors, useForm } from 'react-hook-form'
import { numberSpecialCharRegex } from '@src/shared/regex'

type Props = {
  control: Control<BankInfo, any>
  errors: FieldErrors<BankInfo>
}

export default function BankInfoForm({ control, errors }: Props) {
  return (
    <>
      <Grid item xs={12}>
        <Controller
          name='bankName'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange, onBlur } }) => (
            <>
              <TextField
                fullWidth
                autoComplete='off'
                autoFocus
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                inputProps={{ maxLength: 50 }}
                error={Boolean(errors.bankName)}
                label='Bank name*'
              />
            </>
          )}
        />
        {renderErrorMsg(errors.bankName)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='accountNumber'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange, onBlur } }) => (
            <>
              <TextField
                fullWidth
                autoComplete='off'
                autoFocus
                value={value}
                onBlur={onBlur}
                onChange={e => {
                  const v = e.target.value
                  if (!numberSpecialCharRegex.test(v) && !!v) return
                  onChange(e)
                }}
                inputProps={{ maxLength: 50 }}
                error={Boolean(errors.accountNumber)}
                label='Account number*'
              />
            </>
          )}
        />
        {renderErrorMsg(errors.accountNumber)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='routingNumber'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange, onBlur } }) => (
            <>
              <TextField
                fullWidth
                autoComplete='off'
                autoFocus
                value={value}
                onBlur={onBlur}
                onChange={e => {
                  const v = e.target.value
                  if (!numberSpecialCharRegex.test(v) && !!v) return
                  onChange(e)
                }}
                inputProps={{ maxLength: 50 }}
                error={Boolean(errors.routingNumber)}
                label='Bank routing number'
              />
            </>
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='swiftCode'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange, onBlur } }) => (
            <>
              <TextField
                fullWidth
                autoComplete='off'
                autoFocus
                value={value}
                onBlur={onBlur}
                onChange={e => {
                  const v = e.target.value
                  // if (!numberSpecialCharRegex.test(v) && !!v) return
                  onChange(e)
                }}
                inputProps={{ maxLength: 50 }}
                error={Boolean(errors?.swiftCode)}
                label='SWIFT code / BIC'
              />
            </>
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='iban'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange, onBlur } }) => (
            <>
              <TextField
                fullWidth
                autoComplete='off'
                autoFocus
                value={value}
                onBlur={onBlur}
                onChange={e => {
                  const v = e.target.value
                  // if (!numberSpecialCharRegex.test(v) && !!v) return
                  onChange(e)
                }}
                inputProps={{ maxLength: 50 }}
                error={Boolean(errors.iban)}
                label='IBAN'
              />
            </>
          )}
        />
      </Grid>
    </>
  )
}
