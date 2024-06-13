import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import { countries } from '@src/@fake-db/autocomplete'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { isInvalidPhoneNumber } from '@src/shared/helpers/phone-number.validator'
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import { getTypeList } from '@src/shared/transformer/type.transformer'
import { CompanyInfoFormType, CompanyInfoType } from '@src/types/company/info'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFormWatch,
} from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { IfVoid } from '@reduxjs/toolkit/dist/tsHelpers'
import { useDropzone } from 'react-dropzone'
import { TroubleshootRounded } from '@mui/icons-material'

import useModal from '@src/hooks/useModal'
import SimpleAlertModal from 'src/pages/[companyName]/client/components/modals/simple-alert-modal'

import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { byteToMB } from '@src/shared/helpers/file-size.helper'

import MuiPhone from 'src/pages/[companyName]/components/phone/mui-phone'
import {
  contryCodeAndPhoneNumberFormatter,
  splitContryCodeAndPhoneNumber,
} from '@src/shared/helpers/phone-number-helper'
import { useRecoilValueLoadable } from 'recoil'
import { timezoneSelector } from '@src/states/permission'

type Props = {
  companyInfo: CompanyInfoType
  edit: boolean
  setEdit: Dispatch<SetStateAction<boolean>>
  control: Control<
    Omit<CompanyInfoFormType, 'billingPlan' | 'logo' | 'address'>,
    any
  >
  ceoFields: FieldArrayWithId<
    Omit<CompanyInfoFormType, 'billingPlan' | 'logo'>,
    'ceo',
    'id'
  >[]
  watch: UseFormWatch<
    Omit<CompanyInfoFormType, 'billingPlan' | 'logo' | 'address'>
  >
  onClickCancel: (type: 'info' | 'address') => void
  onClickSave: (type: 'info' | 'address') => void
  onClickAddCeo: () => void
  onClickDeleteCeo: (id: string) => void
  onClickUploadLogo: (file: File | null) => void
  isValid: boolean
  isUpdatable: boolean
  companyLogoURL: string
}

const CompanyInfoOverview = ({
  companyInfo,
  edit,
  setEdit,
  control,
  ceoFields,
  watch,
  onClickCancel,
  onClickSave,
  onClickAddCeo,
  onClickDeleteCeo,
  onClickUploadLogo,
  isValid,
  isUpdatable,
  companyLogoURL,
}: Props) => {
  const { openModal, closeModal } = useModal()

  const country = getTypeList('CountryCode')
  const [timeZoneList, setTimeZoneList] = useState<
    {
      code: string
      label: string
      phone: string
    }[]
  >([])

  const timezone = useRecoilValueLoadable(timezoneSelector)

  useEffect(() => {
    const timezoneList = timezone.getValue()
    const filteredTimezone = timezoneList.map(list => {
      return {
        code: list.timezoneCode,
        label: list.timezone,
        phone: '',
      }
    })
    setTimeZoneList(filteredTimezone)
  }, [timezone])

  const setCompanyImage = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const fileData = reader.result
      if (fileData !== null && typeof fileData === 'string') {
        const imgElement = document.getElementById(
          'company-logo',
        ) as HTMLImageElement
        if (imgElement) {
          imgElement.src = fileData
        }
      }
    }
    reader.readAsDataURL(file)
  }

  const onDrop = (selectedFile: File[]) => {
    const uniqueFile = selectedFile[0]
    if (uniqueFile) {
      if (!uniqueFile.type.startsWith('image/')) {
        openModal({
          type: 'FileTypeErrorModal',
          children: (
            <SimpleAlertModal
              message='You can only upload image files.'
              onClose={() => {
                handleDeleteLogo()
                closeModal('FileTypeErrorModal')
              }}
            />
          ),
        })
      } else if (uniqueFile.size > FILE_SIZE.COMPANY_LOGO) {
        openModal({
          type: 'FileSizeErrorModal',
          children: (
            <SimpleAlertModal
              message={`The maximum file size you can upload is ${byteToMB(
                FILE_SIZE.COMPANY_LOGO,
              )}.`}
              onClose={() => {
                handleDeleteLogo()
                closeModal('FileSizeErrorModal')
              }}
            />
          ),
        })
      } else {
        setCompanyImage(uniqueFile)
        onClickUploadLogo(uniqueFile)
      }
    }
  }
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    multiple: false,
    onDrop,
  })

  const onClickDeleteLogo = () => {
    openModal({
      type: 'LogoDeleteModal',
      children: (
        <SimpleAlertModal
          message={`Are you sure you want to delete
            current logo file?`}
          onClose={() => {
            handleDeleteLogo()
            closeModal('LogoDeleteModal')
          }}
        />
      ),
    })
  }

  const handleDeleteLogo = () => {
    const imgElement = document.getElementById(
      'company-logo',
    ) as HTMLImageElement
    if (imgElement) {
      imgElement.src = '/images/company/default-company-logo.svg'
      onClickUploadLogo(null)
    }
  }

  return (
    <Card sx={{ padding: '24px' }}>
      {edit ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Box sx={{ display: 'flex', gap: '24px' }}>
            <Card
              sx={{
                padding: '4px 5px',
                width: '120px',
                height: '120px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: '100px',
                  height: '86.85px',
                  padding: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  id='company-logo'
                  src={companyLogoURL}
                  alt=''
                  style={{
                    width: '80px',
                    // height: '66.85px',
                  }}
                />
              </Box>
            </Card>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',

                gap: '20px',
                width: '100%',

                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <div {...getRootProps()}>
                  <Button variant='contained' sx={{ width: '173px' }}>
                    <input {...getInputProps()} />
                    Upload new photo
                  </Button>
                </div>
                <Button variant='outlined' onClick={onClickDeleteLogo}>
                  Delete
                </Button>
              </Box>
              <Typography variant='body2'>
                Allowed PNG or JPEG. Max size of 800K.
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Box sx={{ width: '100%' }}>
            <Controller
              name='name'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  autoComplete='off'
                  label='Company name*'
                  value={value || ''}
                  onChange={onChange}
                />
              )}
            />
          </Box>
          <Box>
            <Typography variant='h6'>CEO</Typography>
            <Box sx={{ mt: '20px' }}>
              {ceoFields.map((value, idx) => {
                return (
                  <Grid key={uuidv4()} container xs={12} spacing={4} mb='16px'>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant='subtitle1' fontWeight={600}>
                          {(idx + 1).toString().padStart(2, '0')}.
                        </Typography>
                        {ceoFields.length > 1 && (
                          <IconButton
                            onClick={() => onClickDeleteCeo(value.id)}
                          >
                            <Icon icon='mdi:trash-outline' />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Controller
                        name={`ceo.${idx}.firstName`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            fullWidth
                            autoComplete='off'
                            value={value || ''}
                            onChange={onChange}
                            label='First name'
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <Controller
                        name={`ceo.${idx}.middleName`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            fullWidth
                            autoComplete='off'
                            value={value || ''}
                            onChange={onChange}
                            label='Middle name'
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller
                        name={`ceo.${idx}.lastName`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            fullWidth
                            autoComplete='off'
                            value={value || ''}
                            onChange={onChange}
                            label='Last name'
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                )
              })}
              <Button
                variant='contained'
                disabled={ceoFields.length >= 2}
                onClick={onClickAddCeo}
                sx={{ p: 0.7, minWidth: 26 }}
              >
                <Icon icon='material-symbols:add' fontSize={18} />
              </Button>
            </Box>
            <Divider sx={{ mt: '20px !important' }} />
            <Box>
              <Typography variant='h6'>Company details</Typography>
              <Grid container xs={12} mt='20px' spacing={4}>
                <Grid item xs={6}>
                  <Controller
                    name='headquarter'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        autoHighlight
                        fullWidth
                        options={country}
                        onChange={(e, v) => onChange(v)}
                        disableClearable
                        value={
                          !value
                            ? { value: '', label: '' }
                            : country.filter(
                                item => item.value === value.value,
                              )[0]
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            autoComplete='off'
                            label='Headquarter'
                            inputProps={{
                              ...params.inputProps,
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name='timezone'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        fullWidth
                        value={value || { code: '', label: '', phone: '' }}
                        options={timeZoneList as CountryType[]}
                        onChange={(e, v) => {
                          // console.log(value)

                          if (!v) onChange(null)
                          else onChange(v)
                        }}
                        renderOption={(props, option) => (
                          <Box component='li' {...props} key={uuidv4()}>
                            {timeZoneFormatter(option, timezone.getValue())}
                          </Box>
                        )}
                        renderInput={params => (
                          <TextField
                            {...params}
                            autoComplete='off'
                            label='Timezone*'
                            // error={Boolean(errors.dueTimezone)}
                          />
                        )}
                        getOptionLabel={option =>
                          timeZoneFormatter(option, timezone.getValue()) ?? ''
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name='registrationNumber'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        autoComplete='off'
                        value={value || ''}
                        onChange={onChange}
                        label='Company registration number'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name='email'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        autoComplete='off'
                        value={value || ''}
                        onChange={onChange}
                        label='Company e-mail'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name='phone'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <MuiPhone
                        value={value || ''}
                        onChange={onChange}
                        label={'Telephone'}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name='fax'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <MuiPhone
                        value={value || ''}
                        onChange={onChange}
                        label={'Fax'}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                mt: '24px',
              }}
            >
              <Button variant='outlined' onClick={() => onClickCancel('info')}>
                Cancel
              </Button>
              <Button
                variant='contained'
                onClick={() => onClickSave('info')}
                disabled={!isValid}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant='h6'>Company information</Typography>

            {isUpdatable && (
              <IconButton
                onClick={() => setEdit(true)}
                // disabled={invoiceInfo.invoiceStatus === 'Paid'}
              >
                <Icon icon='mdi:pencil-outline' />
              </IconButton>
            )}
          </Box>
          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            mt='20px'
          >
            <Box sx={{ display: 'flex' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <Icon
                  icon='mdi:crown-outline'
                  style={{ opacity: '0.7' }}
                  fontSize={24}
                />
                <Typography variant='subtitle1' fontWeight={600}>
                  CEO:
                </Typography>
                <Typography variant='subtitle2' fontSize={16} fontWeight={400}>
                  {companyInfo.ceo && companyInfo.ceo.length > 0
                    ? companyInfo?.ceo?.map((value, index) => {
                        const lastIndex = companyInfo.ceo!.length - 1
                        return (
                          <>
                            {getLegalName({ ...value })}
                            {lastIndex !== index && ', '}
                          </>
                        )
                      })
                    : '-'}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <Icon
                  icon='pajamas:building'
                  style={{ opacity: '0.7' }}
                  fontSize={24}
                />
                <Typography variant='subtitle1' fontWeight={600}>
                  Headquarter:
                </Typography>
                <Typography variant='subtitle2' fontSize={16}>
                  {companyInfo.headquarter ?? '-'}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <Icon
                  icon='mdi:earth'
                  style={{ opacity: '0.7' }}
                  fontSize={24}
                />
                <Typography variant='subtitle1' fontWeight={600}>
                  Time zone:
                </Typography>
                <Typography variant='subtitle2' fontSize={16} fontWeight={400}>
                  {companyInfo.timezone?.label}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <Icon
                  icon='mdi:playlist-check'
                  style={{ opacity: '0.7' }}
                  fontSize={24}
                />
                <Typography variant='subtitle1' fontWeight={600}>
                  Company registration number:
                </Typography>
                <Typography variant='subtitle2' fontSize={16}>
                  {companyInfo.registrationNumber ?? '-'}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <Icon
                  icon='mdi:email-outline'
                  style={{ opacity: '0.7' }}
                  fontSize={24}
                />
                <Typography variant='subtitle1' fontWeight={600}>
                  Company e-mail:
                </Typography>
                <Typography variant='subtitle2' fontSize={16}>
                  {companyInfo.email ?? '-'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <Icon
                  icon='mdi:phone'
                  style={{ opacity: '0.7' }}
                  fontSize={24}
                />
                <Typography variant='subtitle1' fontWeight={600}>
                  Business number:
                </Typography>
                <Typography variant='subtitle2' fontSize={16}>
                  {!companyInfo.phone
                    ? '-'
                    : contryCodeAndPhoneNumberFormatter(
                        splitContryCodeAndPhoneNumber(companyInfo.phone),
                      )}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <Icon
                  icon='material-symbols:fax-outline-rounded'
                  style={{ opacity: '0.7' }}
                  fontSize={24}
                />
                <Typography variant='subtitle1' fontWeight={600}>
                  Fax:
                </Typography>
                <Typography variant='subtitle2' fontSize={16}>
                  {!companyInfo.fax
                    ? '-'
                    : contryCodeAndPhoneNumberFormatter(
                        splitContryCodeAndPhoneNumber(companyInfo.fax),
                      )}
                </Typography>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Card>
  )
}

export default CompanyInfoOverview