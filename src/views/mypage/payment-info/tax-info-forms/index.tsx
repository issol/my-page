import { Icon } from '@iconify/react'
// ** MUI Imports
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import ButtonGroup from '@mui/material/ButtonGroup'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { renderErrorMsg } from '@src/@core/components/error/form-error-renderer'
import useModal from '@src/hooks/useModal'
import SimpleAlertModal from 'src/pages/[companyName]/client/components/modals/simple-alert-modal'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { TextRatePair } from '@src/shared/const/tax/tax-info'
import { byteToMB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import { ProPaymentType } from '@src/types/payment-info/pro/billing-method.type'
import { TaxInfoType } from '@src/types/payment-info/pro/tax-info.type'
import { Fragment, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form'

type Props = {
  isRegister: boolean
  billingMethod: ProPaymentType | null
  control: Control<TaxInfoType, any>
  getValues: UseFormGetValues<TaxInfoType>
  setValue: UseFormSetValue<TaxInfoType>
  errors: FieldErrors<TaxInfoType>
}

export default function TaxInfoForm({
  isRegister,
  billingMethod,
  control,
  getValues,
  setValue,
  errors,
}: Props) {
  const taxInfoList =
    billingMethod === 'koreaDomesticTransfer'
      ? TextRatePair.filter(i => i.label.includes('Korea'))
      : TextRatePair

  const options = [
    {
      label: 'W8 BEN - non-US person',
      value:
        'https://www.esigngenie.com/esign/onlineforms/fillOnlineForm?encformnumber=%2FggxC95RB21MEpkSPYWIPw%3D%3D&type=link)',
    },
    {
      label: 'W9 - US person',
      value:
        'https://www.esigngenie.com/esign/onlineforms/fillOnlineForm?encformnumber=fyrdwu%2BtT%2FMvBQ3GRttjqw%3D%3D&type=link',
    },
    {
      label: 'W8 BEN E- non-US Entities',
      value:
        'https://na1.foxitesign.foxit.com/onlineforms/fillOnlineForm?encformnumber=X%2BB5U2jKMA%2FvRll14gHQjw%3D%3D&type=link',
    },
  ]
  const anchorRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState<boolean>(false)

  const handleMenuItemClick = (item: { label: string; value: string }) => {
    window.open(item.value, 'blank')
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const MAXIMUM_FILE_SIZE = FILE_SIZE.DEFAULT
  const { openModal, closeModal } = useModal()

  const [fileSize, setFileSize] = useState(0)

  const businessLicense = getValues('businessLicense')

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: MAXIMUM_FILE_SIZE,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
    onDrop: (file: File[]) => {
      // console.log('acc', file)
      if (file?.length) {
        setFileSize(file[0].size)
        setValue('businessLicense', file[0], {
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
    <>
      <Grid item xs={6}>
        <Controller
          name='taxInfo'
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              fullWidth
              disabled={!isRegister}
              onChange={(_, item) => {
                onChange(item?.label ?? '')
                setValue('tax', item?.value ?? null, { shouldValidate: true })
              }}
              //@ts-ignore
              value={
                taxInfoList.find(i => i.label === value) || {
                  value: null,
                  label: '',
                }
              }
              options={taxInfoList}
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField
                  {...params}
                  autoComplete='off'
                  error={Boolean(errors.taxInfo)}
                  label='Tax info.'
                />
              )}
            />
          )}
        />
        {renderErrorMsg(errors.taxInfo)}
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          autoComplete='off'
          disabled
          value={getValues('tax') ? `${getValues('tax')}%` : '-'}
          label='Tax rate'
        />
      </Grid>

      {!billingMethod || billingMethod === 'koreaDomesticTransfer' ? null : (
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
                  W8 / W9 / Business license (CA)*
                </Typography>
                <Typography variant='body2'>
                  {formatFileSize(fileSize)}/ {byteToMB(MAXIMUM_FILE_SIZE)}
                </Typography>
              </Box>
              <Fragment>
                <ButtonGroup
                  variant='outlined'
                  ref={anchorRef}
                  aria-label='go to forms'
                  sx={{ height: '30px' }}
                >
                  <Button size='small'>Go to forms</Button>
                  <Button sx={{ px: '0' }} onClick={handleToggle}>
                    <Icon icon='mdi:menu-down' />
                  </Button>
                </ButtonGroup>
                <Popper
                  open={open}
                  anchorEl={anchorRef.current}
                  role={undefined}
                  transition
                >
                  {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                      <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList id='split-button-menu'>
                            {options.map((option, index) => (
                              <MenuItem
                                key={option.label}
                                onClick={() => handleMenuItemClick(option)}
                              >
                                {option.label}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </Fragment>

              <div {...getRootProps({ className: 'dropzone' })}>
                <Button variant='contained' size='small'>
                  <input {...getInputProps()} />
                  Upload files
                </Button>
              </div>
            </Box>

            {businessLicense ? (
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
                      {businessLicense.name}
                    </Box>
                    <Typography variant='body2'>
                      {formatFileSize(businessLicense.size)}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      onClick={() =>
                        //@ts-ignore
                        setValue('businessLicense', null, {
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

            {renderErrorMsg(errors.businessLicense)}
          </Box>
        </Grid>
      )}
    </>
  )
}
