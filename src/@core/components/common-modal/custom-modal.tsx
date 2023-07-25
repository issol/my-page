import { Box, Button, TextField, Typography } from '@mui/material'

import AlertIcon from '../alert-icon'
import { useState } from 'react'

type Props = {
  onClose: any
  onClick: any
  title: string | JSX.Element
  subtitle?: string
  vary: 'error' | 'info' | 'error-report' | 'progress' | 'successful'
  textarea?: boolean
  textareaPlaceholder?: string
  leftButtonText?: string
  rightButtonText: string
}

const CustomModal = ({
  onClose,
  onClick,
  title,
  subtitle,
  vary,
  leftButtonText,
  rightButtonText,
  textarea,
  textareaPlaceholder,
}: Props) => {
  const [text, setText] = useState('')

  return (
    <Box
      sx={{
        maxWidth: '361px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
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
        {textarea ? (
          <Box sx={{ mt: '24px' }}>
            <TextField
              fullWidth
              rows={4}
              multiline
              value={text}
              onChange={e => setText(e.target.value)}
              inputProps={{ maxLength: 500 }}
              placeholder={textareaPlaceholder}
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
              {text.length}/500
            </Box>
          </Box>
        ) : null}
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
            onClick={() => (textarea ? onClick(text) : onClick())}
            disabled={textarea && text === ''}
          >
            {rightButtonText}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default CustomModal
