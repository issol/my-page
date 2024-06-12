import { Box, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'

// ** types
import {
  AccountMethodFormType,
  BankTransferFormType,
  ClientPaymentInfoDetail,
  CreditCardFormType,
  JapanTaxFormType,
  KoreaTaxFormType,
  OfficeType,
  PayPalFormType,
  PaymentType,
  SingaporeTaxFormType,
  USTaxFormType,
} from '@src/types/payment-info/client/index.type'

import { Fragment, useMemo } from 'react'

type Props = {
  office: OfficeType
  paymentInfo: ClientPaymentInfoDetail | undefined
}

export default function PaymentMethod({ office, paymentInfo }: Props) {
  const currentPaymentInfo = useMemo(() => paymentInfo, [office, paymentInfo])

  function renderInfo(
    label: string,
    value: string | number | null | undefined,
  ) {
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
        const deposit = currentPaymentInfo?.paymentData as
          | BankTransferFormType
          | undefined
        return (
          <>
            <Grid item xs={6}>
              {renderInfo('Payment method', currentPaymentInfo?.paymentMethod)}
            </Grid>
            <Grid item xs={6}>
              {renderInfo('Bank name', deposit?.bankName)}
            </Grid>
            <Grid item xs={6}>
              {renderInfo('Account holder name', deposit?.accountHolder)}
            </Grid>
          </>
        )
      case 'creditCard':
        const creditCard = currentPaymentInfo?.paymentData as
          | CreditCardFormType
          | undefined
        return (
          <>
            <Grid item xs={6}>
              {renderInfo('Payment method', currentPaymentInfo?.paymentMethod)}
            </Grid>
            <Grid item xs={6}>
              {renderInfo('Credit card number', creditCard?.cardNumber)}
            </Grid>
            <Grid item xs={6}>
              {renderInfo('Credit card valid until', creditCard?.validDueAt)}
            </Grid>
          </>
        )
      case 'paypal':
        const paypal = currentPaymentInfo?.paymentData as
          | PayPalFormType
          | undefined
        return (
          <>
            <Grid item xs={6}>
              {renderInfo('Payment method', currentPaymentInfo?.paymentMethod)}
            </Grid>
            <Grid item xs={6}>
              {renderInfo('Email', paypal?.email)}
            </Grid>
          </>
        )
      case 'wise':
      case 'stripe':
      case 'airwallex':
        const account = currentPaymentInfo?.paymentData as
          | AccountMethodFormType
          | undefined
        return (
          <>
            <Grid item xs={6}>
              {renderInfo('Payment method', currentPaymentInfo?.paymentMethod)}
            </Grid>
            <Grid item xs={6}>
              {renderInfo('Account', account?.account)}
            </Grid>
          </>
        )
      case 'check':
        return (
          <Grid item xs={6}>
            {renderInfo('Payment method', currentPaymentInfo?.paymentMethod)}
          </Grid>
        )
    }
  }

  function renderTaxInfo(type: OfficeType) {
    switch (type) {
      case 'Korea':
        const korea = currentPaymentInfo?.taxData as
          | KoreaTaxFormType
          | undefined

        return (
          <>
            <Grid item xs={12}>
              {renderInfo(
                'Business registration number',
                korea?.businessNumber,
              )}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('Name of company', korea?.companyName)}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('Name of representative', korea?.representativeName)}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('Business address', korea?.businessAddress)}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('Business type/item', korea?.businessType)}
            </Grid>
            <Grid item xs={12}>
              {renderInfo(
                'Email address of the invoice recipient',
                korea?.recipientEmail,
              )}
            </Grid>
          </>
        )
      case 'US':
        const us = currentPaymentInfo?.taxData as USTaxFormType | undefined
        return (
          <>
            <Grid item xs={12}>
              {renderInfo('Client name/Business name', us?.clientName)}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('Client address', us?.clientAddress)}
            </Grid>
          </>
        )
      case 'Singapore':
        const singapore = currentPaymentInfo?.taxData as
          | SingaporeTaxFormType
          | undefined
        return (
          <>
            <Grid item xs={12}>
              {renderInfo('Client name/Business name', singapore?.clientName)}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('Client address', singapore?.clientAddress)}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('Tax ID', singapore?.taxId)}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('UEN ID', singapore?.uenId)}
            </Grid>
          </>
        )
      case 'Japan':
        const japan = currentPaymentInfo?.taxData as
          | JapanTaxFormType
          | undefined
        return (
          <>
            <Grid item xs={12}>
              {renderInfo('Client name/Business name', japan?.clientName)}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('Client address', japan?.clientAddress)}
            </Grid>
            <Grid item xs={12}>
              {renderInfo('Tax ID', japan?.taxId)}
            </Grid>
            <Grid item xs={12}>
              {renderInfo(
                'Business registration number',
                japan?.businessNumber,
              )}
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
          {renderPaymentInfo(
            currentPaymentInfo?.paymentMethod ?? 'bankTransfer',
          )}
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

const LabelContainer = styled('div')`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`
const BorderBox = styled(Box)`
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(76, 78, 100, 0.12);
`
