// ** React Imports
import { ReactNode, useCallback } from 'react'

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
            <svg
              width={47}
              fill='none'
              height={26}
              viewBox='0 0 268 150'
              xmlns='http://www.w3.org/2000/svg'
            >
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 195.571 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fillOpacity='0.4'
                fill='url(#paint0_linear_7821_79167)'
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 196.084 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(0.865206 0.501417 -0.498585 0.866841 173.147 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fillOpacity='0.4'
                fill='url(#paint1_linear_7821_79167)'
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(0.865206 0.501417 -0.498585 0.866841 71.7728 0)'
              />
              <defs>
                <linearGradient
                  y1='0'
                  x1='25.1443'
                  x2='25.1443'
                  y2='143.953'
                  id='paint0_linear_7821_79167'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop />
                  <stop offset='1' stopOpacity='0' />
                </linearGradient>
                <linearGradient
                  y1='0'
                  x1='25.1443'
                  x2='25.1443'
                  y2='143.953'
                  id='paint1_linear_7821_79167'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop />
                  <stop offset='1' stopOpacity='0' />
                </linearGradient>
              </defs>
            </svg>
            <Typography
              variant='h6'
              sx={{
                ml: 2,
                lineHeight: 1,
                fontWeight: 700,
                fontSize: '1.5rem !important',
              }}
            >
              {themeConfig.templateName}
            </Typography>
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
