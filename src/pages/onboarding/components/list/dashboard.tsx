import { Card, Grid } from '@mui/material'
import { Box } from '@mui/system'
import Link from 'next/link'

import styled from '@emotion/styled'
import CardNormal from 'src/@core/components/card-statistics/card-normal'

import Overview from 'src/@core/components/card-statistics/card-overview'

import logger from '@src/@core/utils/logger'
type Props = {
  totalStatistics: { todayRegisteredUser: number; totalUser: number }
  onboardingStatistic: { onboarded: number; testing: number; waiting: number }
}
export default function OnboardingDashboard({
  totalStatistics,
  onboardingStatistic,
}: Props) {
  logger.debug(totalStatistics)
  logger.debug(onboardingStatistic)

  return (
    <Grid item xs={12}>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12} sm={6} md={2.5}>
          <CardNormal
            data={{
              stats: `${totalStatistics.totalUser.toLocaleString()}`,
              title: 'Total Pros',
              titleColor: '#666CFF',

              src: '/images/cards/card-stats-img-1.png',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.5}>
          <CardNormal
            data={{
              stats: `${totalStatistics.todayRegisteredUser.toLocaleString()}`,
              title: 'New Pros',
              titleColor: '#64C623',
              src: '/images/cards/card-stats-img-2.png',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={9} md={5.5}>
          <Overview onboardingStatistic={onboardingStatistic} />
        </Grid>
        <Grid item xs={12} sm={3} md={1.5}>
          <Card sx={{ padding: '12px 15px' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '135px',
              }}
            >
              <img
                width={79}
                height={79}
                src='/images/icons/file-icons/file-img.png'
                alt=''
                aria-hidden
              />
              <Link
                href='/onboarding/contracts'
                style={{
                  fontSize: '0.813rem',
                  fontWeight: 500,
                  lineHeight: '22px',
                  color: '#6D788D',
                  padding: '4px 9px',
                }}
              >
                Contract forms
              </Link>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )
}
