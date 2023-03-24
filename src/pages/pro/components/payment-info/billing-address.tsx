import { Card, CardHeader, Grid, Typography } from '@mui/material'
import { ContentGrid } from '.'

type Props = {
  info: {
    street: { 1: string; 2: string }
    city: string
    state: string
    country: string
    zip: number
  }
}

export default function BillingAddress({ info }: Props) {
  return (
    <Card style={{ marginTop: '24px' }}>
      <CardHeader title='Billing address' />
      <Grid container mt={6} margin='0 20px 20px'>
        <Grid item xs={6}>
          <ContentGrid>
            <Typography sx={{ fontWeight: 'bold' }}>Street 1</Typography>
            <Typography variant='body2'>●●●●●</Typography>
          </ContentGrid>
          <ContentGrid>
            <Typography sx={{ fontWeight: 'bold' }}>City</Typography>
            <Typography variant='body2'>San Jose</Typography>
          </ContentGrid>
          <ContentGrid>
            <Typography sx={{ fontWeight: 'bold' }}>Country</Typography>
            <Typography variant='body2'>United States</Typography>
          </ContentGrid>
        </Grid>

        <Grid item xs={6} sx={{ paddingLeft: '24px' }}>
          <ContentGrid>
            <Typography sx={{ fontWeight: 'bold' }}>Street 2</Typography>
            <Typography variant='body2'>-</Typography>
          </ContentGrid>
          <ContentGrid>
            <Typography sx={{ fontWeight: 'bold' }}>State</Typography>
            <Typography variant='body2'>California</Typography>
          </ContentGrid>
          <ContentGrid>
            <Typography sx={{ fontWeight: 'bold' }}>Zip code</Typography>
            <Typography variant='body2'>●●●●●</Typography>
          </ContentGrid>
        </Grid>
      </Grid>
    </Card>
  )
}
