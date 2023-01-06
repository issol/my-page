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
  alignItems: 'column',
  gap: '10px',
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
        <img src='/images/avatars/1.png' aria-disabled alt='' />
        <Typography variant='h3'>
          Your request for signing up to{' '}
          <Typography color='primary'>GloZ</Typography> has been sent.
        </Typography>
        <Typography variant='h3'>
          We'll send you an email when the approval is completed.
        </Typography>
        <Button variant='contained' onClick={onButtonClick}>
          Okay
        </Button>
      </BoxWrapper>
    </Box>
  )
}

FinishSignUpManager.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

FinishSignUpManager.guestGuard = true

export default FinishSignUpManager
