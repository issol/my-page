import { Box, Divider, Typography } from '@mui/material'

import CustomAvatar from '@src/@core/components/mui/avatar'
import Icon from '@src/@core/components/icon'
import Image from 'next/image'

type Props = {
  totalStatistics: { todayRegisteredUser: number; totalUser: number }
  onboardingStatistic: { onboarded: number; testing: number; waiting: number }
}
const UserStatistic = ({ totalStatistics, onboardingStatistic }: Props) => {
  return (
    <Box sx={{ display: 'flex', width: '100%', gap: '20px' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          alignItems: 'center',
        }}
      >
        <Typography fontSize={16} fontWeight={600} color='#666CFF'>
          Total Pros
        </Typography>
        <Typography fontSize={20} fontWeight={500}>
          {totalStatistics.totalUser.toLocaleString()}
        </Typography>
      </Box>
      <Divider flexItem orientation='vertical' />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography fontSize={16} fontWeight={600} color='#64C623'>
          New Pros
        </Typography>
        <Typography fontSize={20} fontWeight={500}>
          {totalStatistics.todayRegisteredUser.toLocaleString()}
        </Typography>
      </Box>
      <Divider flexItem orientation='vertical' />
      <Box sx={{ display: 'flex', flex: 2, gap: '16px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <CustomAvatar
            skin='light'
            variant='rounded'
            color='primary'
            sx={{ mr: 4 }}
          >
            <Icon icon='mdi:airplane-takeoff' />
          </CustomAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography fontSize={20} fontWeight={500}>
              {onboardingStatistic.onboarded}
            </Typography>
            <Typography
              fontSize={12}
              fontWeight={400}
              color='rgba(76, 78, 100, 0.60)'
            >
              Onboarded
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <CustomAvatar
            skin='light'
            variant='rounded'
            color='primary'
            sx={{ mr: 4 }}
          >
            <Image
              src='/images/icons/onboarding-icons/status-testing.svg'
              alt='testing'
              width={40}
              height={40}
            />
          </CustomAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography fontSize={20} fontWeight={500}>
              {onboardingStatistic.testing}
            </Typography>
            <Typography
              fontSize={12}
              fontWeight={400}
              color='rgba(76, 78, 100, 0.60)'
            >
              Testing
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <CustomAvatar
            skin='light'
            variant='rounded'
            color='primary'
            sx={{ mr: 4 }}
          >
            <Icon icon='mdi:clock-time-four' />
          </CustomAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography fontSize={20} fontWeight={500}>
              {onboardingStatistic.waiting}
            </Typography>
            <Typography
              fontSize={12}
              fontWeight={400}
              color='rgba(76, 78, 100, 0.60)'
            >
              Waiting
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default UserStatistic
