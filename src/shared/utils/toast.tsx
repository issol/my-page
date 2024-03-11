import { Icon } from '@iconify/react'
import { Box, IconButton, Typography } from '@mui/material'
import toast from 'react-hot-toast'

export const displayCustomToast = (
  message: string,
  vary: 'error' | 'success',
) => {
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      // setSelectedUser(undefined)
      resolve('ok')
    }, 100)
  })

  return toast.promise(
    myPromise,
    {
      loading: <></>,
      success: (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography>{message}</Typography>

          <IconButton onClick={() => toast.dismiss()}>
            <Icon icon='mdi:close' />
          </IconButton>
        </Box>
      ),
      error: 'Error when fetching',
    },
    {
      position: 'bottom-left',
      style: {
        padding: '16px',
        width: '350px',
      },
      loading: {
        icon: '',
        style: {
          display: 'none',
        },
      },
      success: {
        icon:
          vary === 'success' ? (
            <Icon icon='mdi:check-circle' fontSize={24} color='#72E128' />
          ) : (
            <Icon icon='mdi:trash-can-circle' fontSize={24} color='#FF4D49' />
          ),
        duration: 1000 * 4,
        style: {
          width: '350px',
          justifyContent: 'flex-start',
        },
      },
      error: {
        style: {
          display: 'none',
        },
      },
    },
  )
}
