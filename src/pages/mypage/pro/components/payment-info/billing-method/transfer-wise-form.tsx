import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Grid, TextField, Typography } from '@mui/material'
import { renderErrorMsg } from '@src/@core/components/error/form-error-renderer'
import {
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

  return (
    <Grid container spacing={6} mt='4px'>
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
        <div {...getRootProps({ className: 'dropzone' })}>
          <Button variant='outlined' fullWidth>
            <input {...getInputProps()} />
            Upload files
          </Button>
        </div>
      </Grid>
    </Grid>
  )
}
