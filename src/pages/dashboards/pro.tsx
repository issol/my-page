import Grid from '@mui/material/Grid'
import {
  ChartBoxIcon,
  GridItem,
  SectionTitle,
  SubDateDescription,
} from '@src/views/dashboard/dashboardItem'
import { Box, Stack } from '@mui/material'
import dayjs from 'dayjs'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Typography from '@mui/material/Typography'
import { FormProvider } from 'react-hook-form'
import React from 'react'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

import weekday from 'dayjs/plugin/weekday'
import {
  CheckCircleSharp,
  KeyboardArrowRight,
  WatchLaterRounded,
} from '@mui/icons-material'
import { upcomingColumns } from '@src/shared/const/columns/dashboard'
import { useRouter } from 'next/router'
import { DataGrid } from '@mui/x-data-grid'

import Switch from '@mui/material/Switch'
import CurrencyByDateList, {
  CurrencyAmount,
} from '@src/views/dashboard/list/currencyByDate'
import InvoiceTab from '@src/views/dashboard/invoiceTab'
import Chip from '@mui/material/Chip'
import ChartDateHeader from '@src/views/dashboard/header/chartDateHeader'
import UseDashboardControl from '@src/hooks/useDashboardControl'
import JobList from '@src/views/dashboard/list/job'
import ProJobRequestBarChart from '@src/views/dashboard/chart/jobRequestBar'
import Notice from '@src/views/dashboard/notice'

dayjs.extend(weekday)

const ProDashboards = () => {
  const router = useRouter()
  const { formHook, infoDialog } = UseDashboardControl()
  const { control, setValue, ...props } = formHook
  const { isShowInfoDialog, infoDialogKey, setOpenInfoDialog, close } =
    infoDialog

  return (
    <FormProvider {...props} setValue={setValue} control={control}>
      <ApexChartWrapper sx={{ overflow: 'scroll' }}>
        <Grid
          container
          gap='24px'
          sx={{ minWidth: '1320px', padding: '10px', overflow: 'auto' }}
        >
          <Notice />
          <ChartDateHeader />
        </Grid>
        <Grid
          container
          gap='24px'
          sx={{
            minWidth: '1320px',
            overflowX: 'auto',
            overFlowY: 'scroll',
            padding: '10px',
          }}
        >
          <Grid container gap='24px'>
            <GridItem width={265} height={387}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Box>
                  <SectionTitle>
                    <span
                      role='button'
                      className='title'
                      onClick={() => router.push('/quotes/lpm/requests/')}
                    >
                      Job overview
                    </span>
                    <ErrorOutlineIcon className='info_icon' />
                    <KeyboardArrowRight className='arrow_icon' />
                  </SectionTitle>
                </Box>
                <JobList />
              </Box>
            </GridItem>
            <GridItem sm height={387} padding='0px'>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Box sx={{ padding: '20px' }}>
                  <SectionTitle>
                    <span role='button' className='title'>
                      Upcoming deadlines
                    </span>
                  </SectionTitle>
                </Box>
                <DataGrid
                  hideFooter
                  components={{
                    NoRowsOverlay: () => (
                      <Stack
                        height='50%'
                        alignItems='center'
                        justifyContent='center'
                      >
                        No rows in DataGrid
                      </Stack>
                    ),
                  }}
                  rows={[
                    {
                      id: 206,
                      corporationId: 'O-000133-DTP-001',
                      orderId: 192,
                      jobName: 'test',
                      dueAt: '2023-11-02T15:00:00.000Z',
                    },
                    {
                      id: 207,
                      corporationId: 'O-000133-DTP-001',
                      orderId: 192,
                      jobName: 'test',
                      dueAt: '2023-11-02T15:00:00.000Z',
                    },
                    {
                      id: 208,
                      corporationId: 'O-000133-DTP-001',
                      orderId: 192,
                      jobName: 'test',
                      dueAt: '2023-11-02T15:00:00.000Z',
                    },
                    {
                      id: 209,
                      corporationId: 'O-000133-DTP-001',
                      orderId: 192,
                      jobName: 'test',
                      dueAt: '2023-11-02T15:00:00.000Z',
                    },
                    {
                      id: 2010,
                      corporationId: 'O-000133-DTP-001',
                      orderId: 192,
                      jobName: 'test',
                      dueAt: '2023-11-02T15:00:00.000Z',
                    },
                  ]}
                  columns={upcomingColumns}
                  disableSelectionOnClick
                  pagination={undefined}
                />
              </Box>
            </GridItem>
          </Grid>
          <Grid container gap='24px'>
            <GridItem xs={6} height={490} padding='0px'>
              <Box display='flex' sx={{ width: '100%', height: '100%' }}>
                <Box sx={{ width: '50%', padding: '20px' }}>
                  <SectionTitle>
                    <span className='title'>Job requests</span>
                    <ErrorOutlineIcon className='info_icon' />
                  </SectionTitle>
                  <SubDateDescription textAlign='left'>
                    Based On March 1 - 31, 2023
                  </SubDateDescription>
                  <ProJobRequestBarChart />
                </Box>
                <Box
                  sx={{
                    width: '50%',
                    borderLeft: '1px solid #d9d9d9',
                    padding: '20px',
                  }}
                >
                  <SectionTitle>
                    <span className='title'>Expected income</span>
                  </SectionTitle>
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='flex-end'
                    gap='4px'
                  >
                    <Typography fontSize='14px' color='#4C4E6499'>
                      Request date
                    </Typography>
                    <Switch
                      size='small'
                      inputProps={{ 'aria-label': 'controlled' }}
                      checked={false}
                      sx={{
                        '.MuiSwitch-switchBase:not(.Mui-checked)': {
                          color: '#666CFF',
                          '.MuiSwitch-thumb': {
                            color: '#666CFF',
                          },
                        },
                        '.MuiSwitch-track': {
                          backgroundColor: '#666CFF',
                        },
                      }}
                    />
                    <Typography fontSize='14px' color='#4C4E6499'>
                      Due date
                    </Typography>
                  </Box>
                  <CurrencyByDateList />
                </Box>
              </Box>
            </GridItem>
            <GridItem sm height={490}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Box>
                  <SectionTitle>
                    <span className='title'>Completed deliveries</span>
                    <ErrorOutlineIcon className='info_icon' />
                  </SectionTitle>
                  <SubDateDescription textAlign='left'>
                    Based On March 1 - 31, 2023
                  </SubDateDescription>
                </Box>
              </Box>
            </GridItem>
          </Grid>
          <Grid container gap='24px'>
            <Grid container item xs={6} gap='24px'>
              <GridItem height={184}>
                <Box sx={{ width: '100%', height: '100%' }}>
                  <Box>
                    <SectionTitle>
                      <span
                        role='button'
                        className='title'
                        onClick={() => router.push('/quotes/lpm/requests/')}
                      >
                        Invoiced amount
                      </span>
                      <ErrorOutlineIcon className='info_icon' />
                      <KeyboardArrowRight className='arrow_icon' />
                    </SectionTitle>
                    <SubDateDescription textAlign='left'>
                      March 1 - 31, 2023
                    </SubDateDescription>
                  </Box>
                  <Box
                    display='flex'
                    alignItems='center'
                    sx={{ padding: '40px 0 ' }}
                  >
                    <CurrencyAmount amounts={[100, 2300, 500, 300]} />
                  </Box>
                </Box>
              </GridItem>
              <GridItem height={184}>
                <Box sx={{ width: '100%', height: '100%' }}>
                  <Box>
                    <SectionTitle>
                      <span
                        role='button'
                        className='title'
                        onClick={() => router.push('/quotes/lpm/requests/')}
                      >
                        Payment amount
                      </span>
                      <ErrorOutlineIcon className='info_icon' />
                      <KeyboardArrowRight className='arrow_icon' />
                    </SectionTitle>
                    <SubDateDescription textAlign='left'>
                      March 1 - 31, 2023
                    </SubDateDescription>
                  </Box>
                  <Box
                    display='flex'
                    alignItems='center'
                    sx={{ padding: '40px 0 ' }}
                  >
                    <CurrencyAmount amounts={[100, 2300, 500, 300]} />
                  </Box>
                </Box>
              </GridItem>
            </Grid>

            <GridItem sm height={392}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Box sx={{ marginBottom: '20p      x' }}>
                  <SectionTitle>
                    <span
                      role='button'
                      className='title'
                      onClick={() => router.push('/quotes/lpm/requests/')}
                    >
                      Invoice overview
                    </span>
                    <ErrorOutlineIcon className='info_icon' />
                    <KeyboardArrowRight className='arrow_icon' />
                  </SectionTitle>
                  <SubDateDescription textAlign='left'>
                    March 1 - 31, 2023
                  </SubDateDescription>
                </Box>
                <InvoiceTab />
              </Box>
            </GridItem>
          </Grid>
          <Grid container gap='24px'>
            <GridItem xs={6} height={223}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Box>
                  <SectionTitle>
                    <span className='title'>Monthly task output (12)</span>
                  </SectionTitle>
                  <SubDateDescription textAlign='left'>
                    March 1 - 31, 2023
                  </SubDateDescription>
                </Box>
              </Box>
            </GridItem>
            <GridItem sm height={223}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Box>
                  <SectionTitle>
                    <span className='title'>Deadline compliance</span>
                  </SectionTitle>
                  <SubDateDescription textAlign='left'>
                    March 1 - 31, 2023
                  </SubDateDescription>
                </Box>
                <Box
                  display='flex'
                  flexDirection='column'
                  gap='20px'
                  sx={{ marginTop: '20px' }}
                >
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                  >
                    <Box display='flex' alignItems='center' gap='16px'>
                      <ChartBoxIcon
                        icon={CheckCircleSharp}
                        boxSize='40px'
                        color='114, 225, 40'
                      />

                      <Box display='flex' flexDirection='column'>
                        <Typography
                          fontSize='12px'
                          color='rgba(76, 78, 100, 0.6)'
                        >
                          Timely delivery
                          <Chip
                            label='78%'
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
                          13
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography fontSize='12px'>
                        Average early submission time
                      </Typography>
                      <Typography fontSize='12px' color='rgba(100, 198, 35, 1)'>
                        01 day(s) 03 hour(s) 23 min(s)
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                  >
                    <Box display='flex' alignItems='center' gap='16px'>
                      <ChartBoxIcon
                        icon={WatchLaterRounded}
                        boxSize='40px'
                        color='224, 68, 64'
                      />

                      <Box display='flex' flexDirection='column'>
                        <Typography
                          fontSize='12px'
                          color='rgba(76, 78, 100, 0.6)'
                        >
                          Late delivery
                          <Chip
                            label='21%'
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
                          13
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography fontSize='12px'>
                        Average late submission time
                      </Typography>
                      <Typography fontSize='12px' color='rgba(255, 77, 73, 1)'>
                        01 day(s) 03 hour(s) 23 min(s)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </GridItem>
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </FormProvider>
  )
}

export default ProDashboards

ProDashboards.acl = {
  action: 'read',
  subject: 'client',
}
