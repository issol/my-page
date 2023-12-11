import {
  PermIdentityOutlined,
  TrendingDown,
  TrendingUp,
} from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import React from 'react'
import { ChartBoxIcon } from '@src/views/dashboard/dashboardItem'
import {
  OverviewType,
  useTADOnboarding,
} from '@src/queries/dashboard/dashnaord-lpm'

const overview: Array<{
  key: OverviewType
  label: string
  color: string
  icon: SVGElement
}> = [
  {
    key: 'onboardedPros',
    label: 'Onboarded Pros',
    color: '102, 108, 255',
    icon: PermIdentityOutlined,
  },
  {
    key: 'onboardingInProgress',
    label: 'Onboarding in progress',
    color: '38, 198, 249',
    icon: TrendingUp,
  },
  {
    key: 'failedPros',
    label: 'Failed Pros',
    color: '255, 77, 73',
    icon: TrendingDown,
  },
]

const OnboardingList = () => {
  const { data } = useTADOnboarding()

  return (
    <Box
      display='flex'
      flexDirection='column'
      gap='10px'
      component='ul'
      sx={{
        listStyle: 'none',
        padding: 0,
        position: 'relative',
      }}
    >
      {overview.map((item, index) => {
        return (
          <Box
            display='flex'
            gap='16px'
            component='li'
            key={`${item.label}-${index}`}
          >
            <ChartBoxIcon icon={item.icon} color={item.color} />
            <Box>
              <Typography fontSize='20px' fontWeight={500}>
                {(data && data[item.key]) || 0}
              </Typography>
              <Typography fontSize='14px' color='rgba(76, 78, 100, 0.6)'>
                {item.label}
              </Typography>
            </Box>
          </Box>
        )
      })}
      <img
        src='/images/dashboard/img_tad_view.png'
        alt='배경이미지'
        style={{
          position: 'absolute',
          width: '246px',
          right: '-20px',
          bottom: '-20px',
          opacity: 0.8,
        }}
      />
    </Box>
  )
}

export default OnboardingList
