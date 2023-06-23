import { Box, Button, IconButton, Typography } from '@mui/material'

import AlertIcon from '../alert-icon'
import { Icon } from '@iconify/react'

type Props = {
  onClose: any

  title: string
  subtitle?: string
  vary: 'error' | 'info' | 'error-report' | 'progress' | 'successful'
}

const InformationModal = ({
  onClose,

  title,
  subtitle,
  vary,
}: Props) => {
  return (
    <Box
      sx={{
        maxWidth: '361px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
        position: 'relative',
      }}
    >
      <IconButton
        sx={{ position: 'absolute', top: '10px', right: '10px' }}
        onClick={onClose}
      >
        <Icon icon='mdi:close'></Icon>
      </IconButton>
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
            sx={{ fontWeight: 500, fontSize: '20px' }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant='subtitle2'
              textAlign='center'
              sx={{ fontSize: '16px', fontWeight: 400 }}
            >
              {subtitle}
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Box>
  )
}

export default InformationModal
