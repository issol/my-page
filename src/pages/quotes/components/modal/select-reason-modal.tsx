import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import {
  RejectQuoteReason,
  RequestRevisionReason,
} from '@src/shared/const/reason/reason'
import { ChangeEvent, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  onClose: any
  onClick: any
  title: string
  subtitle?: string
  vary: 'error' | 'info' | 'error-report' | 'progress' | 'successful'
  leftButtonText?: string
  rightButtonText: string
  action: string
  from: 'lsp' | 'client'
  statusList: { value: number; label: string }[]
}

const SelectReasonModal = ({
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
}: Props) => {
  const [reason, setReason] = useState<string>('')
  const [messageToLsp, setMessageToLsp] = useState<string>('')

  const handleChangeMessageToLsp = (event: ChangeEvent<HTMLInputElement>) => {
    setMessageToLsp(event.target.value)
  }

  const handleChangeReason = (event: ChangeEvent<HTMLInputElement>) => {
    setReason((event.target as HTMLInputElement).value)

    setMessageToLsp((event.target as HTMLInputElement).value)
  }
  return (
    <Box
      sx={{
        maxWidth: '482px',
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

            padding: '0px 60px',
          }}
        >
          <AlertIcon type={vary} />
          <Typography
            variant='body2'
            textAlign='center'
            mt='10px'
            sx={{ fontSize: '16px' }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant='body2'
              textAlign='center'
              sx={{ fontWeight: 700, fontSize: '16px' }}
            >
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        <Box>
          <RadioGroup
            row
            aria-label='controlled'
            name='controlled'
            value={reason}
            onChange={handleChangeReason}
            sx={{ maxWidth: 442 }}
          >
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 1, pl: 2.2 }}
            >
              {(rightButtonText === 'Reject'
                ? RejectQuoteReason
                : RequestRevisionReason
              ).map(value => {
                return (
                  <FormControlLabel
                    key={uuidv4()}
                    value={value}
                    control={<Radio />}
                    label={value}
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
          </RadioGroup>
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
            rows={4}
            multiline
            value={messageToLsp}
            onChange={handleChangeMessageToLsp}
            inputProps={{ maxLength: 500 }}
            placeholder={
              messageToLsp === ''
                ? rightButtonText === 'Request'
                  ? 'Write down a request for this quote.'
                  : 'Write down a reason for rejecting this quote.'
                : undefined
            }
            error={reason !== '' && messageToLsp === ''}
            helperText={
              reason !== '' && messageToLsp === ''
                ? 'This field is required'
                : null
            }
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
            {messageToLsp.length}/500
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
            {leftButtonText ?? 'Cancel'}
          </Button>
          <Button
            variant='contained'
            onClick={() =>
              onClick(statusList.find(value => value.label === action)?.value, {
                from: from,
                reason: reason,
                message: messageToLsp,
              })
            }
            disabled={reason === '' || messageToLsp === ''}
          >
            {rightButtonText}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default SelectReasonModal
