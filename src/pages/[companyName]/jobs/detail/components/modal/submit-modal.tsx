import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Radio,
  Typography,
} from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { ChangeEvent, useState } from 'react'

type Props = {
  onClose: any
  onClick: (deliveryType: 'final' | 'partial') => void
}

const SubmitModal = ({ onClose, onClick }: Props) => {
  const [checked, setChecked] = useState(false)
  const [value, setValue] = useState<'partial' | 'final'>('partial')
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }

  const handleTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value as 'partial' | 'final')
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
          <Typography fontSize={20} fontWeight={500}>
            Deliver target files
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
            label={
              <Box>
                <Box sx={{ display: 'flex' }}>
                  <Typography fontSize={14} fontWeight={600}>
                    Partial&nbsp;
                  </Typography>
                  <Typography fontSize={14} fontWeight={400}>
                    delivery
                  </Typography>
                </Box>
                {value === 'partial' && (
                  <Typography
                    fontSize={14}
                    fontWeight={400}
                    color='#8D8E9A'
                    mt='4px'
                  >
                    You can continue making deliveries afterward.
                  </Typography>
                )}
              </Box>
            }
            sx={{
              alignItems: 'start',
              marginRight: 0,
              '& .MuiRadio-root': {
                padding: '0 9px 9px 9px',
              },
            }}
            control={
              <Radio
                value='partial'
                checked={value === 'partial'}
                onChange={handleTypeChange}
                name='controlled'
              />
            }
          />
          <FormControlLabel
            label={
              <Box>
                <Box sx={{ display: 'flex' }}>
                  <Typography fontSize={14} fontWeight={600}>
                    Final&nbsp;
                  </Typography>
                  <Typography fontSize={14} fontWeight={400}>
                    delivery
                  </Typography>
                </Box>
                {value === 'final' && (
                  <Typography
                    fontSize={14}
                    fontWeight={400}
                    color='#8D8E9A'
                    mt='4px'
                  >
                    No further deliveries will be possible afterward.
                  </Typography>
                )}
              </Box>
            }
            sx={{
              alignItems: 'start',
              marginRight: 0,
              '& .MuiRadio-root': {
                padding: '0 9px 9px 9px',
              },
            }}
            control={
              <Radio
                value='final'
                checked={value === 'final'}
                onChange={handleTypeChange}
                name='controlled'
              />
            }
          />
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
                fontWeight: 600,
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
          <Button
            variant='contained'
            disabled={!checked}
            onClick={() => onClick(value)}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default SubmitModal
