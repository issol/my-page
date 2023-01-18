import { useRouter } from 'next/router'
import { ReactNode } from 'react'

import BlankLayout from 'src/@core/layouts/BlankLayout'

import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import Link from 'next/link'
import themeConfig from 'src/configs/themeConfig'
import RightIllustration from 'src/pages/forgot-password/complete/right-illustration'

import toast from 'react-hot-toast'

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

const ResetPasswordComplete = () => {
  const router = useRouter()

  const theme = useTheme()

  const resendEmail = () => {
    //** TODO : email 재전송 api 붙이기
    toast.success('Email has been sent', {
      style: {
        borderRadius: '8px',
        marginTop: '24px',
        height: '49px',
        background: '#333',
        color: '#fff',
      },
      position: 'bottom-left',
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
                <MaskImg src='/images/icons/auth-icons/reset-complete-icon.png' />
                <Box sx={{ mb: 8 }}>
                  <Typography variant='h5' sx={{ mb: 2 }}>
                    Your password was reset successfully
                  </Typography>
                  <Typography
                    variant='subtitle1'
                    sx={{ color: 'text.secondary' }}
                  >
                    Please sign in again.
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
            <RightIllustration
              image={'/images/pages/reset-password-complete.svg'}
              top={62}
            />
          </Box>
        </Box>
      </Box>
    </>
  )
}

ResetPasswordComplete.guestGuard = true
ResetPasswordComplete.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

export default ResetPasswordComplete
