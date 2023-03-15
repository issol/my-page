// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw',
  },
}))

const Img = styled('img')(({ theme }) => ({
  marginTop: theme.spacing(15),
  marginBottom: theme.spacing(15),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10),
  },
  [theme.breakpoints.down('md')]: {
    height: 400,
  },
}))

const DetailNoUser = () => {
  // const timeout = () => {
  //   setTimeout(() => {
  //     window.location.href = '/onboarding'
  //   }, 5000)
  // }
  // // 컴포넌트가 화면에 다 나타나면 timeout 함수 실행
  // useEffect(() => {
  //   timeout()
  //   return () => {
  //     // clear 해줌
  //     clearTimeout(timeout())
  //   }
  // })
  return (
    <Box className='content-center'>
      <Box
        sx={{
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <BoxWrapper>
          <Typography
            variant='h5'
            sx={{ mb: 2.5, fontSize: '1.5rem !important' }}
          >
            No Pro found. 🧐
          </Typography>
          <Typography variant='body2'>
            We couldn′t find the Pro you are looking for.
          </Typography>
        </BoxWrapper>
        <Img
          height='500'
          alt='under-maintenance-illustration'
          src='/images/pages/misc-under-maintenance.png'
        />
        <Button
          variant='contained'
          sx={{ px: 5.5 }}
          onClick={() => (window.location.href = '/onboarding')}
        >
          Back to Onboarding list
        </Button>
      </Box>
      <FooterIllustrations
        image={`/images/pages/misc-under-maintenance-object.png`}
      />
    </Box>
  )
}

DetailNoUser.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default DetailNoUser
