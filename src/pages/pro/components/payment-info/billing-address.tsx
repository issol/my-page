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
  replaceDots: (value: string) => string
}

export default function BillingAddress({ info, replaceDots }: Props) {
  return (
    <Card style={{ marginTop: '24px' }}>
      <CardHeader title='Billing address' />
      <Grid container mt={6} margin='0 20px 20px'>
        <Grid item xs={6}>
          <ContentGrid>
            <Typography sx={{ fontWeight: 'bold' }}>Street 1</Typography>
            <Typography variant='body2'>
              {replaceDots(info?.street[1] ?? '')}
            </Typography>
          </ContentGrid>
          <ContentGrid>
            <Typography sx={{ fontWeight: 'bold' }}>City</Typography>
            <Typography variant='body2'>
              {replaceDots(info?.street[2] ?? '')}
            </Typography>
          </ContentGrid>
          <ContentGrid>
            <Typography sx={{ fontWeight: 'bold' }}>Country</Typography>
            <Typography variant='body2'>
              {replaceDots(info?.country ?? '')}
            </Typography>
          </ContentGrid>
        </Grid>

        <Grid item xs={6} sx={{ paddingLeft: '24px' }}>
          <ContentGrid>
            <Typography sx={{ fontWeight: 'bold' }}>Street 2</Typography>
            <Typography variant='body2'>
              {replaceDots(info?.street[2] ?? '')}
            </Typography>
          </ContentGrid>
          <ContentGrid>
            <Typography sx={{ fontWeight: 'bold' }}>State</Typography>
            <Typography variant='body2'>
              {replaceDots(info?.state ?? '')}
            </Typography>
          </ContentGrid>
          <ContentGrid>
            <Typography sx={{ fontWeight: 'bold' }}>Zip code</Typography>
            <Typography variant='body2'>
              {replaceDots(info?.zip.toString() ?? '')}
            </Typography>
          </ContentGrid>
        </Grid>
      </Grid>
    </Card>
  )
}
