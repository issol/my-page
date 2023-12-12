import { Box, Button, TextField, Typography } from '@mui/material'

import AlertIcon from '../alert-icon'
import { useState } from 'react'

type Props = {
  onClose: any
  onClick: any
}

const LoginRequiredModal = ({ onClose, onClick }: Props) => {
  const [text, setText] = useState('')

  return (
    <Box
      sx={{
        maxWidth: '494px',
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
        ></Box>
      </Box>
    </Box>
  )
}

export default LoginRequiredModal
