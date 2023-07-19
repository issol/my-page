import { Grid, TextField } from '@mui/material'
import { CorrespondentBankInfo } from '@src/types/payment-info/pro/billing-method.type'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { numberSpecialCharRegex } from '@src/shared/regex'

type Props = {
  control: Control<CorrespondentBankInfo, any>
  errors: FieldErrors<CorrespondentBankInfo>
}

export default function CorresPondentBankInfoForm({ control, errors }: Props) {
  return (
    <>
      <Grid item xs={4}>
        <Controller
          name='routingNumber'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange, onBlur } }) => (
            <>
              <TextField
                fullWidth
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
      <Grid item xs={4}>
        <Controller
          name='swiftCode'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange, onBlur } }) => (
            <>
              <TextField
                fullWidth
                autoFocus
                value={value}
                onBlur={onBlur}
                onChange={e => {
                  const v = e.target.value
                  if (!numberSpecialCharRegex.test(v) && !!v) return
                  onChange(e)
                }}
                inputProps={{ maxLength: 50 }}
                error={Boolean(errors.swiftCode)}
                label='SWIFT code / BIC'
              />
            </>
          )}
        />
      </Grid>
      <Grid item xs={4}>
        <Controller
          name='iban'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange, onBlur } }) => (
            <>
              <TextField
                fullWidth
                autoFocus
                value={value}
                onBlur={onBlur}
                onChange={e => {
                  const v = e.target.value
                  if (!numberSpecialCharRegex.test(v) && !!v) return
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
