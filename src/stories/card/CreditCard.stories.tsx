import React, { ChangeEvent, useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import CardWrapper from 'src/@core/styles/libs/react-credit-cards'
import Cards, { Focused } from 'react-credit-cards'
import {
  formatCVC,
  formatExpirationDate,
  formatCreditCardNumber,
} from 'src/@core/utils/format'
import Payment from 'payment'
import {
  Alert,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material'
import 'react-credit-cards/es/styles-compiled.css'

export default {
  title: 'Card/CreditCard',
  component: CardWrapper,
} as ComponentMeta<typeof CardWrapper>

export const Default = () => {
  const [cvc, setCvc] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [focus, setFocus] = useState<string>('')
  const [expiry, setExpiry] = useState<string>('')
  const [cardNumber, setCardNumber] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('card')

  const handleBlur = () => setFocus('')

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.name === 'number') {
      target.value = formatCreditCardNumber(target.value, Payment)
      setCardNumber(target.value)
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value)
      setExpiry(target.value)
    } else if (target.name === 'cvc') {
      target.value = formatCVC(target.value, cardNumber, Payment)
      setCvc(target.value)
    }
  }
  return (
    <form onSubmit={e => e.preventDefault()}>
      <Alert severity='error'>
        멋진 카드 디자인을 위해서는{' '}
        <code>import 'react-credit-cards/es/styles-compiled.css'</code>를
        import해주세요.
      </Alert>
      <h2>Payment Method</h2>

      <Divider />
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <RadioGroup
                row
                value={paymentMethod}
                aria-label='payment type'
                name='form-layouts-collapsible-payment-radio'
                onChange={e => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value='card'
                  control={<Radio />}
                  label='Credit/Debit/ATM Card'
                />
                <FormControlLabel
                  value='cash'
                  control={<Radio />}
                  label='Cash on Delivery'
                />
              </RadioGroup>
            </Grid>
            {paymentMethod === 'card' ? (
              <Grid item xs={12}>
                <Grid container spacing={6}>
                  <Grid item xs={12}>
                    <CardWrapper>
                      <Cards
                        cvc={cvc}
                        focused={focus as Focused}
                        expiry={expiry}
                        name={name}
                        number={cardNumber}
                      />
                    </CardWrapper>
                  </Grid>
                  <Grid item xs={12} md={8} xl={6} sx={{ mt: 2 }}>
                    <Grid container spacing={6}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name='number'
                          value={cardNumber}
                          autoComplete='off'
                          label='Card Number'
                          onBlur={handleBlur}
                          onChange={handleInputChange}
                          placeholder='0000 0000 0000 0000'
                          onFocus={e => setFocus(e.target.name)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name='name'
                          value={name}
                          label='Name'
                          autoComplete='off'
                          onBlur={handleBlur}
                          placeholder='John Doe'
                          onFocus={e => setFocus(e.target.name)}
                          onChange={e => setName(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          name='expiry'
                          value={expiry}
                          autoComplete='off'
                          label='Expiry Date'
                          placeholder='MM/YY'
                          onBlur={handleBlur}
                          onChange={handleInputChange}
                          inputProps={{ maxLength: '5' }}
                          onFocus={e => setFocus(e.target.name)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          name='cvc'
                          value={cvc}
                          label='CVC Code'
                          autoComplete='off'
                          onBlur={handleBlur}
                          onChange={handleInputChange}
                          onFocus={e => setFocus(e.target.name)}
                          placeholder={
                            Payment.fns.cardType(cardNumber) === 'amex'
                              ? '1234'
                              : '123'
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}
