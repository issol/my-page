import { Icon } from '@iconify/react'
import { Box, Button, Typography } from '@mui/material'

type Props = {
  onClose: () => void
}

const SelectProModal = ({ onClose }: Props) => {
  return (
    <Box
      sx={{
        maxWidth: '1210px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography fontSize={20} fontWeight={600}>
          Pros (0)
        </Typography>

        <Button
          variant='contained'
          startIcon={<Icon icon='mdi:check' />}
          onClick={onClose}
        >
          Select
        </Button>
      </Box>
    </Box>
  )
}

export default SelectProModal
