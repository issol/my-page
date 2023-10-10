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

const BoxWrapper = muiStyled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    maxWidth: 500,
  },
}))

const FinishDeleteAccount = () => {
  const router = useRouter()

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
            src='/images/pages/delete-account.png'
            aria-hidden
            alt=''
            width={248}
            height={189}
          />
          <Typography variant='h6'>
            Your account deletion has been successfully completed.
          </Typography>
          <Typography variant='body2'>
            We look forward to meeting again in the future!
          </Typography>
          <Button
            variant='contained'
            fullWidth
            sx={{ marginTop: '20px' }}
            onClick={() => router.push('/signup')}
          >
            Okay
          </Button>
        </Box>
      </BoxWrapper>
    </Box>
  )
}

FinishDeleteAccount.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

FinishDeleteAccount.guestGuard = true

export default FinishDeleteAccount
