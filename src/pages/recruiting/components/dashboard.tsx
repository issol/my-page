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

// ** types
import { RecruitingCountType } from 'src/apis/recruiting.api'

interface RecruitingData {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement
}

export default function RecruitingDashboard({
  counts,
}: {
  counts: RecruitingCountType
}) {
  const formatter = (number: number) => new Intl.NumberFormat().format(number)

  const recruitingData: RecruitingData[] = [
    {
      stats: formatter(counts.onGoing),
      color: 'warning',
      title: 'onGoing',
      icon: <Icon icon='material-symbols:change-circle' />,
    },
    {
      stats: formatter(counts.hold),
      color: 'secondary',
      title: 'Paused',
      icon: <Icon icon='mdi:clock-time-four' />,
    },
    {
      color: 'success',
      stats: formatter(counts.done),
      title: 'Fulfilled',
      icon: <Icon icon='material-symbols:check-circle-outline' />,
    },
  ]

  const renderStats = () => {
    return recruitingData.map((data: RecruitingData, index: number) => (
      <Grid item xs={12} sm={4} key={index}>
        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar
            skin='light'
            variant='rounded'
            color={data.color}
            sx={{ mr: 4 }}
          >
            {data.icon}
          </CustomAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h6' sx={{ fontWeight: 600 }}>
              {data.stats}
            </Typography>
            <Typography variant='caption'>{data.title}</Typography>
          </Box>
        </Box>
      </Grid>
    ))
  }

  return (
    <>
      <Grid item xs={12} sm={12} md={3}>
        <CardNormal
          data={{
            stats: formatter(counts.total),
            title: 'Total recruiting',
            titleColor: '#64C623',

            src: '/images/cards/card-stats-img-4.png',
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Card>
          <CardHeader
            sx={{ pb: 3.25 }}
            title='Recruiting info'
            titleTypographyProps={{ variant: 'h6' }}
          />
          <CardContent>
            <Grid container spacing={6}>
              {renderStats()}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={12} md={3}>
        <CardNormal
          data={{
            stats: '',
            title: '',
            titleColor: '',
            src: '/images/cards/illustration-john-light.png',
          }}
        />
      </Grid>
    </>
  )
}
