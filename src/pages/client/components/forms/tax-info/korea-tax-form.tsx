import { FormHelperText, Grid, TextField } from '@mui/material'
import { KoreaTaxFormType } from '@src/types/schema/tax-info/korea-tax.schema'
import { Fragment } from 'react'
import { Control, Controller, FieldError, FieldErrors } from 'react-hook-form'

type Props = {
  control: Control<KoreaTaxFormType, any>
  errors: FieldErrors<KoreaTaxFormType>
}
export default function KoreaTaxForm({ control, errors }: Props) {
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
          name='businessNumber'
          render={({ field: { onChange, value } }) => (
            <TextField
              fullWidth
              error={Boolean(errors.businessNumber)}
              value={value}
              type='number'
              onChange={e => {
                const value = e.target.value
                if (value.length > 50) return
                onChange(value)
              }}
              label='Business registration number*'
            />
          )}
        />
        {renderError(errors.businessNumber)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          control={control}
          name='companyName'
          render={({ field: { onChange, value } }) => (
            <TextField
              fullWidth
              error={Boolean(errors.companyName)}
              value={value}
              inputProps={{ maxLength: 100 }}
              onChange={onChange}
              label='Name of company*'
            />
          )}
        />
        {renderError(errors.companyName)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          control={control}
          name='representativeName'
          render={({ field: { onChange, value } }) => (
            <TextField
              fullWidth
              error={Boolean(errors.representativeName)}
              value={value}
              inputProps={{ maxLength: 100 }}
              onChange={onChange}
              label='Name of representative*'
            />
          )}
        />
        {renderError(errors.representativeName)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          control={control}
          name='businessAddress'
          render={({ field: { onChange, value } }) => (
            <TextField
              fullWidth
              error={Boolean(errors.businessAddress)}
              value={value}
              inputProps={{ maxLength: 500 }}
              onChange={onChange}
              label='Business address*'
            />
          )}
        />
        {renderError(errors.businessAddress)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          control={control}
          name='businessType'
          render={({ field: { onChange, value } }) => (
            <TextField
              fullWidth
              error={Boolean(errors.businessType)}
              value={value}
              inputProps={{ maxLength: 100 }}
              onChange={onChange}
              label='Business type/item*'
            />
          )}
        />
        {renderError(errors.businessType)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          control={control}
          name='recipientEmail'
          render={({ field: { onChange, value } }) => (
            <TextField
              fullWidth
              error={Boolean(errors.recipientEmail)}
              value={value}
              inputProps={{ maxLength: 100 }}
              onChange={onChange}
              label='Email address of the invoice recipient*'
              placeholder='recipient@example.com'
            />
          )}
        />
        {renderError(errors.recipientEmail)}
      </Grid>
    </Grid>
  )
}
