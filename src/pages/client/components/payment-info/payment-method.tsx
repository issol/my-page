import { Box, Grid, Typography } from '@mui/material'
import styled from 'styled-components'

import {
  OfficeType,
  PaymentType,
} from '@src/types/payment-info/client/index.type'
import { Fragment } from 'react'

type Props = {
  office: OfficeType
}

/* TODO:
- 실 데이터로 교체
- edit form도 추가
*/
export default function PaymentMethod({ office }: Props) {
  function renderInfo(label: string, value: string | undefined) {
    return (
      <LabelContainer>
        <Typography fontWeight={600}>{label}</Typography>
        <Typography variant='body2'>{value ?? '-'}</Typography>
      </LabelContainer>
    )
  }
  function renderPaymentInfo(type: PaymentType) {
    switch (type) {
      case 'bankTransfer':
      case 'directDeposit':
        return (
          <>
            <Grid item xs={6}>
              {renderInfo('Payment method', 'Bank')}
            </Grid>
            <Grid item xs={6}>
              {renderInfo('Account holder name', 'Bank')}
            </Grid>
          </>
        )
      case 'creditCard':
        return (
          <>
            <Grid item xs={6}>
              {renderInfo('Payment method', 'Bank')}
            </Grid>
            <Grid item xs={6}>
              {renderInfo('Credit card number', 'Bank')}
            </Grid>
            <Grid item xs={6}>
              {renderInfo('Credit card valid until', 'Bank')}
            </Grid>
          </>
        )
      case 'paypal':
        return (
          <>
            <Grid item xs={6}>
              {renderInfo('Payment method', 'Bank')}
            </Grid>
            <Grid item xs={6}>
              {renderInfo('Email', 'Bank')}
            </Grid>
          </>
        )
      case 'wise':
      case 'stripe':
      case 'airwallex':
        return (
          <>
            <Grid item xs={6}>
              {renderInfo('Payment method', 'Bank')}
            </Grid>
            <Grid item xs={6}>
              {renderInfo('Account', 'Bank')}
            </Grid>
          </>
        )
      case 'check':
        return (
          <Grid item xs={6}>
            {renderInfo('Payment method', 'Bank')}
          </Grid>
        )
    }
  }

  function renderTaxInfo(type: OfficeType) {
    switch (type) {
      case 'Korea':
        return (
          <>
            <Grid item xs={12}>
              {renderInfo('Business registration number', 'Bank')}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('Name of company', 'Bank')}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('Name of representative', 'Bank')}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('Business address', 'Bank')}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('Business type/item', 'Bank')}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('Email address of the invoice recipient', 'Bank')}
            </Grid>
          </>
        )
      case 'US':
        return (
          <>
            <Grid item xs={12}>
              {renderInfo('Client name/Business name', 'Bank')}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('Client address', 'Bank')}
            </Grid>
          </>
        )
      case 'Singapore':
        return (
          <>
            <Grid item xs={12}>
              {renderInfo('Client name/Business name', 'Bank')}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('Client address', 'Bank')}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('Tax ID', 'Bank')}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('UEN ID', 'Bank')}
            </Grid>
          </>
        )
      case 'Japan':
        return (
          <>
            <Grid item xs={12}>
              {renderInfo('Client name/Business name', 'Bank')}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('Client address', 'Bank')}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('Tax ID', 'Bank')}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('Business registration number', 'Bank')}
            </Grid>
          </>
        )
    }
  }

  return (
    <Fragment>
      <BorderBox>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Typography variant='body1' color='primary'>
              Payment
            </Typography>
          </Grid>
          {renderPaymentInfo('bankTransfer')}
        </Grid>
      </BorderBox>
      <BorderBox mt={'24px'}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Typography variant='body1' color='primary'>
              Tax
            </Typography>
          </Grid>
          {renderTaxInfo(office)}
        </Grid>
      </BorderBox>
    </Fragment>
  )
}

const LabelContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`
const BorderBox = styled(Box)`
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(76, 78, 100, 0.12);
`
