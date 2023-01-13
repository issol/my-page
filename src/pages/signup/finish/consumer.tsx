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

const FinishSignUpConsumer = () => {
  const router = useRouter()
  function onButtonClick() {
    // router.push('')
    // ** 레리엘 수정
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
          <img
            src='/images/signup/signup-complete-consumer.png'
            aria-hidden
            alt=''
            width={248}
            height={189}
          />
          <Typography variant='h6'>Welcome to Enough!</Typography>
          <Typography variant='body2'>
            Let's move to the next step to fill out more information about you!
          </Typography>
          <Button
            variant='contained'
            fullWidth
            sx={{ marginTop: '20px' }}
            onClick={onButtonClick}
          >
            Go to fill out info &rarr;
          </Button>
        </Box>
      </BoxWrapper>
    </Box>
  )
}

FinishSignUpConsumer.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

FinishSignUpConsumer.guestGuard = true

export default FinishSignUpConsumer