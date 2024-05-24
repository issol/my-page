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
import AlertIcon, { AlertType } from '@src/@core/components/alert-icon'
import { ChangeEvent, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  onClose: any
  onClick: any
  title: string
  subtitle?: string
  vary: AlertType
  leftButtonText?: string
  rightButtonText: string
  action: string
  from: 'lsp' | 'client'
  statusList: { value: number; label: string }[]
  reasonList: string[]
  type: 'canceled' | 'rejected' | 'revision-requested' | 'redelivery-requested'
  usage: 'order' | 'quote' | 'request' | 'reject' | 'request-revision'
}

const SelectRequestRedeliveryReasonModal = ({
  onClose,
  onClick,
  title,
  subtitle,
  vary,
  leftButtonText,
  rightButtonText,
  action,
  from,
  statusList,
  reasonList,
  type,
  usage,
}: Props) => {
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
      reasonList.map((value, idx) => {
        return {
          id: idx,
          checked: false,
          reason: value,
        }
      }),
    )
  }, [reasonList])

  return (
    <Box
      sx={{
        maxWidth: '360px',
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
          gap: '24px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',

            // padding: '0px 60px',
          }}
        >
          <AlertIcon type={vary} />
          <Typography
            textAlign='center'
            mt='16px'
            fontSize={20}
            fontWeight={500}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant='body2'
              textAlign='center'
              sx={{ fontWeight: 400, fontSize: '16px', mt: '10px' }}
            >
              {subtitle}
            </Typography>
          ) : null}
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
                        fontSize: '16px',
                        fontWeight: 400,
                        lineHeight: '24px',
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
            Message to LSP
          </Typography>
          <TextField
            fullWidth
            autoComplete='off'
            rows={4}
            multiline
            value={messageToLsp}
            onChange={handleChangeMessageToLsp}
            inputProps={{ maxLength: 500 }}
            placeholder={
              messageToLsp === '' || messageToLsp === null
                ? usage === 'request-revision'
                  ? 'Write down a request for this quote.'
                  : usage === 'order'
                    ? 'Write down a reason for canceling this order.'
                    : usage === 'request'
                      ? 'Write down a reason for requesting redelivery.'
                      : usage === 'quote'
                        ? 'Write down a reason for canceling this quote.'
                        : usage === 'reject'
                          ? 'Write down a reason for rejecting this quote.'
                          : ''
                : undefined
            }
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
            {leftButtonText ?? 'No'}
          </Button>
          <Button
            variant='contained'
            onClick={() =>
              onClick(statusList.find(value => value.label === action)?.value, {
                from: from,
                reason: reason
                  .filter(value => value.checked)
                  .map(value => value.reason),
                message: messageToLsp,
                type: type,
              })
            }
            disabled={
              reason.length < 1 || messageToLsp === '' || messageToLsp === null
            }
          >
            {rightButtonText}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default SelectRequestRedeliveryReasonModal
