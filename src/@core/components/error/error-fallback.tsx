import { Box, BoxProps, Button, Link, Typography } from '@mui/material'
import FooterIllustrations from '@src/views/pages/misc/FooterIllustrations'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'

type Props = {
  resetErrorBoundary: (...args: any[]) => void
}

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  marginBottom: theme.spacing(15),
  [theme.breakpoints.down('md')]: {
    width: '90vw',
  },
}))

const Img = styled('img')(({ theme }) => ({
  marginTop: theme.spacing(15),
  marginBottom: theme.spacing(15),
  borderRadius: '45%',
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10),
  },
  [theme.breakpoints.down('md')]: {
    height: 400,
  },
}))
export default function ErrorFallback({ resetErrorBoundary }: Props) {
  return (
    <Box
      // className='content-center'
      sx={{ height: '100vh' }}
    >
      <Box
        sx={{
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '100vh',
          justifyContent: 'center',
        }}
      >
        <Img alt='error-illustration' src='/images/pages/cute-plumber.png' />
        <BoxWrapper>
          <Typography variant='h4' sx={{ mb: 2.5 }}>
            Oops! Something went wrong
          </Typography>
          <Typography variant='body2' fontSize={20}>
            Please wait a few minutes before you try again
          </Typography>
        </BoxWrapper>

        <Button
          href='/'
          component={Link}
          variant='contained'
          sx={{ px: 5.5 }}
          size='large'
          color='secondary'
          onClick={() => {
            resetErrorBoundary()
            window.location.href = '/'
          }}
        >
          Back to home
        </Button>
      </Box>
      {/* <FooterIllustrations image='/images/pages/cute-plumber.png' /> */}
    </Box>
  )
}
