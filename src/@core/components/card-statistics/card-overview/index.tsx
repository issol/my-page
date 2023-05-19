// ** React Imports
import { ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

type Props = {
  onboardingStatistic: { onboarded: number; testing: number; waiting: number }
}

interface DataType {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement
}

// const salesData: DataType[] = [
//   {
//     stats: 900,
//     color: 'primary',
//     title: 'Onboarded',
//     icon: <Icon icon='mdi:airplane-takeoff' />,
//   },
//   {
//     stats: 102,
//     color: 'warning',
//     title: 'Testing',
//     icon: <Icon icon='mdi:poll' />,
//   },
//   {
//     color: 'info',
//     stats: 300,
//     title: 'Waiting',
//     icon: <Icon icon='mdi:clock-time-four' />,
//   },
// ]

const renderStats = (data: DataType[]) => {
  return data.map((value: DataType, index: number) => (
    <Grid item xs={12} sm={4} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar
          skin='light'
          variant='rounded'
          color={value.color}
          sx={{ mr: 4 }}
        >
          {value.icon}
        </CustomAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            {value.stats}
          </Typography>
          <Typography variant='caption' sx={{ textTransform: 'capitalize' }}>
            {value.title}
          </Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const Overview = ({ onboardingStatistic }: Props) => {
  const data: DataType[] = Object.entries(onboardingStatistic).map(
    (key, value) => {
      return {
        stats: `${key[1].toLocaleString()}`,
        color: 'primary',
        title: key[0],
        icon:
          key[0] === 'onboarded' ? (
            <Icon icon='mdi:airplane-takeoff' />
          ) : key[0] === 'testing' ? (
            <img
              src='/images/icons/onboarding-icons/status-testing.svg'
              alt='testing'
            />
          ) : (
            <Icon icon='mdi:clock-time-four' />
          ),
      }
    },
  )

  return (
    <Card>
      <CardHeader
        sx={{ pb: 3.25 }}
        title='Onboarding status'
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <Grid container spacing={6}>
          {renderStats(data)}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Overview
