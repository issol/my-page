import Card from '@mui/material/Card'

import CardContent from '@mui/material/CardContent'

import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

import { v4 as uuidv4 } from 'uuid'
import CustomPagination from 'src/pages/components/custom-pagination'
import { AppliedRoleType } from 'src/types/onboarding/details'
import NoList from '@src/pages/components/no-list'

type Props = {
  userInfo: Array<AppliedRoleType>
  page: number
  offset: number
  rowsPerPage: number
  handleChangePage: (direction: string) => void
}

export default function MyRoles({
  userInfo,
  page,
  offset,
  rowsPerPage,
  handleChangePage,
}: Props) {
  return (
    <Card
      sx={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        height: '100%',
      }}
    >
      <Typography
        variant='h6'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box display='flex' gap='16px' alignItems='center'>
          My role
        </Box>
      </Typography>
      {userInfo && userInfo.length ? (
        <Box sx={{ minHeight: 22 }}>
          <Grid container spacing={6} xs={12}>
            {userInfo && userInfo.length
              ? userInfo
                  .filter(item => item.requestStatus === 'Certified')
                  .slice(offset, offset + rowsPerPage)
                  .map(value => {
                    return (
                      <Grid item lg={6} md={12} sm={12} xs={12} key={uuidv4()}>
                        <Card
                          sx={{
                            padding: '20px',
                            height: '100%',
                            flex: 1,
                            border: '2px solid rgba(76, 78, 100, 0.12)',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box>
                              <Typography
                                variant='subtitle1'
                                sx={{ fontWeight: 600, lineHeight: '24px' }}
                              >
                                {value.jobType}
                              </Typography>
                              <Typography
                                variant='subtitle1'
                                sx={{ fontWeight: 600 }}
                              >
                                {value.role}
                              </Typography>
                            </Box>
                          </Box>
                          <CardContent
                            sx={{
                              padding: 0,
                              paddingTop: '10px',
                              paddingBottom: '0 !important',
                            }}
                          >
                            <Typography
                              variant='subtitle2'
                              sx={{
                                fontWeight: 600,
                                minHeight: '20px',

                                lineHeight: '20px',

                                letterSpacing: ' 0.15px',
                              }}
                            >
                              {value.source &&
                              value.target &&
                              value.source !== '' &&
                              value.target !== '' ? (
                                <>
                                  {value.source.toUpperCase()} &rarr;{' '}
                                  {value.target.toUpperCase()}
                                </>
                              ) : (
                                ''
                              )}
                            </Typography>
                            <Grid item display='flex' gap='16px' mt={'17px'}>
                              <Button
                                sx={{
                                  display: 'flex',
                                  gap: '8px',
                                  cursor: 'unset',
                                  width: '100%',
                                  justifyContent: 'flex-start',
                                  paddingLeft: 0,
                                }}
                                disabled
                              >
                                <img
                                  src='/images/icons/onboarding-icons/certified-role.svg'
                                  alt='certified'
                                />
                                <Typography
                                  variant='subtitle1'
                                  sx={{ fontWeight: 600 }}
                                >
                                  Certified
                                </Typography>
                              </Button>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    )
                  })
              : null}
            {userInfo &&
            userInfo.filter(item => item.requestStatus === 'Certified')
              .length ? (
              <Grid item xs={12}>
                <CustomPagination
                  listCount={userInfo.filter(info => info.requestStatus === 'Certified').length}
                  page={page}
                  handleChangePage={handleChangePage}
                  rowsPerPage={rowsPerPage}
                />
              </Grid>
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography variant='subtitle2' fontSize={14} fontWeight={400}>
                  No certified role
                </Typography>
              </Box>
            )}
          </Grid>
        </Box>
      ) : null}
    </Card>
  )
}
