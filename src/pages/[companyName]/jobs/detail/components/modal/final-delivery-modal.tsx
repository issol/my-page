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
  onClose: any
  onClick: any
}

const FinalDeliveryModal = ({ onClose, onClick }: Props) => {
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
          <AlertIcon type='successful' />
          <Typography
            variant='body1'
            textAlign='center'
            mt='10px'
            sx={{ fontSize: '20px', fontWeight: 500 }}
          >
            Are you sure you want to finalize the delivery?
          </Typography>
        </Box>

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
                fontWeight: 400,
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
        <Typography textAlign={'center'} fontSize={14} variant='body2'>
          <Typography
            color='rgba(76, 78, 100, 0.87)'
            fontSize={14}
            variant='body2'
            fontWeight={600}
            component={'span'}
          >
            Additional file uploads will be disabled
          </Typography>
          , and the LPM will receive notification that all deliveries have been
          finalized.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='contained' disabled={!checked} onClick={onClick}>
            Complete
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default FinalDeliveryModal
