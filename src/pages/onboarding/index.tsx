import { Card, CardContent, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Link from 'next/link'
import PageHeader from 'src/@core/components/page-header'
import styled from 'styled-components'
import OnboardingDashboard from './components/list/dashboard'
import Filters from './components/list/filters'

export default function Onboarding() {
  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'>Onboarding list</Typography>}
      />
      <OnboardingDashboard />
      <Filters />
    </Grid>
  )
}

Onboarding.acl = {
  action: 'read',
  subject: 'onboarding',
}
