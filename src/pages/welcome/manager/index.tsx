// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** MUI Components
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import { styled as muiStyled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'

import Typography, { TypographyProps } from '@mui/material/Typography'
import { useMediaQuery } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'

// ** Third Party Imports
import { Controller, Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// ** CleaveJS Imports

import 'cleave.js/dist/addons/cleave-phone.us'
import { v4 as uuidv4 } from 'uuid'

// ** Hooks
// ** Layout Import
import BlankLayout from '@src/@core/layouts/BlankLayout'
import { useMutation } from 'react-query'

// ** Data
// ** Third Party Components
import { useRouter } from 'next/router'
import {
  CountryType,
  ManagerInfo,
  ManagerUserInfoType,
} from 'src/types/sign/personalInfoTypes'
import { managerProfileSchema } from 'src/types/schema/profile.schema'

import { updateManagerUserInfo } from 'src/apis/user.api'

import useAuth from '@src/hooks/useAuth'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import MuiPhone from '@src/pages/components/phone/mui-phone'
import { timezoneSelector } from '@src/states/permission'
import useModal from '@src/hooks/useModal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'

const RightWrapper = muiStyled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  backgroundColor: '#ffffff',
}))
const BoxWrapper = muiStyled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
}))

const TypographyStyled = muiStyled(Typography)<TypographyProps>(
  ({ theme }) => ({
    fontWeight: 600,
    letterSpacing: '0.18px',
    marginBottom: theme.spacing(1.5),
    [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) },
  }),
)

const Illustration = muiStyled('img')(({ theme }) => ({
  maxWidth: '10rem',

  [theme.breakpoints.down('xl')]: {
    maxWidth: '10rem',
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '8rem',
  },
}))

const defaultValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  jonTitle: '',
  timezone: { code: '', label: '' },
  mobile: '',
  phone: '',
  fax: '',
}

const PersonalInfoManager = () => {
  const theme = useTheme()
  const router = useRouter()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const { openModal, closeModal } = useModal()

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

  // ** Hooks
  const auth = useRecoilValueLoadable(authState)
  const setAuth = useAuth()

  function isInvalidPhoneNumber(str: string) {
    const regex = /^[0-9]+$/
    return str && !regex.test(str)
  }

  useEffect(() => {
    if (
      auth.state === 'hasValue' &&
      auth.getValue() &&
      auth.getValue().user?.firstName
    ) {
      router.replace(`/`)
    }
  }, [auth])

  const {
    control,
    handleSubmit,
    getValues,
    watch,
    formState: { errors, isValid },
  } = useForm<ManagerInfo>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(managerProfileSchema) as Resolver<ManagerInfo>,
  })

  /* TODO: 추후 company에 들어갈 값은 동적으로 사용자가 입력 가능하게 기획 수정되어야 함 */
  const updateUserInfoMutation = useMutation(
    (data: ManagerUserInfoType & { userId: number }) =>
      updateManagerUserInfo({ ...data, company: 'GloZ' }),
    {
      onSuccess: () => {
        const { userId, email, accessToken } = router.query
        const accessTokenAsString: string = accessToken as string
        setAuth.updateUserInfo({
          userId: auth.getValue().user!.id,
          email: auth.getValue().user!.email,
          accessToken: accessTokenAsString,
        })
        router.push('/dashboards')
      },
      onError: () => {
        openModal({
          type: 'ErrorModal',
          children: (
            <CustomModal
              title='Something went wrong. Please try again.'
              soloButton
              rightButtonText='Okay'
              onClick={() => closeModal('ErrorModal')}
              onClose={() => closeModal('ErrorModal')}
              vary='error'
            />
          ),
        })
      },
    },
  )

  const onSubmit = (data: ManagerInfo) => {
    const finalData: ManagerUserInfoType & { userId: number } = {
      userId: auth.getValue().user?.id || 0,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      country: data.timezone.label,
      extraData: {
        timezone: data.timezone,
        jobTitle: data.jobTitle,
        mobilePhone: data.mobilePhone,
        telephone: data.telephone,
        fax: data.fax,
      },
    }
    updateUserInfoMutation.mutate(finalData)
  }

  return (
    <Box className='content-right'>
      {!hidden ? (
        <Box
          sx={{
            maxWidth: '30rem',
            padding: '8rem',
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-hidden
        >
          <Illustration
            alt='forgot-password-illustration'
            src={`/images/pages/auth-v2-register-multi-steps-illustration.png`}
          />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: 7,
            display: 'flex',
            alignItems: 'center',
            padding: '50px 50px',
            height: '100%',
            maxWidth: '850px',
            margin: 'auto',
          }}
        >
          <BoxWrapper>
            <Box sx={{ alignItems: 'center' }} mb={6}>
              <TypographyStyled variant='h5'>
                Personal Information
              </TypographyStyled>
              <Typography variant='body2'>
                Please fill in the required information.
              </Typography>
            </Box>

            <form
              noValidate
              autoComplete='off'
              onSubmit={handleSubmit(onSubmit)}
            >
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'space-between',
                  }}
                >
                  <FormControl sx={{ mb: 4 }} fullWidth>
                    <Controller
                      name='firstName'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          autoFocus
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          inputProps={{ maxLength: 50 }}
                          error={Boolean(errors.firstName)}
                          placeholder='First name*'
                        />
                      )}
                    />
                    {errors.firstName && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.firstName.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl sx={{ mb: 4 }} fullWidth>
                    <Controller
                      name='middleName'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          autoFocus
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          inputProps={{ maxLength: 50 }}
                          error={Boolean(errors.middleName)}
                          placeholder='Middle name'
                        />
                      )}
                    />
                    {errors.middleName && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.middleName.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl sx={{ mb: 4 }} fullWidth>
                    <Controller
                      name='lastName'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          autoFocus
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          inputProps={{ maxLength: 50 }}
                          error={Boolean(errors.lastName)}
                          placeholder='Last name*'
                        />
                      )}
                    />
                    {errors.lastName && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.lastName.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Box>
                <FormControl sx={{ mb: 4 }} fullWidth>
                  <Controller
                    name='jobTitle'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        autoFocus
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        inputProps={{ maxLength: 50 }}
                        error={Boolean(errors.jobTitle)}
                        placeholder='Job title'
                      />
                    )}
                  />
                  {errors.jobTitle && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.jobTitle.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <Divider />
                <Box sx={{ display: 'flex', gap: '8px' }} mt={4}>
                  <FormControl sx={{ mb: 2 }} fullWidth>
                    <Controller
                      name='timezone'
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          autoHighlight
                          fullWidth
                          {...field}
                          options={timeZoneList as CountryType[]}
                          onChange={(e, v) => field.onChange(v)}
                          disableClearable
                          renderOption={(props, option) => (
                            <Box component='li' {...props} key={uuidv4()}>
                              {timeZoneFormatter(option, timezone.getValue())}
                            </Box>
                          )}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='Time zone*'
                              error={Boolean(errors.timezone)}
                              inputProps={{
                                ...params.inputProps,
                              }}
                            />
                          )}
                          getOptionLabel={option =>
                            timeZoneFormatter(option, timezone.getValue()) ?? ''
                          }
                        />
                      )}
                    />
                    {errors.timezone && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.timezone.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl sx={{ mb: 4 }} fullWidth>
                    <Controller
                      name='mobilePhone'
                      control={control}
                      rules={{ required: false }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <MuiPhone
                          value={value || ''}
                          onChange={onChange}
                          label={'Mobile phone'}
                        />
                      )}
                    />
                    {errors.mobilePhone && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.mobilePhone.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Box>
                {/* phone  */}
                <Box sx={{ display: 'flex', gap: '8px' }}>
                  <FormControl sx={{ mb: 2 }} fullWidth>
                    <Controller
                      name='telephone'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <MuiPhone
                          value={value || ''}
                          onChange={onChange}
                          label={'Telephone'}
                        />
                      )}
                    />
                    {errors.telephone && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.telephone.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl sx={{ mb: 2 }} fullWidth>
                    <Controller
                      name='fax'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <MuiPhone
                          value={value || ''}
                          onChange={onChange}
                          label={'Fax'}
                        />
                      )}
                    />
                    {errors.fax && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.fax.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={4}>
                <Button
                  size='large'
                  type='submit'
                  variant='contained'
                  sx={{ mb: 7 }}
                  disabled={!isValid}
                >
                  Get started &rarr;
                </Button>
              </Box>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}

PersonalInfoManager.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

PersonalInfoManager.acl = {
  subject: 'personalInfo_manager',
  action: 'update',
}

PersonalInfoManager.guestGuard = false

export default PersonalInfoManager
