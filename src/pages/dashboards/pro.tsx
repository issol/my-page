import Grid from '@mui/material/Grid'
import { GridItem, Title } from '@src/views/dashboard/dashboardItem'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { FormProvider, useWatch } from 'react-hook-form'
import React, { Suspense, useCallback } from 'react'
import ApexChartWrapper from '@src/@core/styles/libs/react-apexcharts'

import weekday from 'dayjs/plugin/weekday'
import { useRouter } from 'next/router'
import { getProDateFormat } from '@src/views/dashboard/list/currencyByDate'
import InvoiceTab from '@src/views/dashboard/invoiceTab'
import UseDashboardControl from '@src/hooks/useDashboardControl'
import JobList from '@src/views/dashboard/list/job'
import Notice from '@src/views/dashboard/notice'
import Doughnut from '@src/views/dashboard/chart/doughnut'
import { ServiceRatioItem } from '@src/types/dashboard'
import { Colors } from '@src/shared/const/dashboard/chart'
import { getDateFormat } from '@src/pages/dashboards/lpm'
import ProCalendar from '@src/views/dashboard/calendar'
import Deadline from '@src/views/dashboard/deadline'
import Information from '@src/views/dashboard/dialog/information'
import ProChartDate from '@src/views/dashboard/header/proChartDate'
import JobRequest from '@src/views/dashboard/list/jobRequest'
import CurrencyAmount from '@src/views/dashboard/list/currencyAmount'
import FallbackSpinner from '@src/@core/components/spinner'
import { TryAgain } from '@src/views/dashboard/suspense'
import { ErrorBoundary } from 'react-error-boundary'
import UpcomingDeadlines from '@src/views/dashboard/list/upcomingDeadlines'

dayjs.extend(weekday)

const ProDashboards = () => {
  const router = useRouter()
  const { formHook, infoDialog } = UseDashboardControl()
  const { control, setValue, ...props } = formHook
  const { isShowInfoDialog, infoDialogKey, setOpenInfoDialog, close } =
    infoDialog

  const [date] = useWatch({
    control,
    name: ['date', 'userViewDate'],
  })

  const getDate = useCallback(
    (dateType: dayjs.UnitType) => {
      if (dateType === 'month') return dayjs(date).get(dateType) + 1
      return dayjs(date).get(dateType)
    },
    [date],
  )

  return (
    <FormProvider {...props} setValue={setValue} control={control}>
      <ApexChartWrapper>
        <Grid container gap='24px' sx={{ padding: '10px' }}>
          <Notice />
          <Grid
            component='div'
            item
            xs={12}
            sx={{
              position: 'sticky',
              left: 0,
              top: '148px',
              zIndex: 10,
              minWidth: '420px',
            }}
          >
            <ProChartDate />
          </Grid>

          <Grid container gap='24px'>
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
                <UpcomingDeadlines />
              </GridItem>
            </Grid>
            <Grid container gap='24px'>
              <GridItem sm height={490} padding='0px'>
                <JobRequest
                  setOpenInfoDialog={setOpenInfoDialog}
                  year={getDate('year')}
                  month={getDate('month')}
                />
              </GridItem>
              <Doughnut<ServiceRatioItem>
                title='Completed deliveries'
                overlayTitle='There are no deliveries'
                subTitle={`Based On ${getProDateFormat(
                  getDate('year'),
                  getDate('month'),
                )}`}
                height={490}
                from={getDateFormat(date || new Date())}
                to={getDateFormat(date || new Date())}
                type='category'
                colors={Colors}
                getName={item => {
                  return `${item?.serviceType || '-'}`
                }}
                isHiddenValue={true}
                path={`job/ratio/service-type?month=${getDate(
                  'month',
                )}&year=${getDate('year')}`}
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
                    setOpenInfoDialog={setOpenInfoDialog}
                  />
                </GridItem>
                <GridItem height={184}>
                  <CurrencyAmount
                    title='Payment amount'
                    amountType='payment'
                    year={getDate('year')}
                    month={getDate('month')}
                    setOpenInfoDialog={setOpenInfoDialog}
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
                    <Suspense fallback={<FallbackSpinner />}>
                      <ErrorBoundary
                        fallback={
                          <TryAgain refreshDataQueryKey='InvoiceOverview' />
                        }
                      >
                        <InvoiceTab
                          year={getDate('year')}
                          month={getDate('month')}
                        />
                      </ErrorBoundary>
                    </Suspense>
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
        </Grid>
      </ApexChartWrapper>
    </FormProvider>
  )
}

export default ProDashboards

ProDashboards.acl = {
  action: 'read',
  subject: 'dashboard_PRO',
}
