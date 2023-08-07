// ** React Imports
import { useState, ReactNode } from 'react'

// ** Style components
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { Grid, List, OutlinedInput } from '@mui/material'
import { Icon } from '@iconify/react'
import styled from 'styled-components'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** layout
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** NextJS
import Link from 'next/link'
import Image from 'next/image'

export default function ClientInformationHome() {
  const [businessNumber, setBusinessNumber] = useState<null | string>(null)

  function handleSearch() {
    //
  }

  return (
    <Box className='content-center'>
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
        <Image
          src='/images/logos/gloz-logo.svg'
          alt='logo'
          width={44}
          height={24}
        />
      </Box>
      <Grid container spacing={6} sx={{ maxWidth: '820px' }}>
        <Grid item xs={12}>
          <Link
            href='/welcome/client/add-new'
            style={{ textDecoration: 'none' }}
          >
            <Box
              display='flex'
              alignItems='center'
              gap='2px'
              justifyContent='end'
            >
              <Typography
                variant='body2'
                sx={{ textDecoration: 'underline', textAlign: 'right' }}
              >
                Register new company
              </Typography>
              <Icon
                icon='basil:arrow-right-outline'
                color='rgba(76, 78, 100, 0.54)'
              />
            </Box>
          </Link>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6'>Search Company</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor='icons-adornment-password'>
              Business registration number
            </InputLabel>
            <OutlinedInput
              label='Business registration number'
              value={businessNumber}
              id='icons-adornment-password'
              onChange={e => setBusinessNumber(e.target.value)}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    onClick={handleSearch}
                    aria-label='Business registration number input'
                  >
                    <Icon fontSize={20} icon='material-symbols:search' />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} display='flex' justifyContent='end'>
          <Button
            variant='contained'
            onClick={handleSearch}
            disabled={!businessNumber?.length}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

ClientInformationHome.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

const StepperImgWrapper = styled.div<{ step: number }>`
  img {
    opacity: ${({ step }) => (step === 1 ? 0.3 : 1)};
  }
`

//TODO: 수정하기
ClientInformationHome.guestGuard = true

// ClientInformationHome.subject = {
//   subject: '',
//   can: '',
// }
