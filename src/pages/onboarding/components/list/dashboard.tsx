import { Card, Grid } from '@mui/material'
import { Box } from '@mui/system'
import Link from 'next/link'

import styled from 'styled-components'
import CardNormal from 'src/@core/components/card-statistics/card-normal'

import Overview from 'src/@core/components/card-statistics/card-overview'
export default function OnboardingDashboard() {
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
        <Grid item xs={12} sm={9} md={5.5}>
          <Overview />
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
                href='/onboarding/contract-forms'
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
