import { Fragment, useEffect, useMemo, useState } from 'react'

// ** style components
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  Switch,
  Typography,
} from '@mui/material'
import styled from 'styled-components'

// ** types & schemas
import {
  BankInfo,
  BillingMethodUnionType,
  CorrespondentBankInfo,
  KoreaDomesticTransferSoloType,
  KoreaDomesticTransferType,
  PayPalType,
  ProPaymentType,
  TransferWiseFormType,
  proPaymentMethodPairs,
} from '@src/types/payment-info/pro/billing-method.type'
import {
  billingMethodInitialData,
  getBillingMethodSchema,
} from '@src/types/schema/payment-method/pro'
import {
  bankInfoDefaultValue,
  bankInfoSchema,
  corrBankInfoDefaultValue,
  corrBankInfoSchema,
} from '@src/types/schema/payment-method/pro/bank-info.schema'

// ** components
import TransferWiseForm from './transfer-wise-form'
import PaypalForm from './paypal-form'
import CorresPondentBankInfoForm from './correspondent-bank-info-form'
import BankInfoForm from './bank-info-form'
import SaveModal from '@src/pages/company/components/price/price-units/modal/save-modal'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'

// ** react hook form
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
  useForm,
} from 'react-hook-form'

// ** third parties
import { yupResolver } from '@hookform/resolvers/yup'

// ** hooks
import useModal from '@src/hooks/useModal'
import KoreaDomesticForm from './korea-domestic-form'
import KoreaDomesticSoloForm from './korea-domestic-solo-form'

type Props = {
  isRegister: boolean
  changeBillingMethod: boolean
  checkBillingMethodChange: (v: ProPaymentType) => void
  billingMethodData: any
  billingMethod: ProPaymentType | null
  setBillingMethod: (v: ProPaymentType | null) => void
  setEdit: (v: boolean) => void
  setChangeBillingMethod: (v: boolean) => void
  onBillingMethodSave: (n: any) => void
}
export default function BillingMethod({
  isRegister,
  changeBillingMethod,
  checkBillingMethodChange,
  billingMethodData,
  billingMethod,
  setBillingMethod,
  setEdit,
  setChangeBillingMethod,
  onBillingMethodSave,
}: Props) {
  const { openModal, closeModal } = useModal()

  const [isSolo, setIsSolo] = useState(false)

  function renderLabel(label: string) {
    const regex = /^(.+?)(\(.+?\))$/
    const match = label.match(regex)

    if (match) {
      const title = match[1].trim()
      const subtitle = match[2].trim().slice(1, -1)

      return (
        <Box display='flex' flexDirection='column'>
          <Typography>{title}</Typography>
          <Typography variant='body2'>({subtitle})</Typography>
          {label.includes('국내계좌이체') ? (
            <FormControlLabel
              control={
                <Switch
                  checked={isSolo}
                  onChange={e => setIsSolo(e.target.checked)}
                />
              }
              label='I’m a Solo proprietor'
            />
          ) : null}
        </Box>
      )
    } else {
      return <Typography>{label}</Typography>
    }
  }

  const {
    control,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<BillingMethodUnionType>({
    mode: 'onChange',
    defaultValues: {
      ...billingMethodInitialData(billingMethod, isSolo),
      type: billingMethod,
    },
    resolver: yupResolver(getBillingMethodSchema(billingMethod, isSolo)),
  })

  useEffect(() => {
    if (billingMethod === getValues('type') && !!billingMethodData) {
      reset({ ...billingMethodData })
    } else {
      reset({
        ...billingMethodInitialData(billingMethod, isSolo),
        type: billingMethod,
      })
    }
  }, [billingMethod, isSolo])

  const {
    control: bankInfoControl,
    getValues: getBankInfo,
    setValue: setBankInfo,
    formState: {
      errors: bankInfoErrors,
      isValid: isBankInfoValid,
      isDirty: isBankInfoDirty,
    },
  } = useForm<BankInfo>({
    mode: 'onChange',
    defaultValues: bankInfoDefaultValue,
    resolver: yupResolver(bankInfoSchema),
  })

  const {
    control: corrBankInfoControl,
    getValues: getCorrBankInfo,
    setValue: setCorrBankInfo,
    formState: {
      errors: corrBankInfoErrors,
      isValid: isCorrBankInfoValid,
      isDirty: isCorrBankInfoDirty,
    },
  } = useForm<CorrespondentBankInfo>({
    mode: 'onChange',
    defaultValues: corrBankInfoDefaultValue,
    resolver: yupResolver(corrBankInfoSchema),
  })

  const haveCorrBank = watch('haveCorrespondentBank')

  function onBillingMethodSaveClick() {
    const personalData = getValues()
    const bankInfo = getBankInfo()
    const corrBankInfo = getCorrBankInfo()

    openModal({
      type: 'save',
      children: (
        <SaveModal
          open={true}
          onSave={() => {
            closeModal('save')
            onBillingMethodSave({
              ...personalData,
              bankInfo,
              corrBankInfo,
            })
            setEdit(false)
          }}
          onClose={() => closeModal('save')}
        />
      ),
    })
  }

  function onCancel() {
    openModal({
      type: 'discard',
      children: (
        <DiscardModal
          title='Are you sure you want to discard all changes?'
          onClose={() => closeModal('discard')}
          onClick={() => {
            closeModal('discard')
            setEdit(false)
            setChangeBillingMethod(false)
          }}
        />
      ),
    })
  }

  function renderForm() {
    switch (billingMethod) {
      case 'internationalWire':
      case 'wise':
      case 'us_ach':
        return (
          <Grid container spacing={6} mt='4px'>
            <TransferWiseForm
              control={control as Control<TransferWiseFormType, any>}
              getValues={getValues as UseFormGetValues<TransferWiseFormType>}
              setValue={setValue as UseFormSetValue<TransferWiseFormType>}
              errors={errors as FieldErrors<TransferWiseFormType>}
              watch={watch as UseFormWatch<TransferWiseFormType>}
            />
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {/* Bank info */}
            <Grid item xs={12}>
              <Typography fontWeight={600}>Bank info.</Typography>
            </Grid>
            <BankInfoForm control={bankInfoControl} errors={bankInfoErrors} />
            <Grid item xs={12}>
              <Controller
                name='haveCorrespondentBank'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <FormControlLabel
                    label='I have correspondent bank'
                    control={<Checkbox checked={value} onChange={onChange} />}
                  />
                )}
              />
            </Grid>
            {haveCorrBank ? (
              <>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography fontWeight={600}>
                    Correspondent bank info.
                  </Typography>
                </Grid>

                <CorresPondentBankInfoForm
                  control={corrBankInfoControl}
                  errors={corrBankInfoErrors}
                />
              </>
            ) : null}
            <Grid
              item
              xs={12}
              display='flex'
              justifyContent='center'
              gap='16px'
            >
              <Button variant='outlined' color='secondary' onClick={onCancel}>
                Cancel
              </Button>
              <Button
                variant='contained'
                disabled={!isValid || !isBankInfoValid || !isCorrBankInfoValid}
                onClick={() => onBillingMethodSaveClick()}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        )
      case 'paypal':
        return (
          <Grid container spacing={4} mt='4px'>
            <PaypalForm
              control={control as Control<PayPalType, any>}
              getValues={getValues as UseFormGetValues<PayPalType>}
              setValue={setValue as UseFormSetValue<PayPalType>}
              errors={errors as FieldErrors<PayPalType>}
            />
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid
              item
              xs={12}
              display='flex'
              justifyContent='center'
              gap='16px'
            >
              <Button variant='outlined' color='secondary' onClick={onCancel}>
                Cancel
              </Button>
              <Button
                variant='contained'
                disabled={!isValid}
                onClick={() => onBillingMethodSaveClick()}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        )
      case 'koreaDomesticTransfer':
        if (isSolo)
          return (
            <Grid container spacing={6} mt='4px'>
              <KoreaDomesticSoloForm
                control={control as Control<KoreaDomesticTransferSoloType, any>}
                getValues={
                  getValues as UseFormGetValues<KoreaDomesticTransferSoloType>
                }
                setValue={
                  setValue as UseFormSetValue<KoreaDomesticTransferSoloType>
                }
                errors={errors as FieldErrors<KoreaDomesticTransferSoloType>}
              />
              <Grid item xs={12}>
                <Divider />
              </Grid>
              {/* Bank info */}
              <Grid item xs={12}>
                <Typography fontWeight={600}>Bank info.</Typography>
              </Grid>
              <BankInfoForm control={bankInfoControl} errors={bankInfoErrors} />

              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight={600}>
                  Correspondent bank info.
                </Typography>
              </Grid>

              <CorresPondentBankInfoForm
                control={corrBankInfoControl}
                errors={corrBankInfoErrors}
              />
              <Grid
                item
                xs={12}
                display='flex'
                justifyContent='center'
                gap='16px'
              >
                <Button variant='outlined' color='secondary' onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  disabled={
                    !isValid || !isBankInfoValid || !isCorrBankInfoValid
                  }
                  onClick={() => onBillingMethodSaveClick()}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          )
        return (
          <Grid container spacing={6} mt='4px'>
            <KoreaDomesticForm
              control={control as Control<KoreaDomesticTransferType, any>}
              getValues={
                getValues as UseFormGetValues<KoreaDomesticTransferType>
              }
              setValue={setValue as UseFormSetValue<KoreaDomesticTransferType>}
              errors={errors as FieldErrors<KoreaDomesticTransferType>}
            />
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {/* Bank info */}
            <Grid item xs={12}>
              <Typography fontWeight={600}>Bank info.</Typography>
            </Grid>
            <BankInfoForm control={bankInfoControl} errors={bankInfoErrors} />

            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography fontWeight={600}>Correspondent bank info.</Typography>
            </Grid>

            <CorresPondentBankInfoForm
              control={corrBankInfoControl}
              errors={corrBankInfoErrors}
            />
            <Grid
              item
              xs={12}
              display='flex'
              justifyContent='center'
              gap='16px'
            >
              <Button variant='outlined' color='secondary' onClick={onCancel}>
                Cancel
              </Button>
              <Button
                variant='contained'
                disabled={!isValid || !isBankInfoValid || !isCorrBankInfoValid}
                onClick={() => onBillingMethodSaveClick()}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        )
      default:
        return null
    }
  }

  return (
    <Fragment>
      <Box display='flex' gap='20px' mb={6}>
        {proPaymentMethodPairs.map(method => (
          <CustomRadio key={method.value}>
            <Radio
              disabled={!isRegister && !changeBillingMethod}
              value={method.value}
              onChange={e => {
                if (!changeBillingMethod) {
                  setBillingMethod(e.target.value as ProPaymentType)
                } else {
                  checkBillingMethodChange(e.target.value as ProPaymentType)
                }
              }}
              checked={method.value === billingMethod}
            />
            {renderLabel(method.label)}
          </CustomRadio>
        ))}
      </Box>
      <Divider />
      {renderForm()}
    </Fragment>
  )
}

const CustomRadio = styled(Box)`
  width: 100%;
  display: flex;
  align-items: flex-start;
  padding: 20px;
  padding-left: 5px;
  border-radius: 10px;
  border: 1px solid rgba(76, 78, 100, 0.22);
`
