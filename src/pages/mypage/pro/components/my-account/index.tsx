import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { UserDataType } from '@src/context/types'

type Props = {
  user: UserDataType
}
export default function MyAccount({ user }: Props) {
  return (
    <Card sx={{ padding: '24px' }}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h6'>Account information</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box></Box>
        </Grid>
      </Grid>
    </Card>
  )
}
