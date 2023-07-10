import { Fragment, useEffect, useState } from 'react'

// ** style components
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

// ** type & validation
import {
  AccountMethodFormType,
  BankTransferFormType,
  CreditCardFormType,
  JapanTaxFormType,
  KoreaTaxFormType,
  OfficeType,
  PayPalFormType,
  PaymentMethodPairs,
  PaymentType,
  SingaporeTaxFormType,
  USTaxFormType,
} from '@src/types/payment-info/client/index.type'
import { OfficeTaxType, getTaxInfoSchema } from '@src/types/schema/tax-info'
import {
  PaymentMethodUnionType,
  getPaymentMethodSchema,
} from '@src/types/schema/payment-method'

// ** third parties
import { yupResolver } from '@hookform/resolvers/yup'
import { Control, useForm } from 'react-hook-form'

// ** components
import KoreaTaxForm from '../forms/tax-info/korea-tax-form'
import USTaxForm from '../forms/tax-info/us-tax-form'
import SingaporeTaxForm from '../forms/tax-info/singapore-tax-form'
import JapanTaxForm from '../forms/tax-info/japan-tax-form'
import BankTransferForm from '../forms/payment-method/bank-transfer-form'
import CreditCardForm from '../forms/payment-method/credit-card-form'
import PayPalForm from '../forms/payment-method/paypal-form'
import AccountMethodForm from '../forms/payment-method/account-method-form'

type Props = {
  office: OfficeType
  open: boolean
  onClose: () => void
  onSave: (
    paymentMethod: PaymentType,
    office: OfficeType,
    paymentInfo: PaymentMethodUnionType,
    taxInfo: OfficeTaxType,
  ) => void
}

export default function PaymentMethodForm({
  open,
  office,
  onClose,
  onSave,
}: Props) {
  const methodList = PaymentMethodPairs[office]
  /* TODO: currentMethod의 default value는 받아온 데이터로 하기, 만약 저장된게 없을 경우 아래와 같이 하기 */
  const [currentMethod, setCurrentMethod] = useState<PaymentType>(
    methodList[0].value,
  )

  const {
    control,
    getValues,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<OfficeTaxType>({
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
    mode: 'onChange',
    resolver: yupResolver(getPaymentMethodSchema(currentMethod)),
  })

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

  function onSubmit() {
    const paymentInfo = getPayMethodValues()
    const taxInfo = getValues()
    onSave(currentMethod, office, paymentInfo, taxInfo)
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
            onClick={onSubmit}
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
