import { useState } from 'react'

// ** style components
import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { Icon } from '@iconify/react'

// ** components
import { renderErrorMsg } from '@src/@core/components/error/form-error-renderer'
import SimpleAlertModal from 'src/pages/[companyName]/client/components/modals/simple-alert-modal'

// ** type & schema
import { KoreaDomesticTransferSoloType } from '@src/types/payment-info/pro/billing-method.type'

// ** react hook form
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form'

// ** hooks
import { useDropzone } from 'react-dropzone'
import useModal from '@src/hooks/useModal'

// ** helpers & values
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { byteToMB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import { numberSpecialCharRegex } from '@src/shared/regex'

type Props = {
  control: Control<KoreaDomesticTransferSoloType, any>
  getValues: UseFormGetValues<KoreaDomesticTransferSoloType>
  setValue: UseFormSetValue<KoreaDomesticTransferSoloType>
  errors: FieldErrors<KoreaDomesticTransferSoloType>
}

export default function KoreaDomesticSoloForm({
  control,
  getValues,
  setValue,
  errors,
}: Props) {
  const MAXIMUM_FILE_SIZE = FILE_SIZE.DEFAULT
  const { openModal, closeModal } = useModal()

  const [fileSize, setFileSize] = useState(0)

  const dorpZonOptions = {
    multiple: false,
    maxSize: MAXIMUM_FILE_SIZE,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
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
  }

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    ...dorpZonOptions,
    onDrop: (file: File[]) => {
      if (file?.length) {
        setFileSize(file[0].size)
        setValue('copyOfRrCard', file[0], {
          shouldDirty: true,
          shouldValidate: true,
        })
      }
    },
  })

  const copyOfRrCard = getValues('copyOfRrCard')

  return (
    <>
      <Grid item xs={12}>
        <Typography fontWeight={600}>Sole proprietor info.</Typography>
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='businessName'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange, onBlur } }) => (
            <>
              <TextField
                fullWidth
                autoComplete='off'
                autoFocus
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                inputProps={{ maxLength: 50 }}
                error={Boolean(errors.businessName)}
                label='Business name*'
              />
            </>
          )}
        />
        {renderErrorMsg(errors.businessName)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='businessNumber'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange, onBlur } }) => (
            <>
              <TextField
                fullWidth
                autoComplete='off'
                autoFocus
                value={value}
                onBlur={onBlur}
                onChange={e => {
                  const v = e.target.value
                  if (!numberSpecialCharRegex.test(v) && !!v) return
                  onChange(e)
                }}
                inputProps={{ maxLength: 50 }}
                error={Boolean(errors.businessNumber)}
                label='Business Registration Number*'
              />
            </>
          )}
        />
        {renderErrorMsg(errors.businessNumber)}
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
              <Typography fontWeight={600}>
                Copy of Resident Registration Card*
              </Typography>
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

          {copyOfRrCard ? (
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
                    {copyOfRrCard.name}
                  </Box>
                  <Typography variant='body2'>
                    {formatFileSize(copyOfRrCard.size)}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    onClick={() =>
                      //@ts-ignore
                      setValue('copyOfRrCard', null, {
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

          {renderErrorMsg(errors.copyOfRrCard)}
        </Box>
      </Grid>
    </>
  )
}
