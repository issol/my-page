import { Icon } from '@iconify/react'
import { Box, Grid, IconButton, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { CancelReasonType } from '@src/types/requests/detail.type'

type Props = {
  data: CancelReasonType | undefined | null
  onClose: () => void
  onClick: (data: { option: string; reason?: string }) => void
}

export default function CanceledReasonModal({ data, onClose, onClick }: Props) {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box
          width='100%'
          display='flex'
          justifyContent='space-between'
          alignItems='flex-start'
          gap='14px'
        >
          <div style={{ width: '40px' }}></div>
          <AlertIcon type='question-info' />
          <IconButton onClick={onClose}>
            <Icon icon='material-symbols:close' />
          </IconButton>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography fontWeight={600} mb='8px'>
          Canceled reason
        </Typography>
        <Typography variant='body2'>{data?.reason ?? '-'}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography fontWeight={600} mb='8px'>
          {data?.from === 'client'
            ? 'Message from client'
            : 'Message to client'}
        </Typography>
        <Typography variant='body2'>
          {data?.message ? data?.message : '-'}
        </Typography>
      </Grid>
    </Grid>
  )
}
