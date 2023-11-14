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
import { CancelReasonType } from '@src/types/requests/detail.type'
import { ca } from 'date-fns/locale'
import { ReasonType } from '@src/types/quotes/quote'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  onClose: any

  type: string
  vary:
    | 'error'
    | 'info'
    | 'error-report'
    | 'progress'
    | 'successful'
    | 'question-info'
  reason: ReasonType | null
  role?: 'lpm' | 'client'
  showType?: boolean
}
export default function ReasonModal({
  onClose,

  type,
  vary,
  reason,
  role,
  showType = true,
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
            mb: '8px',
          }}
        >
          <AlertIcon type={vary} />
        </Box>

        <DialogContentText id='alert-dialog-slide-description'>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {!showType ? null : (
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
              >
                <Typography variant='body1' sx={{ fontWeight: 600 }}>
                  {type}&nbsp; reason
                </Typography>
                <Typography variant='body1'>
                  {reason
                    ? typeof reason.reason === 'string'
                      ? reason.reason
                      : reason.reason.map(value => {
                          return <li key={uuidv4()}>{value}</li>
                        })
                    : '-'}
                </Typography>
              </Box>
            )}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                minHeight: '96px',
              }}
            >
              <Typography variant='body1' sx={{ fontWeight: 600 }}>
                {/* Message {reason?.from === 'lsp' ? 'from' : 'to'} LSP */}
                Message{' '}
                {reason?.from === 'lsp'
                  ? role === 'lpm'
                    ? 'to'
                    : 'from'
                  : role === 'lpm'
                  ? 'from'
                  : 'to'}{' '}
                {role === 'lpm' ? 'client' : 'LSP'}
              </Typography>
              <Typography
                variant='body2'
                fontSize={16}
                sx={{ whiteSpace: 'pre-line !important' }}
              >
                {reason ? reason?.message : '-'}
              </Typography>
            </Box>
          </Box>
        </DialogContentText>
      </Box>
    </Box>
  )
}
