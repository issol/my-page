import {
  PermIdentityOutlined,
  SvgIconComponent,
  TrendingUp,
} from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import React from 'react'
import { ChartBoxIcon } from '@src/views/dashboard/dashboardItem'
import { useJobOverview } from '@src/queries/dashboard/dashnaord-lpm'
//inProgress
// :
// 0
// requested
// :
// 0
const jobOverview: Record<
  string,
  { label: string; color: string; icon: SvgIconComponent }
> = {
  requested: {
    label: 'Job requests',
    color: '102, 108, 255',
    icon: PermIdentityOutlined,
  },
  inProgress: {
    label: 'Jobs in progress',
    color: '38, 198, 249',
    icon: TrendingUp,
  },
}
const JobList = () => {
  const { data } = useJobOverview()
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
      {Object.entries(data || {}).map(([key, value], index) => {
        return (
          <Box display='flex' gap='16px' component='li' key={`${key}-${index}`}>
            <ChartBoxIcon
              icon={jobOverview[key].icon}
              color={jobOverview[key].color}
            />
            <Box>
              <Typography fontSize='20px' fontWeight={500}>
                {value}
              </Typography>
              <Typography fontSize='14px' color='rgba(76, 78, 100, 0.6)'>
                {jobOverview[key].label}
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
