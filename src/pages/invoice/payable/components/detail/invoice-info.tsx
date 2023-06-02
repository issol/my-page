import { Card, CardContent, Grid } from '@mui/material'
import InvoiceDetailCard from './invoice-detail-card'
import InvoiceAmount from './invoice-amount'
import InvoiceJobList from './job-list'

export default function InvoiceInfo() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ padding: '24px' }}>
            <InvoiceDetailCard />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <InvoiceAmount />
      </Grid>
      <Grid item xs={12}>
        <InvoiceJobList />
      </Grid>
    </Grid>
  )
}
