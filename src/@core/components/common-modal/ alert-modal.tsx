import { Box, Button, Typography } from '@mui/material'

import AlertIcon from '../alert-icon'

type Props = {
  onClick: any
  title: string
  subtitle?: string
  vary: 'error' | 'info' | 'error-report' | 'progress' | 'successful'
  buttonText: string
}

const AlertModal = ({ onClick, title, subtitle, vary, buttonText }: Props) => {
  return (
    <Box
      sx={{
        maxWidth: '361px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertIcon type={vary} />

          <Typography
            variant='body2'
            textAlign='center'
            mt='10px'
            sx={{ fontSize: '16px' }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant='body2'
              textAlign='center'
              sx={{ fontWeight: 700, fontSize: '16px' }}
            >
              {subtitle}
            </Typography>
          ) : null}
        </Box>

        <Box
          sx={{
            display: 'flex',

            justifyContent: 'center',
            mt: '16px',
          }}
        >
          <Button variant='contained' onClick={onClick}>
            {buttonText}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default AlertModal
