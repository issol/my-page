import { Fragment } from 'react'

// ** mui
import {
  Autocomplete,
  Box,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from '@mui/material'

// ** types
import { ClientAddressType } from '@src/types/schema/client-address.schema'

// ** react hook form
import { Control, Controller, FieldErrors } from 'react-hook-form'

import { getTypeList } from '@src/shared/transformer/type.transformer'
import { renderErrorMsg } from '@src/@core/components/error/form-error-renderer'
import { FormErrors } from '@src/shared/const/formErrors'

type Props = {
  control: Control<any, any>
  errors: FieldErrors<any>
}
export default function ClientBillingAddressesForm({ control, errors }: Props) {
  const country = getTypeList('CountryCode')

  return (
    <Fragment>
      <Grid item xs={6}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography fontSize={14} fontWeight={600}>
            Street 1&nbsp;
            <Typography component={'span'} color='#666CFF'>
              *
            </Typography>
          </Typography>
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
                inputProps={{
                  maxLength: 200,
                  style: {
                    height: '46px',
                    padding: '0 14px',
                  },
                }}
                helperText={
                  Boolean(errors?.baseAddress) && isSubmitted
                    ? FormErrors.required
                    : ''
                }
              />
            )}
          />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography fontSize={14} fontWeight={600}>
            Street 2<Typography component={'span'} color='#666CFF'></Typography>
          </Typography>
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
                // error={Boolean(errors) && isSubmitted}
                // helperText={
                //   Boolean(errors) && isSubmitted ? FormErrors.required : ''
                // }
                value={value ?? ''}
                onChange={onChange}
                inputProps={{
                  maxLength: 200,
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
      <Grid item xs={6}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography fontSize={14} fontWeight={600}>
            City&nbsp;
            <Typography component={'span'} color='#666CFF'>
              *
            </Typography>
          </Typography>
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
                helperText={
                  Boolean(errors?.city) && isSubmitted
                    ? FormErrors.required
                    : ''
                }
                value={value ?? ''}
                onChange={onChange}
                inputProps={{
                  maxLength: 100,
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
      <Grid item xs={6}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography fontSize={14} fontWeight={600}>
            State
            <Typography component={'span'} color='#666CFF'></Typography>
          </Typography>
          <Controller
            name={'state'}
            control={control}
            render={({ field: { value, onChange }, formState }) => (
              <TextField
                fullWidth
                autoComplete='off'
                value={value ?? ''}
                onChange={onChange}
                inputProps={{
                  maxLength: 100,
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
      <Grid item xs={6}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            '.MuiInputBase-root': {
              height: '46px',
              padding: '0 10px',
            },
          }}
        >
          <Typography fontSize={14} fontWeight={600}>
            Country
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
              formState: { errors, isSubmitted },
            }) => (
              <TextField
                fullWidth
                autoComplete='off'
                inputRef={ref}
                error={Boolean(errors?.zipCode) && isSubmitted}
                helperText={
                  Boolean(errors?.zipCode) && isSubmitted
                    ? FormErrors.required
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
    </Fragment>
  )
}
