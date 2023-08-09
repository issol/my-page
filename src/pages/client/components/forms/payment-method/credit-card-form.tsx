import { Box, FormHelperText, Grid, InputLabel, TextField } from '@mui/material'
import CleaveWrapper from '@src/@core/styles/libs/react-cleave'
import { CreditCardFormType } from '@src/types/payment-info/client/index.type'
import Cleave from 'cleave.js/react'
import { Control, Controller, FieldError, FieldErrors } from 'react-hook-form'
import styled from 'styled-components'
type Props = {
  control: Control<CreditCardFormType, any>
  errors: FieldErrors<CreditCardFormType>
}
export default function CreditCardForm({ control, errors }: Props) {
  function renderError(errors: FieldError | undefined) {
    if (!errors) return null
    return (
      <FormHelperText sx={{ color: 'error.main' }}>
        {errors?.message}
      </FormHelperText>
    )
  }

  return (
    <CleaveWrapper>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <Controller
            control={control}
            name='cardNumber'
            render={({ field: { onChange, value } }) => (
              <>
                <InputLabel
                  htmlFor='credit-card'
                  error={Boolean(errors.cardNumber)}
                  sx={{ mb: 2, fontSize: '.75rem' }}
                >
                  Credit card number*
                </InputLabel>
                <CustomCleave
                  id='credit-card'
                  error={Boolean(errors.cardNumber)}
                  onChange={onChange}
                  value={value}
                  options={{ creditCard: true, delimiter: '-' }}
                  placeholder='0123-4567-8910-1112'
                />
              </>
            )}
          />
          {renderError(errors.cardNumber)}
        </Grid>
        <Grid item xs={6}>
          <Controller
            control={control}
            name='validDueAt'
            render={({ field: { onChange, value } }) => (
              <>
                <InputLabel
                  error={Boolean(errors.validDueAt)}
                  htmlFor='date'
                  sx={{ mb: 2, fontSize: '.75rem' }}
                >
                  Credit card valid until*
                </InputLabel>
                <CustomCleave
                  id='date'
                  error={Boolean(errors.validDueAt)}
                  placeholder='MM/YYYY'
                  value={value}
                  onChange={onChange}
                  options={{
                    date: true,
                    delimiter: '/',
                    datePattern: ['m', 'Y'],
                  }}
                />
              </>
            )}
          />
          {renderError(errors.validDueAt)}
        </Grid>
      </Grid>
    </CleaveWrapper>
  )
}

const CustomCleave = styled(Cleave)<{ error: boolean }>`
  border: ${({ error }) =>
    error ? `1px solid rgb(255, 77, 73) !important` : ''};
  ::placeholder {
    color: ${({ error }) => (error ? `rgb(255, 77, 73) !important` : '')};
  }
`
