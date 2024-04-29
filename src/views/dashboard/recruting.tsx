import { Box, Divider, Typography } from '@mui/material'
import CustomAvatar from '@src/@core/components/mui/avatar'
import Icon from '@src/@core/components/icon'
import Image from 'next/image'
import { RecruitingCountType } from '@src/apis/recruiting.api'

type Props = {
  recruitingData: RecruitingCountType
}

const RecruitingStatistic = ({ recruitingData }: Props) => {
  return (
    <Box sx={{ display: 'flex', width: '100%', gap: '20px' }}>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography fontSize={16} fontWeight={600} color='#666CFF'>
          Total recruiting
        </Typography>
        <Typography fontSize={24} fontWeight={500}>
          {recruitingData.total.toLocaleString()}
        </Typography>
      </Box>
      <Divider flexItem orientation='vertical' />

      <Box sx={{ display: 'flex', flex: 3.1, gap: '16px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <CustomAvatar
            skin='light'
            variant='rounded'
            color='warning'
            sx={{ mr: 4 }}
          >
            <Icon icon='material-symbols:change-circle' />
          </CustomAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography fontSize={20} fontWeight={500}>
              {recruitingData.onGoing}
            </Typography>
            <Typography
              fontSize={12}
              fontWeight={400}
              color='rgba(76, 78, 100, 0.60)'
            >
              Ongoing
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <CustomAvatar
            skin='light'
            variant='rounded'
            color='secondary'
            sx={{ mr: 4 }}
          >
            <Icon icon='mdi:clock-time-four' />
          </CustomAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography fontSize={20} fontWeight={500}>
              {recruitingData.hold}
            </Typography>
            <Typography
              fontSize={12}
              fontWeight={400}
              color='rgba(76, 78, 100, 0.60)'
            >
              Paused
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <CustomAvatar
            skin='light'
            variant='rounded'
            color='success'
            sx={{ mr: 4 }}
          >
            <Icon icon='material-symbols:check-circle-outline' />
          </CustomAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography fontSize={20} fontWeight={500}>
              {recruitingData.done}
            </Typography>
            <Typography
              fontSize={12}
              fontWeight={400}
              color='rgba(76, 78, 100, 0.60)'
            >
              Fulfilled
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
export default RecruitingStatistic
