import { PermIdentityOutlined, TrendingUp } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import React from 'react'
import { ChartBoxIcon } from '@src/views/dashboard/dashboardItem'

const jobOverview = [
  {
    key: 'jobRequest',
    label: 'Job requests',
    color: '102, 108, 255',
    icon: PermIdentityOutlined,
  },
  {
    key: 'jobsInProgress',
    label: 'Jobs in progress',
    color: '38, 198, 249',
    icon: TrendingUp,
  },
]

const JobList = () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      gap='10px'
      component='ul'
      sx={{
        height: '100%',
        listStyle: 'none',
        padding: 0,
        position: 'relative',
        marginTop: '20px',
      }}
    >
      {jobOverview.map((item, index) => {
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
                5
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
          width: '261px',
          left: '-10px',
          bottom: '30px',
        }}
      />
    </Box>
  )
}

export default JobList
