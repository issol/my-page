import { Grid, Typography } from '@mui/material'
import PageHeader from 'src/@core/components/page-header'
import Filters from '../components/client-guidline/filter'
import ClientGuideLineList from '../components/client-guidline/list'

export default function ClientGuidLines() {
  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'>Client guidelines</Typography>}
      />
      <Filters />
      <ClientGuideLineList />
    </Grid>
  )
}

ClientGuidLines.acl = {
  action: 'read',
  subject: 'onboarding',
}
