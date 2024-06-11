import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { useState } from 'react'

type Props = {
  onClose: any
  onClick: (autoFile: boolean) => void
}

const MoveNextJobModal = ({ onClose, onClick }: Props) => {
  const [value, setValue] = useState('share')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value)
  }
  return (
    <Box
      sx={{
        maxWidth: '370px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          padding: '32px 20px',
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
            gap: '10px',
          }}
        >
          <AlertIcon type='successful' />
          <Typography
            variant='body2'
            textAlign='center'
            mt='10px'
            color={'rgba(76, 78, 100, 0.87)'}
            sx={{
              fontWeight: 500,
              fontSize: '20px',
              // marginBottom: '16px',
            }}
          >
            Move on to the next job?
          </Typography>

          <Typography
            component='div'
            variant='body1'
            textAlign='center'
            color='#8D8E9A'
          >
            Would you like to send a notification of job initiation to the next
            assignee?
          </Typography>
        </Box>
        <Box sx={{ paddingTop: '20px' }}>
          <RadioGroup
            aria-labelledby='demo-controlled-radio-buttons-group'
            name='controlled-radio-buttons-group'
            value={value}
            onChange={handleChange}
            sx={{
              label: {
                marginRight: 0,
                marginLeft: 0,
              },
              '& .MuiFormControlLabel-root': {
                display: 'flex',
                gap: '8px',
                alignItems: 'center',

                height: '36px',
              },
              '& .MuiRadio-root': {
                padding: 0,
              },
              '& .MuiFormControlLabel-label': {
                fontSize: '14px',
                lineHeight: '24px',
              },
            }}
          >
            <FormControlLabel
              value='share'
              control={<Radio />}
              label='Share target files from previous job.'
            />
            <FormControlLabel
              value='notShare'
              control={<Radio />}
              label='Do not share target files from previous job.'
            />
          </RadioGroup>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center',

            width: '100%',
            // mt: buttonDirection === 'column-reverse' || subtitle ? '30px' : 0,
            mt: '32px',
          }}
        >
          <Button
            variant='outlined'
            onClick={onClose}
            size='medium'
            sx={{
              width: '100%',
            }}
          >
            Cancel
          </Button>

          <Button
            variant='contained'
            size='medium'
            onClick={() => onClick(value === 'share' ? true : false)}
            sx={{
              width: '100%',
            }}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default MoveNextJobModal
