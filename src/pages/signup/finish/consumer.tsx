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

const FinishSignUpConsumer = () => {
  const router = useRouter()
  function onButtonClick() {
    router.push('')
  }

  return (
    <Box className='content-center'>
      <BoxWrapper>
        <img src='/images/avatars/1.png' aria-disabled alt='' />
        <Typography variant='h3'>Welcome to Enough!</Typography>
        <Typography variant='h3'>
          Let's move to the next step to fill out more information about you!
        </Typography>
        <Button variant='contained' onClick={onButtonClick}>
          Go to fill out info &rarr;
        </Button>
      </BoxWrapper>
    </Box>
  )
}

FinishSignUpConsumer.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

FinishSignUpConsumer.guestGuard = true

export default FinishSignUpConsumer
