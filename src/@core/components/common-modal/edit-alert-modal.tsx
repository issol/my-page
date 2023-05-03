import { Box, Button, Typography } from '@mui/material'

import AlertIcon from '../alert-icon'

type Props = {
  onClose: any
  onClick: any
}

const EditAlertModal = ({ onClose, onClick }: Props) => {
  return (
    <Box
      sx={{
        maxWidth: '380px',
        width: '100%',
        maxHeight: '228px',
        height: '100%',
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
          <AlertIcon type='error' />

          <Typography
            variant='subtitle2'
            textAlign='center'
            mt='10px'
            sx={{ fontSize: '16px', fontWeight: 400 }}
          >
            Are you sure you want to leave this page? Changes you made may not
            be saved.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            mt: '16px',
          }}
        >
          <Button variant='outlined' onClick={onClose} size='medium'>
            Stay on this page
          </Button>
          <Button variant='contained' onClick={onClick} size='medium'>
            Leave this page
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default EditAlertModal
