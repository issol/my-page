import { useRouter } from 'next/router'
import { ReactNode } from 'react'

import BlankLayout from '@src/@core/layouts/BlankLayout'

import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import Link from 'next/link'
import themeConfig from '@src/configs/themeConfig'

import RightIllustration from './right-illustration'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { sendResetEmail } from '@src/apis/user.api'

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400,
  },
}))

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: 450 },
}))

const MaskImg = styled('img')(({ theme }) => ({
  zIndex: -1,

  width: '208px',
}))

const ForgotPasswordComplete = () => {
  const router = useRouter()
  const email =
    typeof window === 'object' &&
    new URL(window.location.href).searchParams.get('email')

  const theme = useTheme()

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

  const resendEmail = () => {
    //** TODO : email 재전송 api 붙이기
    email &&
      sendEmailMutation.mutate(email, {
        onSuccess: () => {
          toast.success('Email has been sent', {
            position: 'bottom-left',
          })
        },
      })
  }
  return (
    <>
      <Box className='content-center' sx={{ position: 'relative' }}>
        <Box
          sx={{
            mb: 8,
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
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <CardContent
                sx={{
                  p: theme => `${theme.spacing(15.5, 7, 9)} !important`,
                  textAlign: 'center',
                }}
              >
                <MaskImg src='/images/icons/auth-icons/email-sent-icon.png' />
                <Box sx={{ mb: 8 }}>
                  <Typography variant='h5' sx={{ mb: 2 }}>
                    Email has been sent
                  </Typography>
                  <Typography
                    variant='subtitle1'
                    sx={{ color: 'text.secondary' }}
                  >
                    We have sent you an email to reset your password.
                    <br />
                    Please check the inbox of this email.
                  </Typography>
                  <Typography
                    variant='subtitle1'
                    sx={{ mb: 2, color: theme.palette.primary.main }}
                  >
                    {router?.query?.email || ''}
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant='contained'
                  sx={{ textTransform: 'none' }}
                  onClick={() => router.push('/login')}
                >
                  Move to sign in
                </Button>
                <Box
                  sx={{
                    mt: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                  }}
                >
                  <Typography
                    variant='subtitle1'
                    sx={{ color: 'text.secondary' }}
                  >
                    Didn't get the email?
                  </Typography>
                  <Typography
                    variant='subtitle1'
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                    onClick={() => resendEmail()}
                  >
                    Resend
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </BoxWrapper>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RightIllustration top={53} />
          </Box>
        </Box>
      </Box>
    </>
  )
}

ForgotPasswordComplete.guestGuard = true
ForgotPasswordComplete.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

export default ForgotPasswordComplete
