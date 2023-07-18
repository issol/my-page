import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { renderErrorMsg } from '@src/@core/components/error/form-error-renderer'
import {
  BankInfo,
  CorrespondentBankInfo,
  ProPaymentType,
  TransferWiseFormType,
} from '@src/types/payment-info/pro/billing-method.type'
import {
  transferWiseDefaultValue,
  transferWiseSchema,
} from '@src/types/schema/payment-method/pro/transfer-wise.schema'
import { Controller, useForm } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { useState } from 'react'
import useModal from '@src/hooks/useModal'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import { byteToMB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import { Icon } from '@iconify/react'
import { numberRegex, numberSpecialCharRegex } from '@src/shared/regex'
import {
  bankInfoDefaultValue,
  bankInfoSchema,
  corrBankInfoDefaultValue,
  corrBankInfoSchema,
} from '@src/types/schema/payment-method/pro/bank-info.schema'
import BankInfoForm from './bank-info-form'
import CorresPondentBankInfoForm from './correspondent-bank-info-form'

type Props = {
  billingMethod: ProPaymentType
}

export default function TransferWiseForm({ billingMethod }: Props) {
  const MAXIMUM_FILE_SIZE = FILE_SIZE.DEFAULT
  const { openModal, closeModal } = useModal()

  const [fileSize, setFileSize] = useState(0)

  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<TransferWiseFormType>({
    mode: 'onChange',
    defaultValues: { ...transferWiseDefaultValue, billingMethod },
    resolver: yupResolver(transferWiseSchema),
  })
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

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: MAXIMUM_FILE_SIZE,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
    onDrop: (file: File[]) => {
      console.log('acc', file)
      if (file?.length) {
        setFileSize(file[0].size)
        setValue('copyOfId', file[0], {
          shouldDirty: true,
          shouldValidate: true,
        })
      }
    },
    onDropRejected: () => {
      openModal({
        type: 'rejectDrop',
        children: (
          <SimpleAlertModal
            message='The maximum file size you can upload is 50mb.'
            onClose={() => closeModal('rejectDrop')}
          />
        ),
      })
    },
  })

  const copyOfId = getValues('copyOfId')
  const haveCorrBank = watch('haveCorrespondentBank')

  return (
    <Grid container spacing={4} mt='4px'>
      <Grid item xs={12}>
        <Typography fontWeight={600}>Personal ID</Typography>
      </Grid>
      <Grid item xs={12}>
        <Controller
          name='personalId'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange, onBlur } }) => (
            <>
              <TextField
                fullWidth
                autoFocus
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                inputProps={{ maxLength: 50 }}
                error={Boolean(errors.personalId)}
                label='Personal (Social security) ID*'
              />
            </>
          )}
        />
        {renderErrorMsg(errors.personalId)}
      </Grid>
      <Grid item xs={12}>
        <Box
          display='flex'
          gap='20px'
          flexDirection='column'
          padding='24px'
          sx={{ border: '1px dashed #666CFF', borderRadius: '10px' }}
        >
          <Box display='flex' gap='20px'>
            <Box>
              <Typography fontWeight={600}>Copy of ID</Typography>
              <Typography variant='body2'>
                {formatFileSize(fileSize)}/ {byteToMB(MAXIMUM_FILE_SIZE)}
              </Typography>
            </Box>
            <div {...getRootProps({ className: 'dropzone' })}>
              <Button variant='contained' size='small'>
                <input {...getInputProps()} />
                Upload files
              </Button>
            </div>
          </Box>

          {copyOfId ? (
            <Box
              sx={{
                width: '260px',
                padding: '10px 12px',
                background: '#F9F8F9',
                border: '1px solid rgba(76, 78, 100, 0.22)',
                borderRadius: '5px',
                overflow: 'hidden',
              }}
            >
              <Grid container xs={12}>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Icon
                    icon='material-symbols:file-present-outline'
                    style={{ color: 'rgba(76, 78, 100, 0.54)' }}
                  />
                </Grid>
                <Grid item xs={8}>
                  <Box
                    sx={{
                      fontWeight: 600,
                      width: '100%',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {copyOfId.name}
                  </Box>
                  <Typography variant='body2'>
                    {formatFileSize(copyOfId.size)}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    onClick={() =>
                      //@ts-ignore
                      setValue('copyOfId', null, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <Icon icon='mdi:close' fontSize={24} />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ) : (
            ''
          )}

          <Typography variant='body2' fontStyle='italic'>
            Passport, Drivers' license, State-issued ID card
          </Typography>
          {renderErrorMsg(errors.copyOfId)}
        </Box>
      </Grid>
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
            <Typography fontWeight={600}>Correspondent bank info.</Typography>
          </Grid>

          <CorresPondentBankInfoForm
            control={corrBankInfoControl}
            errors={corrBankInfoErrors}
          />
        </>
      ) : null}
      <Grid item xs={12} display='flex' justifyContent='center' gap='16px'>
        <Button variant='outlined' color='secondary'>
          Cancel
        </Button>
        <Button
          variant='contained'
          disabled={!isValid || !isBankInfoValid || !isCorrBankInfoValid}
        >
          Save
        </Button>
      </Grid>
    </Grid>
  )
}
