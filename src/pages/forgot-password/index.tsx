// ** React Imports
import { ReactNode, useCallback, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box, { BoxProps } from '@mui/material/Box'

import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks

import MuiCard, { CardProps } from '@mui/material/Card'
// ** Demo Imports

import { useForm } from 'react-hook-form'
import useForgotPasswordSchema from './validation'
import { useMutation } from 'react-query'
import { sendResetEmail } from 'src/apis/user.api'
import { removeCompanyDataFromBrowser, removeUserDataFromBrowser } from 'src/shared/auth/storage'

// Styled Components

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400,
  },
}))

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: 450 },
}))

interface ForgotPasswordProps {
  email: string | null
}

const ForgotPassword = () => {
  // ** Hooks
  const theme = useTheme()

  const forgotPasswordSchema = useForgotPasswordSchema()

  const router = useRouter()

  // ** Vars

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordProps>({
    mode: 'onChange',
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: null },
  })

  const isValid = !watch(['email']).includes(null)

  const sendEmailMutation = useMutation(
    (email: string) => sendResetEmail(email),
    {
      onSuccess: (data, variables) => {
        router.push({
          pathname: '/forgot-password/complete',
          query: { email: variables },
        })
      },
    },
  )

  const onSubmitEmail = useCallback((info: ForgotPasswordProps) => {
    //api
    info.email && sendEmailMutation.mutate(info.email)
  }, [])

  useEffect(() => {
    removeUserDataFromBrowser()
    removeCompanyDataFromBrowser()
  }, [])

  return (
    <Box className='content-center'>
      <Box
        sx={{
          p: 7,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
          <Card
            sx={{
              zIndex: 1,
              backgroundColor: 'transparent',
              boxShadow: 'none',
            }}
          >
            <CardContent
              sx={{ p: theme => `${theme.spacing(15.5, 7, 8)} !important` }}
            >
              <Box sx={{ mb: 6.5 }}>
                <Typography
                  variant='h5'
                  sx={{ mb: 1.5, letterSpacing: '0.18px', fontWeight: 600 }}
                >
                  Forgot Password? 🔒
                </Typography>
                <Typography variant='body2'>
                  Please enter your email address. We&prime;ll send you a
                  password reset email.
                </Typography>
              </Box>
              <form
                noValidate
                autoComplete='off'
                onSubmit={handleSubmit(onSubmitEmail)}
              >
                <TextField
                  autoFocus
                  type='email'
                  label='Email'
                  {...register('email')}
                  sx={{ display: 'flex', mb: 4 }}
                  error={!!errors.email}
                  placeholder='username@example.com'
                  helperText={errors.email?.message}
                />
                <Button
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                  disabled={Object.keys(errors).length !== 0 || !isValid}
                  sx={{ mb: 5.25, textTransform: 'none' }}
                >
                  Send email
                </Button>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    component={Link}
                    href='/login'
                    sx={{
                      display: 'flex',
                      '& svg': { mr: 1.5 },
                      alignItems: 'center',
                      color: 'primary.main',
                      textDecoration: 'none',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon icon='mdi:chevron-left' fontSize='2rem' />
                    <span>Back to sign in</span>
                  </Typography>
                </Box>
              </form>
            </CardContent>
          </Card>
        </BoxWrapper>
      </Box>
    </Box>
  )
}

ForgotPassword.guestGuard = true
ForgotPassword.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

export default ForgotPassword
