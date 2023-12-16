import Grid from '@mui/material/Grid'
import {
  GridItem,
  SectionTitle,
  SubDateDescription,
} from '@src/views/dashboard/dashboardItem'
import { Box, Stack } from '@mui/material'
import dayjs from 'dayjs'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { FormProvider, useWatch } from 'react-hook-form'
import React from 'react'
import ApexChartWrapper from '@src/@core/styles/libs/react-apexcharts'

import weekday from 'dayjs/plugin/weekday'
import { KeyboardArrowRight } from '@mui/icons-material'
import { upcomingColumns } from '@src/shared/const/columns/dashboard'
import { useRouter } from 'next/router'
import { DataGrid } from '@mui/x-data-grid'
import {
  CurrencyAmount,
  getProDateFormat,
} from '@src/views/dashboard/list/currencyByDate'
import InvoiceTab from '@src/views/dashboard/invoiceTab'
import ChartDateHeader from '@src/views/dashboard/header/chartDateHeader'
import UseDashboardControl from '@src/hooks/useDashboardControl'
import JobList from '@src/views/dashboard/list/job'
import Notice from '@src/views/dashboard/notice'
import { useUpcomingDeadline } from '@src/queries/dashboard/dashnaord-lpm'
import Expectedincome from '@src/views/dashboard/list/expectedIncome'
import Doughnut from '@src/views/dashboard/chart/doughnut'
import { ServiceRatioItem } from '@src/types/dashboard'
import { Colors } from '@src/shared/const/dashboard/chart'
import { getDateFormat } from '@src/pages/dashboards/lpm'
import ProCalendar from '@src/views/dashboard/calendar'
import Deadline from '@src/views/dashboard/deadline'

dayjs.extend(weekday)

const ProDashboards = () => {
  const router = useRouter()
  const { formHook, infoDialog } = UseDashboardControl()
  const { control, setValue, ...props } = formHook
  const { isShowInfoDialog, infoDialogKey, setOpenInfoDialog, close } =
    infoDialog

  const [dateRange, userViewDate] = useWatch({
    control,
    name: ['dateRange', 'userViewDate'],
  })

  const { data: upcomingData } = useUpcomingDeadline()

  const getDate = (dateType: dayjs.UnitType) => {
    const date = (dateRange && dateRange[0]) || new Date()
    return dayjs(date).get(dateType)
  }

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
                        There are no deadlines
                      </Stack>
                    ),
                  }}
                  rows={upcomingData || []}
                  columns={upcomingColumns}
                  disableSelectionOnClick
                  pagination={undefined}
                />
              </Box>
            </GridItem>
          </Grid>
          <Grid container gap='24px'>
            <GridItem sm height={490} padding='0px'>
              <Expectedincome
                dateRange={dateRange || [new Date(), new Date()]}
              />
            </GridItem>
            <Doughnut<ServiceRatioItem>
              title='Completed deliveries'
              subTitle='Based on March 1 - 31, 2023'
              height={490}
              from={getDateFormat(
                (Array.isArray(dateRange) && dateRange[0]) || null,
              )}
              to={getDateFormat(
                (Array.isArray(dateRange) && dateRange[1]) || null,
              )}
              type='category'
              colors={Colors}
              getName={item => {
                return `${item?.serviceType || '-'}`
              }}
              isHiddenValue={true}
              path={`job/ratio/service-type?month=${
                getDate('month') + 1
              }&year=${getDate('year')}`}
              setOpenInfoDialog={setOpenInfoDialog}
            />
          </Grid>
          <Grid container gap='24px'>
            <Grid container item xs={6} gap='24px'>
              <GridItem height={184}>
                <CurrencyAmount
                  title='Invoiced amount'
                  amountType='invoiced'
                  year={getDate('year')}
                  month={getDate('month')}
                />
              </GridItem>
              <GridItem height={184}>
                <CurrencyAmount
                  title='Payment amount'
                  amountType='payment'
                  year={getDate('year')}
                  month={getDate('month')}
                />
              </GridItem>
            </Grid>

            <GridItem sm height={392}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Box sx={{ marginBottom: '20px' }}>
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
                    {getProDateFormat(getDate('year'), getDate('month'))}
                  </SubDateDescription>
                </Box>
                <InvoiceTab
                  year={getDate('year')}
                  month={getDate('month') + 1}
                />
              </Box>
            </GridItem>
          </Grid>
          <Grid container gap='24px'>
            <GridItem xs={6} height={223}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Box>
                  <SectionTitle>
                    <span className='title'>Monthly task output (0)</span>
                  </SectionTitle>
                  <SubDateDescription textAlign='left'>
                    {getProDateFormat(getDate('year'), getDate('month'))}
                  </SubDateDescription>
                </Box>
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                  sx={{
                    width: '100%',
                    height: '70%',
                    fontSize: '14px',
                    color: '#4C4E6499',
                  }}
                >
                  There are no task output
                </Box>
              </Box>
            </GridItem>
            <GridItem sm height={223}>
              <Deadline year={getDate('year')} month={getDate('month')} />
            </GridItem>
          </Grid>
          <Grid container>
            <GridItem height={876} sm padding='0 0 20px'>
              <ProCalendar year={getDate('year')} month={getDate('month')} />
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
