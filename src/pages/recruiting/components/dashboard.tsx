import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material'
import { ReactElement } from 'react'
import CardNormal from 'src/@core/components/card-statistics/card-normal'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { ThemeColor } from 'src/@core/layouts/types'

import CustomAvatar from 'src/@core/components/mui/avatar'

interface SaleDataType {
  stats: number
  title: string
  color: ThemeColor
  icon: ReactElement
}

export default function RecruitingDashboard() {
  const salesData: SaleDataType[] = [
    {
      stats: 900,
      color: 'primary',
      title: 'Onboarded',
      icon: <Icon icon='mdi:airplane-takeoff' />,
    },
    {
      stats: 102,
      color: 'warning',
      title: 'Testing',
      icon: <Icon icon='mdi:poll' />,
    },
    {
      color: 'info',
      stats: 300,
      title: 'Waiting',
      icon: <Icon icon='mdi:clock-time-four' />,
    },
  ]

  const renderStats = () => {
    return salesData.map((sale: SaleDataType, index: number) => (
      <Grid item xs={12} sm={4} key={index}>
        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar
            skin='light'
            variant='rounded'
            color={sale.color}
            sx={{ mr: 4 }}
          >
            {sale.icon}
          </CustomAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h6' sx={{ fontWeight: 600 }}>
              {sale.stats}
            </Typography>
            <Typography variant='caption'>{sale.title}</Typography>
          </Box>
        </Box>
      </Grid>
    ))
  }
  return (
    <Grid item xs={12}>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12} sm={6} md={2.5}>
          <CardNormal
            data={{
              stats: '1,032',
              title: 'Total Pros',
              titleColor: '#666CFF',

              src: '/images/cards/card-stats-img-1.png',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={9} md={5.5}>
          <Card>
            <CardHeader
              sx={{ pb: 3.25 }}
              title='Onboarding status'
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Grid container spacing={6}>
                {renderStats()}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.5}>
          <CardNormal
            data={{
              stats: '27',
              title: 'New Pros',
              titleColor: '#64C623',
              src: '/images/cards/card-stats-img-2.png',
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}
