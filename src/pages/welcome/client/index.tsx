// ** React Imports
import { useState, ReactNode, useEffect } from 'react'

// ** Style components
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import { Grid, OutlinedInput } from '@mui/material'
import { Icon } from '@iconify/react'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** layout
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** NextJS
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function ClientInformationHome() {
  const { company } = useAuth()
  const router = useRouter()
  const [businessNumber, setBusinessNumber] = useState<string>('')

  useEffect(() => {
    if (company?.name) {
      router.push('/')
    }
  }, [company])

  //TODO: 백엔드 논의 완료 되면 기능 완성하기
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

ClientInformationHome.acl = {
  subject: 'client',
  action: 'update',
}