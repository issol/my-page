import Grid from '@mui/material/Grid'
import {
  GridItem,
  SectionTitle,
  SubDateDescription,
  Title,
} from '@src/views/dashboard/dashboardItem'
import { Box, Stack } from '@mui/material'
import dayjs from 'dayjs'
import { FormProvider, useWatch } from 'react-hook-form'
import React from 'react'
import ApexChartWrapper from '@src/@core/styles/libs/react-apexcharts'

import weekday from 'dayjs/plugin/weekday'
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
import Information from '@src/views/dashboard/dialog/information'

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
    if (dateType === 'month') return dayjs(date).get(dateType) + 1
    return dayjs(date).get(dateType)
  }

  return (
    <FormProvider {...props} setValue={setValue} control={control}>
      <ApexChartWrapper>
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
            padding: '10px',
          }}
        >
          <Grid container gap='24px'>
            <GridItem width={265} height={387}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Title
                  title='Job overview'
                  openDialog={setOpenInfoDialog}
                  handleClick={() => router.push('/jobs/')}
                />
                <JobList />
              </Box>
            </GridItem>
            <GridItem sm height={387} padding='0px'>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Title padding='20px' title='Upcoming deadlines' />
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
                setOpenInfoDialog={setOpenInfoDialog}
                dateRange={dateRange || [new Date(), new Date()]}
              />
            </GridItem>
            <Doughnut<ServiceRatioItem>
              title='Completed deliveries'
              subTitle={`Based On ${getProDateFormat(
                getDate('year'),
                getDate('month'),
              )}`}
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
          <Grid display='flex' container>
            <Grid
              container
              item
              xs={6}
              gap='24px'
              sx={{ paddingRight: '24px' }}
            >
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

            <Grid container item xs={6}>
              <GridItem height={392}>
                <Box sx={{ width: '100%', height: '100%' }}>
                  <Title
                    title='Invoice overview'
                    marginBottom='20px'
                    subTitle={getProDateFormat(
                      getDate('year'),
                      getDate('month'),
                    )}
                    openDialog={setOpenInfoDialog}
                  />
                  <InvoiceTab
                    year={getDate('year')}
                    month={getDate('month') + 1}
                  />
                </Box>
              </GridItem>
            </Grid>
          </Grid>

          <Grid container gap='24px'>
            <GridItem sm height={223} padding='0px'>
              <Box
                display='flex'
                alignItems='center'
                justifyContent='center'
                sx={{ width: '100%', height: '100%', overflow: 'hidden' }}
              >
                <img
                  style={{ width: '110%' }}
                  alt='empty_imgage'
                  src='/images/dashboard/img_montly.png'
                />
              </Box>
            </GridItem>
            <GridItem xs={6} height={223}>
              <Deadline year={getDate('year')} month={getDate('month')} />
            </GridItem>
          </Grid>
          <Grid container>
            <ProCalendar year={getDate('year')} month={getDate('month')} />
          </Grid>
        </Grid>
        <Information
          open={isShowInfoDialog}
          keyName={infoDialogKey}
          infoType='PRO'
          close={close}
        />
      </ApexChartWrapper>
    </FormProvider>
  )
}

export default ProDashboards

ProDashboards.acl = {
  action: 'read',
  subject: 'client',
}
