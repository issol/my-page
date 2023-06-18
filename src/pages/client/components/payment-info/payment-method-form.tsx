import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import styled from 'styled-components'

import {
  OfficeType,
  PaymentMethodPairs,
  PaymentType,
} from '@src/types/payment-info/client/index.type'
import { Fragment, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { OfficeTaxType, getTaxInfoSchema } from '@src/types/schema/tax-info'
import { Control, useForm } from 'react-hook-form'
import {
  KoreaTaxFormType,
  koreaTaxSchema,
} from '@src/types/schema/tax-info/korea-tax.schema'
import KoreaTaxForm from '../forms/tax-info/korea-tax-form'
import USTaxForm from '../forms/tax-info/us-tax-form'
import { USTaxFormType } from '@src/types/schema/tax-info/us-tax.schema'
import SingaporeTaxForm from '../forms/tax-info/singapore-tax-form'
import { SingaporeTaxFormType } from '@src/types/schema/tax-info/singapore-tax.schema'
import JapanTaxForm from '../forms/tax-info/japan-tax-form'
import { JapanTaxFormType } from '@src/types/schema/tax-info/japan-tax.schema'
import {
  PaymentMethodUnionType,
  getPaymentMethodSchema,
} from '@src/types/schema/payment-method'
import BankTransferForm from '../forms/payment-method/bank-transfer-form'
import { BankTransferFormType } from '@src/types/schema/payment-method/bank-transfer.schema'
import CreditCardForm from '../forms/payment-method/credit-card-form'
import { CreditCardFormType } from '@src/types/schema/payment-method/credit-card.schema'
import PayPalForm from '../forms/payment-method/paypal-form'
import { PayPalFormType } from '@src/types/schema/payment-method/paypal.schema'
import AccountMethodForm from '../forms/payment-method/account-method-form'
import { AccountMethodFormType } from '@src/types/schema/payment-method/account-method.schema'

type Props = {
  office: OfficeType
  open: boolean
  onClose: () => void
}

/* TODO:
- 실 데이터로 교체
- edit form도 추가
*/
export default function PaymentMethodForm({ open, office, onClose }: Props) {
  const methodList = PaymentMethodPairs[office]
  /* TODO: currentMethod의 default value는 받아온 데이터로 하기 */
  const [currentMethod, setCurrentMethod] =
    useState<PaymentType>('bankTransfer')

  const {
    control,
    getValues,
    setValue,
    reset: resetKoreaTax,
    formState: { errors, isValid },
  } = useForm<OfficeTaxType>({
    // defaultValues,
    mode: 'onChange',
    resolver: yupResolver(getTaxInfoSchema(office)),
  })

  const {
    control: payMethodControl,
    getValues: getPayMethodValues,
    setValue: setPayMethodValue,
    reset: resetPayMethod,
    formState: { errors: payMethodErrors, isValid: isPayMethodValid },
  } = useForm<PaymentMethodUnionType>({
    // defaultValues,
    mode: 'onChange',
    resolver: yupResolver(getPaymentMethodSchema(currentMethod)),
  })

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
          <BankTransferForm
            control={payMethodControl as Control<BankTransferFormType, any>}
            errors={payMethodErrors}
          />
        )
      case 'creditCard':
        return (
          <CreditCardForm
            control={payMethodControl as Control<CreditCardFormType, any>}
            errors={payMethodErrors}
          />
        )
      case 'paypal':
        return (
          <PayPalForm
            control={payMethodControl as Control<PayPalFormType, any>}
            errors={payMethodErrors}
          />
        )
      case 'wise':
      case 'stripe':
      case 'airwallex':
        return (
          <AccountMethodForm
            control={payMethodControl as Control<AccountMethodFormType, any>}
            errors={payMethodErrors}
          />
        )
      case 'check':
        return (
          <Grid item xs={6}>
            <Typography color='primary'>* No info required</Typography>
          </Grid>
        )
    }
  }

  function renderTaxInfo(type: OfficeType) {
    switch (type) {
      case 'Korea':
        return (
          <KoreaTaxForm
            control={control as Control<KoreaTaxFormType, any>}
            errors={errors}
          />
        )
      case 'US':
        return (
          <USTaxForm
            control={control as Control<USTaxFormType, any>}
            errors={errors}
          />
        )
      case 'Singapore':
        return (
          <SingaporeTaxForm
            control={control as Control<SingaporeTaxFormType, any>}
            errors={errors}
          />
        )
      case 'Japan':
        return (
          <JapanTaxForm
            control={control as Control<JapanTaxFormType, any>}
            errors={errors}
          />
        )
    }
  }

  return (
    <Dialog open={open} maxWidth='md'>
      <DialogContent sx={{ padding: '50px' }}>
        <Fragment>
          <Grid item xs={12} mb='24px'>
            <Typography variant='h6'>Payment method</Typography>
          </Grid>
          <Grid item xs={12} mb='24px'>
            <RadioGroup
              row
              aria-label='controlled'
              name='controlled'
              value={currentMethod}
              onChange={e => {
                setCurrentMethod(e.target.value as PaymentType)
              }}
            >
              {methodList.map(item => (
                <FormControlLabel
                  key={item.value}
                  value={item.value}
                  control={<Radio />}
                  label={item.label}
                />
              ))}
            </RadioGroup>
          </Grid>
          {renderPaymentInfo(currentMethod)}
          <Grid item xs={12} mt='24px' mb='24px'>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h6' mb='24px'>
              Tax
            </Typography>
          </Grid>

          {renderTaxInfo(office)}
        </Fragment>
        <Box
          width='100%'
          mt='50px'
          display='flex'
          gap='16px'
          justifyContent='center'
        >
          <Button variant='outlined' color='secondary' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            disabled={
              !isValid || (!isPayMethodValid && currentMethod !== 'check')
            }
          >
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

const LabelContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`
