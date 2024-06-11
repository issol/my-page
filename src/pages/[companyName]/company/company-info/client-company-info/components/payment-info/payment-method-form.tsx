import { Fragment, useEffect, useMemo, useState } from 'react'

// ** style components
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'

// ** type & validation
import {
  AccountMethodFormType,
  BankTransferFormType,
  ClientPaymentInfoDetail,
  CreditCardFormType,
  JapanTaxFormType,
  OfficeTaxType,
  OfficeType,
  PayPalFormType,
  PaymentMethodPairs,
  PaymentMethodUnionType,
  PaymentType,
  SingaporeTaxFormType,
  USTaxFormType,
} from '@src/types/payment-info/client/index.type'
import {
  clientTaxInitialData,
  getTaxInfoSchema,
} from '@src/types/schema/tax-info'
import {
  clientPaymentInitialData,
  getPaymentMethodSchema,
} from '@src/types/schema/payment-method/client'

// ** third parties
import { yupResolver } from '@hookform/resolvers/yup'
import { Control, useForm } from 'react-hook-form'

// ** components
import BankTransferForm from 'src/pages/[companyName]/client/components/forms/payment-method/bank-transfer-form'
import CreditCardForm from 'src/pages/[companyName]/client/components/forms/payment-method/credit-card-form'
import AccountMethodForm from 'src/pages/[companyName]/client/components/forms/payment-method/account-method-form'
import PayPalForm from 'src/pages/[companyName]/client/components/forms/payment-method/paypal-form'
import USTaxForm from 'src/pages/[companyName]/client/components/forms/tax-info/us-tax-form'
import SingaporeTaxForm from 'src/pages/[companyName]/client/components/forms/tax-info/singapore-tax-form'
import JapanTaxForm from 'src/pages/[companyName]/client/components/forms/tax-info/japan-tax-form'
import { isEmpty } from 'lodash'

type Props = {
  office: OfficeType
  cancel: () => void
  openDiscardModal: (onClick: any) => void
  paymentInfo: ClientPaymentInfoDetail | undefined
  onSave: (
    paymentMethod: PaymentType,
    office: OfficeType,
    paymentInfo: PaymentMethodUnionType,
    taxInfo: OfficeTaxType,
  ) => void
}

export default function PaymentMethodForm({
  office,
  paymentInfo,
  cancel,
  openDiscardModal,
  onSave,
}: Props) {
  const methodList = PaymentMethodPairs[office]

  const currentPaymentInfo = useMemo(() => paymentInfo, [office, paymentInfo])

  const [currentMethod, setCurrentMethod] = useState<PaymentType>(
    currentPaymentInfo?.paymentMethod || methodList[0].value,
  )

  const {
    control,
    getValues,
    reset,
    formState: { errors, isValid, dirtyFields },
  } = useForm<OfficeTaxType>({
    mode: 'onChange',
    defaultValues: clientTaxInitialData(office),
    resolver: yupResolver(getTaxInfoSchema(office, 'client')),
  })

  const {
    control: payMethodControl,
    getValues: getPayMethodValues,
    reset: resetPayMethod,
    formState: {
      errors: payMethodErrors,
      isValid: isPayMethodValid,
      dirtyFields: payMethodDirtyFields,
    },
  } = useForm<PaymentMethodUnionType>({
    mode: 'onChange',
    defaultValues: clientPaymentInitialData(currentMethod),
    resolver: yupResolver(getPaymentMethodSchema(currentMethod)),
  })

  function resetTaxDataForm() {
    reset(currentPaymentInfo?.taxData)
  }

  function resetPaymentInfoForm() {
    resetPayMethod(currentPaymentInfo?.paymentData)
  }

  useEffect(() => {
    if (currentPaymentInfo?.taxData) {
      resetTaxDataForm()
    }
  }, [office])

  useEffect(() => {
    if (currentPaymentInfo?.paymentData) {
      resetPaymentInfoForm()
    }
  }, [currentMethod])

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
          <PayPalForm
            control={control as Control<PayPalFormType, any>}
            errors={errors}
            label='Email address of the invoice recipient*'
            placeholder='recipient@example.com'
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

  function onSubmit() {
    const paymentInfo = getPayMethodValues()
    const taxInfo = getValues()
    onSave(currentMethod, office, paymentInfo, taxInfo)
  }

  return (
    <>
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
        <Button
          variant='outlined'
          color='secondary'
          onClick={() => {
            if (isEmpty(dirtyFields) && isEmpty(payMethodDirtyFields)) {
              cancel()
            } else {
              openDiscardModal(() => {
                cancel()
                reset(currentPaymentInfo?.taxData)
                resetPayMethod(currentPaymentInfo?.paymentData)
              })
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={onSubmit}
          disabled={
            !isValid || (!isPayMethodValid && currentMethod !== 'check')
          }
        >
          Save
        </Button>
      </Box>
    </>
  )
}
