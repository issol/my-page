// ** React Imports
import { ReactNode, useEffect, useContext } from 'react'

// ** MUI Components
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import { styled as muiStyled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { useMediaQuery } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'

import isEmpty from 'lodash/isEmpty'

// ** Third Party Imports

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// ** CleaveJS Imports
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import { v4 as uuidv4 } from 'uuid'

// ** Hooks

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useMutation } from 'react-query'

// ** Data
import { countries } from 'src/@fake-db/autocomplete'

// ** Third Party Components
import { useRouter } from 'next/router'
import {
  CountryType,
  ManagerInfo,
  ManagerUserInfoType,
} from 'src/types/sign/personalInfoTypes'
import { managerProfileSchema } from 'src/types/schema/profile.schema'
import { ModalContext } from 'src/context/ModalContext'

import { getUserInfo, updateManagerUserInfo } from 'src/apis/user.api'
import { useAppSelector } from 'src/hooks/useRedux'
import useAuth from '@src/hooks/useAuth'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

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
  timezone: { code: '', label: '', phone: '' },
  mobile: '',
  phone: '',
  fax: '',
}

const PersonalInfoManager = () => {
  const { setModal } = useContext(ModalContext)

  const theme = useTheme()
  const router = useRouter()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

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
    resolver: yupResolver(managerProfileSchema),
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
        router.push('/home')
      },
      onError: () => {
        setModal(
          <Box
            sx={{
              padding: '24px',
              textAlign: 'center',
              background: '#ffffff',
              borderRadius: '14px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <img
                src='/images/icons/project-icons/status-alert-error.png'
                width={60}
                height={60}
                alt='role select error'
              />
              <Typography variant='body2'>
                Something went wrong. Please try again.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={4}>
              <Button variant='contained' onClick={() => setModal(null)}>
                Okay
              </Button>
            </Box>
          </Box>,
        )
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
        telePhone: data.telePhone,
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
                          options={countries as CountryType[]}
                          onChange={(e, v) => field.onChange(v)}
                          disableClearable
                          renderOption={(props, option) => (
                            <Box component='li' {...props} key={uuidv4()}>
                              {option.label} ({option.code}) +{option.phone}
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
                        <TextField
                          autoFocus
                          id='outlined-basic'
                          label='Mobile phone'
                          variant='outlined'
                          value={value}
                          onBlur={onBlur}
                          onChange={e => {
                            if (e.target.value.length > 50) {
                              return
                            }
                            onChange(e)
                          }}
                          inputProps={{ maxLength: 50 }}
                          error={Boolean(errors.mobilePhone)}
                          placeholder={
                            !watch('timezone').phone
                              ? `+ 1) 012 345 6789`
                              : `012 345 6789`
                          }
                          InputProps={{
                            startAdornment: watch('timezone').phone && (
                              <InputAdornment position='start'>
                                {'+' + watch('timezone').phone}
                              </InputAdornment>
                            ),
                          }}
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
                      name='telePhone'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          autoFocus
                          id='outlined-basic'
                          label='Telephone'
                          variant='outlined'
                          value={value}
                          onBlur={onBlur}
                          onChange={e => {
                            if (isInvalidPhoneNumber(e.target.value)) return
                            onChange(e)
                          }}
                          inputProps={{ maxLength: 50 }}
                          error={Boolean(errors.telePhone)}
                          placeholder={
                            !watch('timezone').phone
                              ? `+ 1) 012 345 6789`
                              : `012 345 6789`
                          }
                          InputProps={{
                            startAdornment: watch('timezone').phone && (
                              <InputAdornment position='start'>
                                {'+' + watch('timezone').phone}
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                    {errors.telePhone && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.telePhone.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl sx={{ mb: 2 }} fullWidth>
                    <Controller
                      name='fax'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          autoFocus
                          id='outlined-basic'
                          label='Fax'
                          variant='outlined'
                          value={value}
                          onBlur={onBlur}
                          onChange={e => {
                            if (isInvalidPhoneNumber(e.target.value)) return
                            onChange(e)
                          }}
                          inputProps={{ maxLength: 50 }}
                          error={Boolean(errors.fax)}
                          placeholder={
                            !watch('timezone').phone
                              ? `+ 1) 012 345 6789`
                              : `012 345 6789`
                          }
                          InputProps={{
                            startAdornment: watch('timezone').phone && (
                              <InputAdornment position='start'>
                                {'+' + watch('timezone').phone}
                              </InputAdornment>
                            ),
                          }}
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
