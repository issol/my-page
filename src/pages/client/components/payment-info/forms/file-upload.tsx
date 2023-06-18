import { Icon } from '@iconify/react'
import { Box, Button, Grid, Typography } from '@mui/material'

export default function ClientPaymentFiles() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box display='flex' alignItems='center' gap='10px'>
            <Typography variant='h6'>Files</Typography>
            <Typography variant='body2'>0 kb/50mb</Typography>
          </Box>
          <Box display='flex' alignItems='center' gap='10px'>
            <Button variant='contained'>Upload</Button>
            <Button variant='outlined'>
              <Icon icon='ic:baseline-download' />
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}
