import { Grid, Typography } from '@mui/material'
import PageHeader from 'src/@core/components/page-header'
import RecruitingDashboard from './components/dashboard'

export default function Recruiting() {
  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'>Recruiting info</Typography>}
      />
      <RecruitingDashboard />
    </Grid>
  )
}

Recruiting.acl = {
  subject: 'recruiting',
  action: 'read',
}
