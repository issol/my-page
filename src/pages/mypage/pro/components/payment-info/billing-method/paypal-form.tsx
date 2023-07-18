import { useState } from 'react'

// ** third parties
import { yupResolver } from '@hookform/resolvers/yup'

// ** style components
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { Icon } from '@iconify/react'

// ** components
import { renderErrorMsg } from '@src/@core/components/error/form-error-renderer'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import SaveModal from '@src/pages/company/components/price/price-units/modal/save-modal'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'

// ** type & schemas
import {
  PayPalType,
  ProPaymentType,
} from '@src/types/payment-info/pro/billing-method.type'
import {
  payPalDefaultValue,
  payPalSchema,
} from '@src/types/schema/payment-method/pro/paypal.schema'

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

// ** hooks
import { useDropzone } from 'react-dropzone'
import useModal from '@src/hooks/useModal'

// ** helpers & values
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { byteToMB, formatFileSize } from '@src/shared/helpers/file-size.helper'

type Props = {
  control: Control<PayPalType, any>
  getValues: UseFormGetValues<PayPalType>
  setValue: UseFormSetValue<PayPalType>
  errors: FieldErrors<PayPalType>
}

export default function PaypalForm({
  control,
  getValues,
  setValue,
  errors,
}: Props) {
  const MAXIMUM_FILE_SIZE = FILE_SIZE.DEFAULT
  const { openModal, closeModal } = useModal()

  const [fileSize, setFileSize] = useState(0)

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

  return (
    <>
      <Grid item xs={12}>
        <Typography fontWeight={600}>PayPal email address</Typography>
      </Grid>
      <Grid item xs={12}>
        <Controller
          name='email'
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
                error={Boolean(errors.email)}
                label='Email address*'
              />
            </>
          )}
        />
        {renderErrorMsg(errors.email)}
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
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
    </>
  )
}
