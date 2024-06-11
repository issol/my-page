import { CheckBox } from '@mui/icons-material'
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { RequestRedeliveryReason } from '@src/shared/const/reason/reason'
import { ChangeEvent, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  onClose: any
  onClick: any
}

const SelectRequestRedeliveryReasonModal = ({ onClose, onClick }: Props) => {
  const [messageToLsp, setMessageToLsp] = useState<string | null>(null)

  const handleChangeMessageToLsp = (event: ChangeEvent<HTMLInputElement>) => {
    setMessageToLsp(event.target.value)
  }

  const [reason, setReason] = useState<
    {
      id: number
      checked: boolean
      reason: string
    }[]
  >([])

  const changeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    reasons: {
      id: number
      checked: boolean
      reason: string
    },
  ) => {
    setReason(
      reason.map(item =>
        item.id === reasons.id
          ? { ...item, checked: event.target.checked }
          : item,
      ),
    )
  }

  useEffect(() => {
    setReason(
      RequestRedeliveryReason.map((value, idx) => {
        return {
          id: idx,
          checked: false,
          reason: value,
        }
      }),
    )
  }, [])

  return (
    <Box
      sx={{
        maxWidth: '360px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
        padding: '32px 20px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '24px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            // padding: '0px 60px',
          }}
        >
          <AlertIcon type='error-alert' />
          <Typography
            textAlign='center'
            mt='10px'
            fontSize={20}
            fontWeight={500}
          >
            Request redelivery?
          </Typography>

          <Typography
            variant='body2'
            textAlign='center'
            fontWeight={400}
            fontSize={16}
          >
            Are you sure you want to request redelivery?
          </Typography>
        </Box>
        <Box>
          <FormGroup sx={{ maxWidth: 442 }}>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 1, pl: 2.2 }}
            >
              {reason.map((value, idx) => {
                return (
                  <FormControlLabel
                    key={uuidv4()}
                    // value={reason.find(el => el.reason === value)?.reason}
                    control={
                      <Checkbox
                        checked={value.checked}
                        onChange={event => changeHandler(event, value)}
                      />
                    }
                    label={value.reason}
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '21px',
                        color: 'rgba(76, 78, 100, 0.87)',
                      },
                    }}
                  />
                )
              })}
            </Box>
          </FormGroup>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant='body1'
            sx={{ fontWeight: 600, marginBottom: '0.5rem' }}
          >
            Message to Pro
          </Typography>
          <TextField
            fullWidth
            autoComplete='off'
            rows={3}
            multiline
            value={messageToLsp}
            onChange={handleChangeMessageToLsp}
            inputProps={{ maxLength: 500 }}
            placeholder={'Write down a reason for requesting redelivery.'}
            error={messageToLsp === ''}
            helperText={messageToLsp === '' ? 'This field is required' : null}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              fontSize: '12px',
              lineHeight: '25px',
              color: '#888888',
            }}
          >
            {messageToLsp ? messageToLsp.length : 0}/500
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            mt: '16px',
          }}
        >
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() =>
              onClick(
                reason.filter(item => item.checked).map(item => item.reason),
                messageToLsp,
              )
            }
            disabled={
              reason.length < 1 || messageToLsp === '' || messageToLsp === null
            }
          >
            Request
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default SelectRequestRedeliveryReasonModal
