import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'

export default function EmptyPost() {
  const router = useRouter()
  return (
    <Box
      display='grid'
      justifyContent='center'
      alignContent='center'
      sx={{ height: '100%' }}
    >
      <Typography variant='h5'>No existing posts found.</Typography>
      <Button
        variant='contained'
        sx={{ marginTop: '20px' }}
        onClick={() => router.back()}
      >
        Go Back
      </Button>
    </Box>
  )
}
