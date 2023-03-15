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
type Props = {
  open: boolean
  onClose: any
  messageToUser: string
  reason: string
  type: string
}
export default function ReasonModal({
  open,
  onClose,
  messageToUser,
  reason,
  type,
}: Props) {
  return (
    <Dialog
      open={open}
      keepMounted
      onClose={onClose}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
      maxWidth='xs'
    >
      <DialogContent
        sx={{
          padding: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          position: 'relative',
        }}
      >
        <IconButton
          sx={{ position: 'absolute', top: '20px', right: '20px' }}
          onClick={onClose}
        >
          <Icon icon='mdi:close'></Icon>
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '8px',
          }}
        >
          <Image
            src='/images/icons/alert/alert-reason.svg'
            width={68}
            height={68}
            alt=''
          />
        </Box>

        <DialogContentText id='alert-dialog-slide-description'>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Typography variant='body1' sx={{ fontWeight: 600 }}>
                {/* {type}&nbsp; reason */}
                Rejected reason
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
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}
