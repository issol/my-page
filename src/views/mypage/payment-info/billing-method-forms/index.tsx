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
import {
  PositionType,
  ProPaymentFormType,
  ProPaymentInfoType,
} from '@src/apis/payment-info.api'

interface BillingMethodProps {
  isRegister: boolean
  paymentInfo: ProPaymentInfoType | null
  changeBillingMethod: boolean
  checkBillingMethodChange: (v: ProPaymentType) => void
  billingMethodData: ProPaymentFormType | null
  billingMethod: ProPaymentType | null
  setBillingMethod: (v: ProPaymentType | null) => void
  setEdit: (v: boolean) => void
  setChangeBillingMethod: (v: boolean) => void
  onBillingMethodSave: (n: ProPaymentFormType) => void
}

const BillingMethod = ({
  isRegister,
  changeBillingMethod,
  checkBillingMethodChange,
  billingMethodData,
  billingMethod,
  setBillingMethod,
  setEdit,
  setChangeBillingMethod,
  onBillingMethodSave,
}: BillingMethodProps) => {
  const { openModal, closeModal } = useModal()

  const [isSolo, setIsSolo] = useState(false)
  const [haveCorrespondentBank, setHaveCorrespondentBank] = useState(
    billingMethodData?.correspondentBankInfo !== null,
  )

  const renderLabel = (label: string) => {
    const regex = /^(.+?)(\(.+?\))$/
    const match = label.match(regex)

    if (!match) {
      return <Typography>{label}</Typography>
    }

    const title = match[1].trim()
    const subtitle = match[2].trim().slice(1, -1)

    return (
      <Box display='flex' flexDirection='column' gap='8px'>
        <Typography variant='body1' sx={{ whiteSpace: 'nowrap' }}>
          {title}
        </Typography>
        <Typography
          variant='body1'
          color='#4C4E6499'
          sx={{ whiteSpace: 'nowrap' }}
        >
          ({subtitle})
        </Typography>
        {label.includes('국내계좌이체') &&
        billingMethod === 'koreaDomesticTransfer' ? (
          <FormControlLabel
            control={
              <Switch
                size='small'
                checked={isSolo}
                onChange={e => setIsSolo(e.target.checked)}
              />
            }
            label={
              <Typography sx={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
                I’m a Solo proprietor
              </Typography>
            }
          />
        ) : null}
      </Box>
    )
  }

  const {
    control,
    getValues,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<BillingMethodUnionType>({
    mode: 'onChange',
    defaultValues: {
      ...billingMethodInitialData(billingMethod, isSolo),
      type: billingMethod,
    },
    resolver: yupResolver(getBillingMethodSchema(billingMethod, isSolo)),
  })

  const {
    control: bankInfoControl,
    getValues: getBankInfo,
    reset: resetBankInfo,
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
    reset: resetCorrBankInfo,
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

  useEffect(() => {
    if (!billingMethodData?.billingMethod) {
      if (billingMethod === getValues('type') && !!billingMethodData) {
        reset({ ...billingMethodData.bankInfo, type: billingMethod })
      } else {
        reset({
          ...billingMethodInitialData(billingMethod, isSolo),
          type: billingMethod,
        })
      }
    } else {
      reset({ ...billingMethodData.billingMethod, type: billingMethod })
      resetBankInfo({
        ...billingMethodData.bankInfo,
      })
      if (billingMethodData.correspondentBankInfo)
        resetCorrBankInfo({
          ...billingMethodData.correspondentBankInfo,
        })
    }
  }, [billingMethod, isSolo, billingMethodData])

  const onBillingMethodSaveClick = () => {
    openModal({
      type: 'save',
      children: (
        <SaveModal
          open={true}
          onSave={() => {
            closeModal('save')
            onBillingMethodSave({
              billingMethod: getValues(),
              bankInfo: getBankInfo(),
              correspondentBankInfo: getCorrBankInfo(),
            })
            setEdit(false)
          }}
          onClose={() => closeModal('save')}
        />
      ),
    })
  }

  const onCancel = () => {
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

  const renderForm = () => {
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
              <FormControlLabel
                label='I have correspondent bank'
                control={
                  <Checkbox
                    checked={haveCorrespondentBank}
                    onChange={e => setHaveCorrespondentBank(e.target.checked)}
                  />
                }
              />
            </Grid>
            {haveCorrespondentBank ? (
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
          <CustomRadio
            key={method.value}
            sx={{
              height:
                billingMethod === 'koreaDomesticTransfer' ? '125px' : '93px',
            }}
          >
            <Radio
              size='small'
              sx={{ height: '24px' }}
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
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: 11px 20px 20px 11px;
  border-radius: 10px;
  border: 1px solid rgba(76, 78, 100, 0.22);
`

export default BillingMethod
