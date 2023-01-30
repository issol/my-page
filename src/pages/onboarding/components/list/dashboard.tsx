import { Card, CardHeader, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Link from 'next/link'
import PageHeader from 'src/@core/components/page-header'
import styled from 'styled-components'

export default function OnboardingDashboard() {
  return (
    <Grid item xs={12}>
      <Grid container spacing={6}>
        <Grid item xs={2.5}>
          <Card>
            <Grid container sx={{ padding: '10px 10px 0' }} height={135}>
              <Grid item xs={6}>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <BoxTitle color='blue'>Total Pros</BoxTitle>
                    <Number>10,000</Number>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    width={99}
                    height={135}
                    alt='add-role'
                    src='/images/cards/card-stats-img-1.png'
                  />
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={2.5}>
          <Card>
            <Grid container sx={{ padding: '10px 10px 0' }} height={135}>
              <Grid item xs={6}>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <BoxTitle color='green'>New Pros</BoxTitle>
                    <Number>10,000</Number>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    width={85}
                    height={135}
                    alt='add-role'
                    src='/images/cards/card-stats-img-2.png'
                  />
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={5.5}>
          <Card>
            <CardHeader title='Onboarding status' />
            <Grid container sx={{ padding: '0 20px 20px' }}>
              <Grid container xs={12}>
                <Grid item xs={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      width={40}
                      height={40}
                      src='/images/icons/etc/icon-round-3.png'
                      alt=''
                      aria-hidden
                    />
                    <Box>
                      <SmallNumber>500</SmallNumber>
                      <Typography variant='body2'>Onboarded</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      width={40}
                      height={40}
                      src='/images/icons/etc/icon-round-1.png'
                      alt=''
                      aria-hidden
                    />
                    <Box>
                      <SmallNumber>500</SmallNumber>
                      <Typography variant='body2'>Testing</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      width={40}
                      height={40}
                      src='/images/icons/etc/icon-round-2.png'
                      alt=''
                      aria-hidden
                    />
                    <Box>
                      <SmallNumber>500</SmallNumber>
                      <Typography variant='body2'>Waiting</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={1.5} height={135}>
          <Card>
            <Box
              sx={{
                padding: '12px 10px 19px',
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
                style={{ fontSize: '0.813rem', color: '#6D788D' }}
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

const BoxTitle = styled.p<{ color: 'blue' | 'green' }>`
  margin: 0;
  font-weight: 600;
  font-size: 1rem;
  color: ${({ color }) => (color === 'blue' ? '#666CFF' : '#64C623')};
`

const Number = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 1.5rem;
  color: rgba(76, 78, 100, 0.87);
`
const SmallNumber = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.2;
  color: rgba(76, 78, 100, 0.87);
`
