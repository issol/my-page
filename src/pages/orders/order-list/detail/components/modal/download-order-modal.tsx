import { Box, Typography } from '@mui/material'

const DownloadOrderModal = () => {
  return (
    <Box
      sx={{
        maxWidth: '362px',
        width: '100%',
        maxHeight: '296px',
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
          <Box>
            <img src='/images/icons/order-icons/download-order.svg' alt='' />
          </Box>

          <Typography variant='h6'>Download order</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default DownloadOrderModal
