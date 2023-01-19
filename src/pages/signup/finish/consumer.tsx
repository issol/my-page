// ** React Imports
import { useState, ReactNode } from 'react'

// ** MUI Components
import Button from '@mui/material/Button'

import Box, { BoxProps } from '@mui/material/Box'

import { styled as muiStyled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

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
  const auth = useAuth()
  const router = useRouter()
  const { email, password } = router.query

  function onButtonClick() {
    if (email && password) {
      auth.login(
        { email: email as string, password: password as string },
        router.push('/welcome/consumer'),
      )
    } else {
      router.push('/login')
    }
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
