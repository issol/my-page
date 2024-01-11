import React from 'react'
import { Box } from '@mui/material'
import {
  ChartBoxIcon,
  SectionTitle,
  SubDateDescription,
} from '@src/views/dashboard/dashboardItem'
import { CheckCircleSharp, WatchLaterRounded } from '@mui/icons-material'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { useDeadlineCompliance } from '@src/queries/dashnaord.query'
import { TotalAmountQuery } from '@src/types/dashboard'
import { getProDateFormat } from '@src/views/dashboard/list/currencyByDate'

const Deadline = (params: Omit<TotalAmountQuery, 'amountType'>) => {
  const { data } = useDeadlineCompliance(params)

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box>
        <SectionTitle>
          <span className='title'>Deadline compliance</span>
        </SectionTitle>
        <SubDateDescription textAlign='left'>
          {getProDateFormat(params.year, params.month)}
        </SubDateDescription>
      </Box>
      <Box
        display='flex'
        flexDirection='column'
        gap='20px'
        sx={{ marginTop: '20px' }}
      >
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box display='flex' alignItems='center' gap='16px'>
            <ChartBoxIcon
              icon={CheckCircleSharp}
              boxSize='40px'
              color='114, 225, 40'
            />

            <Box display='flex' flexDirection='column'>
              <Typography fontSize='12px' color='rgba(76, 78, 100, 0.6)'>
                Timely delivery
                <Chip
                  label={`${data?.onTimeRatio || '0.0'}%`}
                  sx={{
                    height: '20px',
                    backgroundColor: 'rgba(114, 225, 40, 0.1)',
                    color: 'rgba(114, 225, 40, 1)',
                    marginLeft: '10px',
                    fontSize: '12px',
                  }}
                />
              </Typography>
              <Typography
                fontSize='16px'
                fontWeight={600}
                color='rgba(76, 78, 100, 0.87)'
                sx={{ marginTop: '-2px' }}
              >
                {data?.onTimeCount || 0}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography fontSize='12px'>
              Average early submission time
            </Typography>
            <Typography
              align='right'
              fontSize='12px'
              color='rgba(100, 198, 35, 1)'
            >
              {data?.onTimeAverage?.days || 0} day(s){' '}
              {data?.onTimeAverage?.hours || 0} hour(s){' '}
              {data?.onTimeAverage?.minutes || 0} min(s)
            </Typography>
          </Box>
        </Box>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box display='flex' alignItems='center' gap='16px'>
            <ChartBoxIcon
              icon={WatchLaterRounded}
              boxSize='40px'
              color='224, 68, 64'
            />

            <Box display='flex' flexDirection='column'>
              <Typography fontSize='12px' color='rgba(76, 78, 100, 0.6)'>
                Late delivery
                <Chip
                  label={`${data?.delayedRatio || '0.0'}%`}
                  sx={{
                    height: '20px',
                    backgroundColor: 'rgba(224, 68, 64, 0.1)',
                    color: 'rgba(224, 68, 64, 1)',
                    marginLeft: '10px',
                    fontSize: '12px',
                  }}
                />
              </Typography>
              <Typography
                fontSize='16px'
                fontWeight={600}
                color='rgba(76, 78, 100, 0.87)'
                sx={{ marginTop: '-2px' }}
              >
                {data?.delayedCount || 0}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography fontSize='12px'>
              Average late submission time
            </Typography>
            <Typography
              align='right'
              fontSize='12px'
              color='rgba(255, 77, 73, 1)'
            >
              {data?.delayedAverage?.days || 0} day(s){' '}
              {data?.delayedAverage?.hours || 0} hour(s){' '}
              {data?.delayedAverage?.minutes || 0} min(s)
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Deadline
