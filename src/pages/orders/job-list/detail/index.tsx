import { Icon } from '@iconify/react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Tab,
  Typography,
  styled,
} from '@mui/material'
import { ServiceTypeChip } from '@src/@core/components/chips/chips'
import { useGetJobInfo, useGetJobPrices } from '@src/queries/order/job.query'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState, MouseEvent, SyntheticEvent } from 'react'
import AssignPro from './components/assign-pro'

type MenuType = 'info' | 'prices' | 'assign' | 'history'

const JobDetail = () => {
  const router = useRouter()
  const menuQuery = router.query.menu as MenuType
  const jobId = router.query.jobId as string
  const [value, setValue] = useState<MenuType>('info')

  const { data: jobInfo, isLoading } = useGetJobInfo(Number(jobId), false)
  const { data: jobPrices } = useGetJobPrices(Number(jobId), false)

  const handleChange = (event: SyntheticEvent, newValue: MenuType) => {
    setValue(newValue)
  }

  useEffect(() => {
    if (
      menuQuery &&
      ['info', 'prices', 'assign', 'history'].includes(menuQuery)
    ) {
      setValue(menuQuery)
    }
  }, [menuQuery])

  return (
    <Card sx={{ height: '100%' }}>
      <Grid container sx={{ height: '100%' }}>
        <Grid item xs={1.584} sx={{ height: '100%' }}>
          <Box
            sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <Box
              sx={{
                padding: '20px',
                height: '64px',
                borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
              }}
            >
              <IconButton
                sx={{
                  padding: '0 !important',
                  height: '24px',
                }}
                onClick={() => router.push('/orders/order-list')}
              >
                <Icon icon='mdi:chevron-left' width={24} height={24} />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',

                height: '100%',
                borderRight: '1px solid rgba(76, 78, 100, 0.12)',
              }}
            >
              {Array.from({ length: 5 }).map((_, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      padding: '20px',
                    }}
                  >
                    <Typography fontSize={14}>TRA-00{index}</Typography>
                    <ServiceTypeChip label='Audio Description' />
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={
            jobInfo &&
            jobPrices &&
            (jobInfo.name === null || jobPrices.priceId === null)
              ? 10.416
              : 7.632
          }
          sx={{ height: '100%' }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              borderRight: '1px solid rgba(76, 78, 100, 0.12)',
            }}
          >
            <TabContext value={value}>
              <TabList
                onChange={handleChange}
                aria-label='Order detail Tab menu'
                sx={{
                  minHeight: '64px',
                  height: '64px',
                  paddingLeft: '20px',
                  borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
                  display: 'flex',
                  alignItems: 'end',
                }}
              >
                <CustomTab
                  value='info'
                  label='Job info'
                  iconPosition='start'
                  icon={
                    <Icon icon='iconoir:large-suitcase' fontSize={'18px'} />
                  }
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                />

                <CustomTab
                  value='prices'
                  label='Prices'
                  iconPosition='start'
                  icon={<Icon icon='mdi:dollar' fontSize={'18px'} />}
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                />
                <CustomTab
                  value='assign'
                  label='Assign pro'
                  iconPosition='start'
                  icon={<Icon icon='mdi:account-outline' fontSize={'18px'} />}
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                />

                <CustomTab
                  value='history'
                  label='Request history'
                  iconPosition='start'
                  icon={<Icon icon='ic:outline-history' fontSize={'18px'} />}
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                />
              </TabList>
              <TabPanel value='info' sx={{ height: '100%' }}>
                123
              </TabPanel>
              <TabPanel value='prices' sx={{ height: '100%' }}>
                123
              </TabPanel>
              <TabPanel value='assign' sx={{ height: '100%', padding: 0 }}>
                {jobInfo &&
                jobPrices &&
                (jobInfo.name === null || jobPrices.priceId === null) ? (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Image
                        src='/images/icons/job-icons/required-lock.png'
                        alt='lock'
                        width={150}
                        height={150}
                        quality={100}
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          mt: '10px',
                        }}
                      >
                        <Typography fontSize={20} fontWeight={500}>
                          Unfilled required field exists
                        </Typography>
                        <Typography fontSize={16} color='#8D8E9A'>
                          Please enter all required fields first
                        </Typography>
                      </Box>
                      <Button variant='contained' sx={{ mt: '32px' }}>
                        {!jobInfo.name
                          ? 'Fill out job info'
                          : !jobPrices.priceId
                            ? 'Fill out prices'
                            : 'Fill out job info'}
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <AssignPro jobInfo={jobInfo!} />
                )}
              </TabPanel>
              <TabPanel value='history' sx={{ height: '100%' }}>
                123123
              </TabPanel>
            </TabContext>
          </Box>
        </Grid>
        {jobInfo &&
        jobPrices &&
        (jobInfo.name === null || jobPrices.priceId === null) ? (
          <Grid item xs={2.784} sx={{}}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative',
                paddingBottom: '156px',
              }}
            >
              <Box
                sx={{
                  padding: '20px',
                  height: '64px',
                  borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
                }}
              ></Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',

                    height: '100%',
                    flexDirection: 'column',
                  }}
                >
                  <Typography
                    sx={{ padding: '20px' }}
                    fontSize={14}
                    fontWeight={500}
                  >
                    Selected Pros (0)
                  </Typography>
                </Box>
                <Box
                  sx={{
                    padding: '32px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    height: '156px',
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                  }}
                >
                  <Button variant='outlined'>Request</Button>
                  <Button variant='contained'>Assign</Button>
                </Box>
              </Box>
            </Box>
          </Grid>
        ) : (
          <Grid item xs={2.784} sx={{}}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative',
                paddingBottom: '156px',
              }}
            >
              <Box
                sx={{
                  padding: '20px',
                  height: '64px',
                  borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
                }}
              ></Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',

                    height: '100%',
                    flexDirection: 'column',
                  }}
                >
                  <Typography
                    sx={{ padding: '20px' }}
                    fontSize={14}
                    fontWeight={500}
                  >
                    Selected Pros (0)
                  </Typography>
                </Box>
                <Box
                  sx={{
                    padding: '32px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    height: '156px',
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                  }}
                >
                  <Button variant='outlined'>Request</Button>
                  <Button variant='contained'>Assign</Button>
                </Box>
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Card>
  )
}

export default JobDetail

JobDetail.acl = {
  subject: 'job_list',
  action: 'read',
}

const CustomTab = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
