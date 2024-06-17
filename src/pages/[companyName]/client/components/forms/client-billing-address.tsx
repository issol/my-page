// ** mui
import { Autocomplete, Box, Grid, TextField, Typography } from '@mui/material'

// ** types
// ** react hook form
import { Control, Controller, FieldErrors } from 'react-hook-form'

import { getTypeList } from '@src/shared/transformer/type.transformer'
import { FormErrors } from '@src/shared/const/formErrors'

type Props = {
  control: Control<any, any>
  errors: FieldErrors<any>
}
export default function ClientBillingAddressesForm({ control, errors }: Props) {
  const country = getTypeList('CountryCode')

  return (
    <Grid container spacing={5}>
      <Grid item xs={6}>
        <Controller
          name={'baseAddress'}
          control={control}
          render={({
            field: { value, onChange, ref },
            formState: { errors, isSubmitted },
          }) => (
            <TextField
              fullWidth
              autoComplete='off'
              error={Boolean(errors?.baseAddress) && isSubmitted}
              inputRef={ref}
              // label='Street 1*'
              value={value ?? ''}
              onChange={onChange}
              label='Street 1*'
              inputProps={{
                maxLength: 200,
              }}
              helperText={
                Boolean(errors?.baseAddress) && isSubmitted
                  ? FormErrors.required
                  : ''
              }
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name={'detailAddress'}
          control={control}
          render={({
            field: { value, onChange },
            formState: { isSubmitted },
          }) => (
            <TextField
              fullWidth
              autoComplete='off'
              value={value ?? ''}
              label='Street 2'
              onChange={onChange}
              inputProps={{
                maxLength: 200,
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name={'city'}
          control={control}
          render={({
            field: { value, onChange, ref },
            formState: { errors, isSubmitted },
          }) => (
            <TextField
              fullWidth
              autoComplete='off'
              error={Boolean(errors?.city) && isSubmitted}
              inputRef={ref}
              label='City*'
              helperText={
                Boolean(errors?.city) && isSubmitted ? FormErrors.required : ''
              }
              value={value ?? ''}
              onChange={onChange}
              inputProps={{
                maxLength: 100,
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name={'state'}
          control={control}
          render={({ field: { value, onChange }, formState }) => (
            <TextField
              fullWidth
              autoComplete='off'
              value={value ?? ''}
              label='State'
              onChange={onChange}
              inputProps={{
                maxLength: 100,
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Box
          className='filterFormAutoComplete'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            '.MuiInputBase-root': {
              padding: '0 12px',
            },
          }}
        >
          <Typography fontSize={14} fontWeight={600}>
            Country&nbsp;
            <Typography component={'span'} color='#666CFF'>
              *
            </Typography>
          </Typography>
          <Controller
            name={`country`}
            control={control}
            render={({ field, formState: { isSubmitted, errors } }) => (
              <Autocomplete
                autoHighlight
                fullWidth
                {...field}
                options={country}
                onChange={(e, v) => {
                  if (v) field.onChange(v.value)
                  else field.onChange(null)
                }}
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
                    error={Boolean(errors?.country) && isSubmitted}
                    helperText={
                      Boolean(errors?.country) && isSubmitted
                        ? FormErrors.required
                        : ''
                    }
                    inputRef={field.ref}
                    // label='Country*'

                    inputProps={{
                      ...params.inputProps,
                    }}
                  />
                )}
              />
            )}
          />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography fontSize={14} fontWeight={600}>
            ZIP code&nbsp;
            <Typography component={'span'} color='#666CFF'>
              *
            </Typography>
          </Typography>
          <Controller
            name={'zipCode'}
            control={control}
            render={({
              field: { value, onChange, ref },
              formState: { errors },
            }) => (
              <TextField
                fullWidth
                autoComplete='off'
                inputRef={ref}
                error={Boolean(errors?.zipCode)}
                helperText={
                  Boolean(errors?.zipCode)
                    ? errors?.zipCode?.type === 'required'
                      ? FormErrors.required
                      : FormErrors.invalidZipCode
                    : ''
                }
                value={value ?? ''}
                onChange={onChange}
                inputProps={{
                  maxLength: 20,
                  style: {
                    height: '46px',
                    padding: '0 14px',
                  },
                }}
              />
            )}
          />
        </Box>
      </Grid>
    </Grid>
  )
}
