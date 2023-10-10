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

import { loginResType } from 'src/types/sign/signInTypes'

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
    router.push('/welcome/client')
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
            Find your company and be a member or register a new company.
          </Typography>
          <Button
            variant='contained'
            fullWidth
            sx={{ marginTop: '20px' }}
            onClick={onButtonClick}
          >
            Find company &rarr;
          </Button>
        </Box>
      </BoxWrapper>
    </Box>
  )
}

FinishSignUpConsumer.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

FinishSignUpConsumer.acl = {
  subject: 'client',
  action: 'read',
}

// FinishSignUpConsumer.guestGuard = true

export default FinishSignUpConsumer
