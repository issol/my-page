import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { CancelReasonType } from '@src/types/requests/detail.type'
import { useState } from 'react'

type Props = {
  onClose: () => void
  onClick: (data: CancelReasonType) => void
}

export default function CancelRequestModal({ onClose, onClick }: Props) {
  const [message, setMessage] = useState('')

  return (
    <Dialog open={true} maxWidth='xs'>
      <DialogContent>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Box
              width='100%'
              display='flex'
              flexDirection='column'
              alignItems='center'
              gap='14px'
            >
              <AlertIcon type='error' />
              <Typography variant='body2' textAlign='center'>
                Are you sure you want to cancel this <br /> invoice?
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography fontWeight={600} mb='8px'>
              Message to client
            </Typography>
            <TextField
              rows={4}
              multiline
              fullWidth
              label='Write down a reason for canceling this request.'
              value={message}
              onChange={e => {
                setMessage(e.target.value)
              }}
              inputProps={{ maxLength: 500 }}
            />
            <Typography variant='body2' mt='12px' textAlign='right'>
              {message?.length ?? 0}/500
            </Typography>
          </Grid>
          <Grid item xs={12} display='flex' justifyContent='center' gap='10px'>
            <Button variant='outlined' onClick={onClose}>
              No
            </Button>
            <Button
              variant='contained'
              onClick={() =>
                onClick({
                  from: 'lsp',
                  message,
                  reason: 'LPM canceled',
                  type: 'canceled',
                })
              }
              disabled={!message.length}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
