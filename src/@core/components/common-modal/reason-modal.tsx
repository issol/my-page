import Image from 'next/image'

import Box from '@mui/material/Box'

import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'

import DialogContentText from '@mui/material/DialogContentText'

import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'

import { AddRoleType } from 'src/types/onboarding/list'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import AlertIcon from '../alert-icon'
type Props = {
  onClose: any
  messageToUser: string
  reason: string
  type: string
  vary: 'error' | 'info' | 'error-report' | 'progress' | 'successful'
}
export default function ReasonModal({
  onClose,
  messageToUser,
  reason,
  type,
  vary,
}: Props) {
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
      <Box
        sx={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <IconButton
          sx={{ position: 'absolute', top: '20px', right: '20px' }}
          onClick={onClose}
        >
          <Icon icon='mdi:close' />
        </IconButton>
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
        </Box>

        <DialogContentText id='alert-dialog-slide-description'>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Typography variant='body1' sx={{ fontWeight: 600 }}>
                {type}&nbsp; reason
              </Typography>
              <Typography variant='body1'>
                {reason === '' || !reason ? '-' : reason}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Typography variant='body1' sx={{ fontWeight: 600 }}>
                Message to Pro
              </Typography>
              <Typography
                variant='body1'
                sx={{ whiteSpace: 'pre-line !important' }}
              >
                {messageToUser === '' || !messageToUser ? '-' : messageToUser}
              </Typography>
            </Box>
          </Box>
        </DialogContentText>
      </Box>
    </Box>
  )
}
