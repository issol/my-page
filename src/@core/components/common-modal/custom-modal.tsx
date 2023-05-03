import { Box, Button, Typography } from '@mui/material'

import AlertIcon from '../alert-icon'

type Props = {
  onClose: any
  onClick: any
  title: string
  vary: 'error' | 'info' | 'error-report' | 'progress' | 'successful'
  leftButtonText?: string
  rightButtonText: string
}

const CustomModal = ({
  onClose,
  onClick,
  title,
  vary,
  leftButtonText,
  rightButtonText,
}: Props) => {
  return (
    <Box
      sx={{
        maxWidth: '361px',
        width: '100%',
        maxHeight: '228px',
        height: '100%',
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

          <Typography variant='body1' textAlign='center' mt='10px'>
            {title}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            mt: '16px',
          }}
        >
          <Button variant='outlined' onClick={onClose}>
            {leftButtonText ?? 'Cancel'}
          </Button>
          <Button variant='contained' onClick={onClick}>
            {rightButtonText}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default CustomModal