import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import { countries } from '@src/@fake-db/autocomplete'
import { UserDataType } from '@src/context/types'
import { getGmtTime, getGmtTimeEng } from '@src/shared/helpers/timezone.helper'
import { CountryType, ManagerInfo } from '@src/types/sign/personalInfoTypes'
import { Dispatch, SetStateAction } from 'react'
import {
  Control,
  Controller,
  FieldErrors,
  UseFormReset,
  UseFormWatch,
} from 'react-hook-form'
import styled from 'styled-components'

type Props = {
  edit: boolean
  setEdit: Dispatch<SetStateAction<boolean>>
  userInfo: UserDataType
  control: Control<ManagerInfo, any>
  watch: UseFormWatch<ManagerInfo>
  errors: FieldErrors<ManagerInfo>
  isValid: boolean
  reset: UseFormReset<ManagerInfo>
  onClickSave: () => void
  onClickCancel: () => void
}

const Contracts = ({
  edit,
  setEdit,
  userInfo,
  control,
  watch,
  errors,
  isValid,
  reset,
  onClickSave,
  onClickCancel,
}: Props) => {
  function isInvalidPhoneNumber(str: string) {
    const regex = /^[0-9]+$/
    return str && !regex.test(str)
  }
  return (
    <Card sx={{ padding: '24px' }}>
      {edit ? (
        <>
          <Grid container xs={12} spacing={5} mb='20px'>
            <Grid item xs={4}>
              <Controller
                name='firstName'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    value={value || ''}
                    onChange={onChange}
                    InputProps={{
                      inputProps: {
                        maxLength: 50,
                      },
                    }}
                    label='First name*'
                    error={Boolean(errors.firstName)}
                  />
                )}
              />
              {errors.firstName && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.firstName.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={4}>
              <Controller
                name='middleName'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    value={value || ''}
                    onChange={onChange}
                    InputProps={{
                      inputProps: {
                        maxLength: 50,
                      },
                    }}
                    label='Middle name'
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name='lastName'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    value={value || ''}
                    onChange={onChange}
                    InputProps={{
                      inputProps: {
                        maxLength: 50,
                      },
                    }}
                    label='Last name*'
                    error={Boolean(errors.lastName)}
                  />
                )}
              />
              {errors.lastName && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.lastName.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='department'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    value={value || ''}
                    onChange={onChange}
                    InputProps={{
                      inputProps: {
                        maxLength: 50,
                      },
                    }}
                    label='Department'
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='jobTitle'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    value={value || ''}
                    onChange={onChange}
                    InputProps={{
                      inputProps: {
                        maxLength: 50,
                      },
                    }}
                    label='Job title'
                  />
                )}
              />
            </Grid>
          </Grid>
          <Divider />
          <Grid container xs={12} spacing={5} mt='20px'>
            <Grid item xs={12}>
              <Controller
                name='email'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    value={value || ''}
                    onChange={onChange}
                    InputProps={{
                      inputProps: {
                        maxLength: 50,
                      },
                    }}
                    disabled
                    label='Email'
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
                    options={countries as CountryType[]}
                    onChange={(e, v) => {
                      console.log(value)

                      if (!v) onChange(null)
                      else onChange(v)
                    }}
                    renderOption={(props, option) => (
                      <Box component='li' {...props}>
                        {getGmtTimeEng(option.code)}
                      </Box>
                    )}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Timezone*'
                        // error={Boolean(errors.dueTimezone)}
                      />
                    )}
                    getOptionLabel={option =>
                      option.code === '' ? '' : getGmtTimeEng(option.code)
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='mobilePhone'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    value={value || ''}
                    placeholder={
                      watch('timezone') ? `+ 1) 012 345 6789` : `012 345 6789`
                    }
                    onChange={e => {
                      if (isInvalidPhoneNumber(e.target.value)) return
                      onChange(e)
                    }}
                    InputProps={{
                      startAdornment: watch('timezone') &&
                        watch('timezone').phone && (
                          <InputAdornment position='start'>
                            {'+' + watch('timezone').phone}
                          </InputAdornment>
                        ),
                      inputProps: {
                        maxLength: 50,
                      },
                    }}
                    label='Mobile phone'
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='telePhone'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    value={value || ''}
                    placeholder={
                      watch('timezone') ? `+ 1) 012 345 6789` : `012 345 6789`
                    }
                    onChange={e => {
                      if (isInvalidPhoneNumber(e.target.value)) return
                      onChange(e)
                    }}
                    InputProps={{
                      startAdornment: watch('timezone') &&
                        watch('timezone').phone && (
                          <InputAdornment position='start'>
                            {'+' + watch('timezone').phone}
                          </InputAdornment>
                        ),
                      inputProps: {
                        maxLength: 50,
                      },
                    }}
                    label='Telephone'
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='fax'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    value={value || ''}
                    placeholder={
                      watch('timezone') ? `+ 1) 012 345 6789` : `012 345 6789`
                    }
                    onChange={e => {
                      if (isInvalidPhoneNumber(e.target.value)) return
                      onChange(e)
                    }}
                    InputProps={{
                      startAdornment: watch('timezone') &&
                        watch('timezone').phone && (
                          <InputAdornment position='start'>
                            {'+' + watch('timezone').phone}
                          </InputAdornment>
                        ),
                      inputProps: {
                        maxLength: 50,
                      },
                    }}
                    label='Fax'
                  />
                )}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
              mt: '24px',
            }}
          >
            <Button variant='outlined' onClick={onClickCancel}>
              Cancel
            </Button>
            <Button
              variant='contained'
              onClick={onClickSave}
              disabled={!isValid}
            >
              Save
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant='h6'>Contracts</Typography>

            <IconButton
              onClick={() => setEdit!(true)}
              // disabled={invoiceInfo.invoiceStatus === 'Paid'}
            >
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
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
                <Icon icon='mdi:email-outline' style={{ opacity: '0.7' }} />
                <LabelTitle>Email:</LabelTitle>
                <Label>{userInfo.email || '-'}</Label>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <Icon icon='mdi:earth' style={{ opacity: '0.7' }} />
                <LabelTitle>Timezone:</LabelTitle>
                <Label>{getGmtTime(userInfo.timezone?.code) || '-'}</Label>
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
                <Icon icon='mdi:cellphone' style={{ opacity: '0.7' }} />
                <LabelTitle>Mobile phone:</LabelTitle>
                <Label>
                  {!userInfo.mobilePhone
                    ? '-'
                    : '+' +
                      userInfo.timezone.phone +
                      ') ' +
                      userInfo.mobilePhone}
                </Label>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <Icon icon='mdi:phone' style={{ opacity: '0.7' }} />
                <LabelTitle>Telephone:</LabelTitle>
                <Label>
                  {!userInfo.telePhone
                    ? '-'
                    : '+' + userInfo.timezone.phone + ') ' + userInfo.telePhone}
                </Label>
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
                <Icon icon='ic:baseline-home' style={{ opacity: '0.7' }} />
                <LabelTitle>Fax:</LabelTitle>
                <Label>
                  {!userInfo.fax
                    ? '-'
                    : '+' + userInfo.timezone.phone + ') ' + userInfo.fax}
                </Label>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Card>
  )
}

const LabelTitle = styled.label`
  font-weight: 600;
  font-size: 1rem;
  line-height: 24px;
  letter-spacing: 0.15px;

  color: rgba(76, 78, 100, 0.87);
`
const Label = styled.label`
  font-weight: 400;
  font-size: 1rem;
  line-height: 24px;
  letter-spacing: 0.15px;

  color: rgba(76, 78, 100, 0.6);
`

export default Contracts
