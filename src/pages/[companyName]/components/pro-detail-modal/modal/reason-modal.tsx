import Image from 'next/image'

import Box from '@mui/material/Box'

import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'

import DialogContentText from '@mui/material/DialogContentText'

import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'

import { AddRoleType } from '@src/types/onboarding/list'
import IconButton from '@mui/material/IconButton'
import Icon from '@src/@core/components/icon'

type Props = {
  onClose: any
  messageToUser: string
  reason: string
  type: string
}
export default function ReasonModal({
  onClose,
  messageToUser,
  reason,
  type,
}: Props) {
  return (
    <Box
      sx={{
        maxWidth: '381px',
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Typography variant='body1' sx={{ fontWeight: 600 }}>
                {type}&nbsp; reason
              </Typography>
              <Typography variant='body1'>{reason}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Typography variant='body1' sx={{ fontWeight: 600 }}>
                Message to Pro
              </Typography>
              <Typography
                variant='body1'
                sx={{ whiteSpace: 'pre-line !important' }}
              >
                {messageToUser}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
