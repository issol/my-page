import { useState } from 'react'

import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import InvoiceDetailCard from './invoice-detail-card'
import InvoiceAmount from './invoice-amount'
import InvoiceJobList from './job-list'

export default function InvoiceInfo() {
  const [editInfo, setEditInfo] = useState(false)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ padding: '24px' }}>
            <InvoiceDetailCard editInfo={editInfo} setEditInfo={setEditInfo} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <InvoiceAmount />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Jobs' />
          <InvoiceJobList />
        </Card>
      </Grid>
    </Grid>
  )
}
