import { Box, BoxProps, Button, Link, Typography } from '@mui/material'
import FooterIllustrations from '@src/views/pages/misc/FooterIllustrations'
import { NextPage } from 'next'
import styled from 'styled-components'

interface Props {
  statusCode?: number
  err: any
}

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

const Error: NextPage<Props> = ({ statusCode, err }) => {
  console.log(err) // {"name":"Internal Server Error.","message":"500 - Internal Server Error.","statusCode":500}
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
          <Typography variant='h1' sx={{ mb: 2.5 }}>
            Oops!
          </Typography>
          <Typography
            variant='h5'
            sx={{ mb: 2.5, fontSize: '1.5rem !important' }}
          >
            Something went wrong
          </Typography>
          <Typography variant='body2'>
            Please wait a few minutes before you try again
          </Typography>
        </BoxWrapper>
        <Img alt='error-illustration' src='/images/pages/401.png' />
        <Button
          href='/'
          component={Link}
          variant='contained'
          sx={{ px: 5.5 }}
          onClick={() => {
            window.location.href = '/'
          }}
        >
          Back to Home
        </Button>
      </Box>
      <FooterIllustrations image='/images/pages/cute-plumber.png' />
    </Box>
  )
}

Error.getInitialProps = ({ res, err }: any) => {
  console.log(err?.message) // 500 - Internal Server Error. (client-side); Test error (server-side)
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode, err }
}

export default Error
