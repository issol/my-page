// ** React Imports
import { useState, ReactNode } from 'react'

// ** MUI Components
import Button from '@mui/material/Button'

import Box, { BoxProps } from '@mui/material/Box'

import { styled as muiStyled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { Card, CardContent, Link } from '@mui/material'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useRouter } from 'next/router'

const BoxWrapper = muiStyled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    maxWidth: 500,
  },
}))

const FinishSignUpManager = () => {
  const router = useRouter()

  function onButtonClick() {
    router.push('/login')
  }

  return (
    <Box className='content-center'>
      <BoxWrapper>
        <Box
          sx={{
            maxWidth: '340px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'center',
          }}
        >
          {' '}
          <img
            src='/images/signup/signup-complete-manager.png'
            aria-hidden
            alt=''
            width={248}
            height={189}
          />
          <Typography variant='h6'>Your request for signing up to </Typography>
          <Typography
            variant='h6'
            sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Typography color='primary' variant='h6' fontWeight={'bold'}>
              GloZ
            </Typography>{' '}
            has been sent.
          </Typography>
          <Typography variant='body2'>
            We'll send you an email when the approval is completed.
          </Typography>
          <Button
            variant='contained'
            onClick={onButtonClick}
            fullWidth
            sx={{ marginTop: '20px' }}
          >
            Okay
          </Button>
        </Box>
      </BoxWrapper>
    </Box>
  )
}

FinishSignUpManager.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

FinishSignUpManager.guestGuard = true

export default FinishSignUpManager
