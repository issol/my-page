// ** React Imports
import { useState, ReactNode, MouseEvent, useEffect } from 'react'

// ** MUI Components
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled as muiStyled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { Checkbox, FormControlLabel } from '@mui/material'

// ** nextJs
import Link from 'next/link'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** fetches
import { login, redirectLinkedInAuth } from 'src/apis/sign.api'
import {
  getRememberMe,
  removeRememberMe,
  saveRememberMe,
  saveUserDataToBrowser,
  saveUserTokenToBrowser,
} from 'src/shared/auth/storage'

// ** values
import { FormErrors } from 'src/shared/const/formErrors'
import GoogleButton from '../components/google-button'
import useAuth from '@src/hooks/useAuth'

const RightWrapper = muiStyled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 500,
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 500,
  },
}))

const BoxWrapper = muiStyled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 500,
  },
}))

const TypographyStyled = muiStyled(Typography)<TypographyProps>(
  ({ theme }) => ({
    fontWeight: 600,
    letterSpacing: '0.18px',
    marginBottom: theme.spacing(1.5),
    [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) },
  }),
)

const schema = yup.object().shape({
  email: yup
    .string()
    .email(FormErrors.invalidEmail)
    .required(FormErrors.required),
  password: yup.string().required(FormErrors.required),
})

const defaultValues = {
  password: '',
  email: '',
}

interface FormData {
  email: string
  password: string
}

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const auth = useAuth()

  const {
    control,
    setError,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (typeof window === 'object') {
      const storedId = getRememberMe()
      if (storedId) {
        setRememberMe(true)
        setValue('email', storedId, { shouldDirty: true, shouldValidate: true })
      }
    }
  }, [])

  const onSubmit = (data: FormData) => {
    const { email, password } = data
    auth.login({ email, password, rememberMe }, () => {
      setError('email', {
        type: 'manual',
        message: '',
      })
      setError('password', {
        type: 'manual',
        message: FormErrors.loginFailed,
      })
    })
  }
  return (
    <Box className='content-center'>
      <RightWrapper>
        <Box
          sx={{
            p: 7,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F7F7F9',
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                top: 30,
                left: 40,
                display: 'flex',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img src='/images/logos/gloz-logo.svg' alt='logo' />
            </Box>
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant='h5'>{`Welcome to ${themeConfig.templateName}! 👋🏻`}</TypographyStyled>
            </Box>
            <Box
              mb={4}
              sx={{
                width: '100%',
                display: 'flex',
                borderRadius: 1,
                cursor: 'pointer',
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                border: theme => `1px solid ${theme.palette.divider}`,
                '& img': {
                  width: '30px',
                  height: '30px',
                  objectFit: 'cover',
                },
              }}
            >
              <IconButton
                href='/'
                component={Link}
                sx={{ color: '#db4437' }}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              >
                <img src='/images/logos/google.png' alt='google sign in' />
              </IconButton>

              <Link href='' style={{ textDecoration: 'none' }}>
                <Typography color='primary'>Sign in with Google</Typography>
              </Link>
              <GoogleButton type='signin' />
            </Box>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                borderRadius: 1,
                cursor: 'pointer',
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                border: theme => `1px solid ${theme.palette.divider}`,
                '& img': {
                  width: '30px',
                  height: '30px',
                  objectFit: 'cover',
                },
              }}
            >
              <IconButton
                href='/'
                component={Link}
                sx={{ color: '#db4437' }}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              >
                <img src='/images/logos/linkedin.png' alt='google sign in' />
              </IconButton>

              <Link
                href=''
                onClick={redirectLinkedInAuth}
                style={{ textDecoration: 'none' }}
              >
                <Typography color='primary'>Sign in with LinkedIn</Typography>
              </Link>
            </Box>
            <button
              type='button'
              onClick={() => {
                throw new Error('Sentry Frontend Error')
              }}
            >
              Throw error
            </button>
            <Divider
              sx={{
                '& .MuiDivider-wrapper': { px: 4 },
                mt: theme => `${theme.spacing(5)} !important`,
                mb: theme => `${theme.spacing(7.5)} !important`,
              }}
            >
              or
            </Divider>
            <form
              noValidate
              autoComplete='off'
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label='Email'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      placeholder='username@example.com'
                    />
                  )}
                />
                {errors.email && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.email.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel
                  htmlFor='auth-login-v2-password'
                  error={Boolean(errors.password)}
                >
                  Password
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label='Password'
                      onChange={onChange}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      // placeholder='Password'
                      type={showPassword ? 'text' : 'password'}
                      inputProps={{ maxLength: 20 }}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon
                              icon={
                                showPassword
                                  ? 'mdi:eye-outline'
                                  : 'mdi:eye-off-outline'
                              }
                              fontSize={20}
                            />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    {errors.password.message}
                  </FormHelperText>
                )}
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        name='rememberMe'
                        checked={rememberMe}
                        onChange={e => {
                          if (!e.target.checked) removeRememberMe()
                          setRememberMe(e.target.checked)
                        }}
                      />
                    }
                    label='Remember me'
                  />
                  <Link
                    href='/forgot-password'
                    style={{ textDecoration: 'none' }}
                  >
                    <Typography color='primary'>Forgot password?</Typography>
                  </Link>
                </Box>
              </FormControl>

              <Button
                fullWidth
                size='large'
                type='submit'
                variant='contained'
                sx={{ mb: 7 }}
                disabled={!isValid}
              >
                Sign in
              </Button>
              <Box
                sx={{
                  mb: 4,
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Typography sx={{ display: 'flex', gap: '4px' }}>
                  New on our platform?{' '}
                </Typography>
                <Link href='/signup' style={{ textDecoration: 'none' }}>
                  <Typography color='primary'>Create an account</Typography>
                </Link>
              </Box>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage

// const GoogleButtonWrapper = styled.div`
//   position: absolute;
//   /* opacity: 0.7; */
//   opacity: 0.0001 !important;
// `
