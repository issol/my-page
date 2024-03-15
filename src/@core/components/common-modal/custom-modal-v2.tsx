import { Box, Button, IconButton, TextField, Typography } from '@mui/material'

import AlertIcon from '../alert-icon'
import { useState } from 'react'
import { Icon } from '@iconify/react'

type Props = {
  onClose: any
  onClick: any
  title: string | JSX.Element
  titleStyle?: 'normal' | 'bold'
  titleSize?: 'small' | 'normal' | 'large'
  titleColor?: string
  subtitle?: string | JSX.Element
  subtitleColor?: 'primary' | 'secondary'
  vary:
    | 'error'
    | 'info'
    | 'error-report'
    | 'progress'
    | 'successful'
    | 'guideline-info'
    | 'question-info'
    | 'error-alert'
  textarea?: boolean
  textareaRequired?: boolean
  textareaPlaceholder?: string
  leftButtonText?: string
  rightButtonText: string
  soloButton?: boolean
  noButton?: boolean
  closeButton?: boolean
  buttonDirection?: 'row' | 'column-reverse'
  body?: string | JSX.Element
}

const CustomModalV2 = ({
  onClose,
  onClick,
  title,
  titleStyle,
  titleSize,
  titleColor,
  subtitle,
  subtitleColor,
  vary,
  leftButtonText,
  rightButtonText,
  textarea,
  textareaRequired,
  textareaPlaceholder,
  soloButton,
  noButton,
  closeButton,
  buttonDirection,
  body,
}: Props) => {
  const [text, setText] = useState('')

  return (
    <Box
      sx={{
        maxWidth: '360px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
        position: closeButton ? 'relative' : 'inherit',
      }}
    >
      {closeButton ? (
        <IconButton
          sx={{ position: 'absolute', top: '10px', right: '10px' }}
          onClick={onClose}
        >
          <Icon icon='mdi:close'></Icon>
        </IconButton>
      ) : null}
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
          <AlertIcon type={vary} />

          <Typography
            variant='body2'
            textAlign='center'
            mt='10px'
            color={titleColor ?? 'rgba(76, 78, 100, 0.87)'}
            sx={{
              fontWeight: titleStyle
                ? titleStyle === 'bold'
                  ? '700'
                  : titleStyle === 'normal'
                    ? '400'
                    : null
                : 500,
              fontSize: titleSize
                ? titleSize === 'large'
                  ? '20px'
                  : titleSize === 'normal'
                    ? '16px'
                    : null
                : '20px',
              // marginBottom: '16px',
            }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant='body2'
              fontSize={16}
              textAlign='center'
              // color={subtitleColor ?? 'primary'}
            >
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {textarea ? (
          <Box sx={{ mt: '24px' }}>
            <TextField
              autoComplete='off'
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
        {noButton ? null : (
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: buttonDirection ?? 'row',
              width: '100%',
              // mt: buttonDirection === 'column-reverse' || subtitle ? '30px' : 0,
              mt: '32px',
            }}
          >
            {soloButton ? null : (
              <Button
                variant='outlined'
                onClick={onClose}
                sx={{
                  width:
                    buttonDirection === 'column-reverse' ? '210px' : '100%',
                }}
              >
                {leftButtonText ?? 'Cancel'}
              </Button>
            )}

            <Button
              variant='contained'
              onClick={() => (textarea ? onClick(text) : onClick())}
              sx={{
                width: buttonDirection === 'column-reverse' ? '210px' : '100%',
              }}
              disabled={textareaRequired ? textarea && text === '' : false}
            >
              {rightButtonText}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default CustomModalV2
