import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { ChangeEvent, useState } from 'react'

type Props = {
  onClick: any
  onClose: any
}

const PartialDeliveryModal = ({ onClose, onClick }: Props) => {
  const [checked, setChecked] = useState(false)
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }
  return (
    <Box
      sx={{
        maxWidth: '361px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
        padding: '20px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '20px',
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
          <AlertIcon type='info-pie' />
          <Typography
            variant='body1'
            textAlign='center'
            mt='10px'
            sx={{ fontSize: '20px', fontWeight: 500 }}
          >
            You're currently in partial delivery.
            <Typography
              variant='body2'
              sx={{ fontSize: '16px' }}
              component={'span'}
            >
              &nbsp;To confirm full completion, proceed with the Final delivery.
            </Typography>
          </Typography>
        </Box>
        <Typography textAlign={'center'} fontSize={14} variant='body2'>
          <Typography
            color='rgba(76, 78, 100, 0.87)'
            fontSize={14}
            variant='body2'
            component={'span'}
          >
            Partial delivery
          </Typography>
          &nbsp;notifies the LPM of the successful delivery of&nbsp;
          <Typography
            color='rgba(76, 78, 100, 0.87)'
            fontSize={14}
            variant='body2'
            component={'span'}
          >
            a subset of files.
          </Typography>
        </Typography>
        <Box
          sx={{
            padding: '20px 12px',
            border: '1px solid rgba(76, 78, 100, 0.22)',
            borderRadius: '10px',
            gap: '8px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <FormControlLabel
            label={`I've gone through all the work-related
            instructions given by the LPM and
            followed the guidelines carefully
            while doing my tasks.`}
            sx={{
              alignItems: 'start',
              marginRight: 0,
              '& .MuiFormControlLabel-label': {
                fontSize: '14px',
                color: 'rgba(76, 78, 100, 0.87)',
                fontWeight: checked ? 400 : 600,
              },
            }}
            control={
              <Checkbox
                checked={checked}
                onChange={handleChange}
                name='controlled'
              />
            }
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='contained' disabled={!checked} onClick={onClick}>
            Deliver
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default PartialDeliveryModal
