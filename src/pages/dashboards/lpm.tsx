import Grid from '@mui/material/Grid'
import {
  ConvertButtonGroup,
  GridItem,
  ReportItem,
  Title,
  TotalValueView,
} from '@src/views/dashboard/dashboardItem'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { useDashboardReport } from '@src/queries/dashboard/dashnaord-lpm'
import { FormProvider, useWatch } from 'react-hook-form'
import React, { useState } from 'react'
import DashboardDataGrid from '@src/views/dashboard/dataGrid/request'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Custom Components Imports
import DoughnutChart from '@src/views/dashboard/doughnutChart'
import weekday from 'dayjs/plugin/weekday'
import {
  Colors,
  SecondColors,
  Status,
  StatusColor,
} from '@src/shared/const/dashboard/chart'
import {
  CategoryRatioItem,
  Currency,
  ExpertiseRatioItem,
  PairRatioItem,
  ServiceRatioItem,
  ViewMode,
} from '@src/types/dashboard'
import StatusAndList from '@src/views/dashboard/statusAndList'
import { Archive, MonetizationOn } from '@mui/icons-material'
import {
  RequestColumns,
  StatusJobColumns,
  StatusOrderColumns,
} from '@src/shared/const/columns/dashboard'
import { useRouter } from 'next/router'
import InfoDialog from '@src/views/dashboard/infoDialog'
import TotalChart from '@src/views/dashboard/totalChart'
import UseDashboardControl from '@src/hooks/useDashboardControl'
import SwitchTypeHeader from '@src/views/dashboard/header/SwitchType'

dayjs.extend(weekday)

export const getRangeDateTitle = (date1: Date, date2: Date | null) => {
  const title = date2
    ? dayjs(date2).set('date', dayjs(date1).daysInMonth()).format('DD, YYYY ')
    : '-'
  return `${dayjs(date1).format('MMMM D')} - ${title}`
}

export const getDateFormatter = (date1: Date, date2: Date | null) => {
  if (!date1) return

  if (date1 && !date2) {
    return `${dayjs(date1).format('MMMM D, YYYY')}`
  }

  if (!dayjs(date1).isSame(dayjs(date2), 'year')) {
    const title = date2 ? dayjs(date2).format('MMMM D, YYYY') : '-'
    return `${dayjs(date1).format('MMMM D, YYYY')} - ${title}`
  }

  if (!dayjs(date1).isSame(dayjs(date2), 'month')) {
    const title = date2 ? dayjs(date2).format('MMMM D, YYYY') : '-'
    return `${dayjs(date1).format('MMMM D')} - ${title}`
  }

  return `${dayjs(date1).format('MMMM D')} - ${dayjs(date2).format('D, YYYY')}`
}

export const getDateFormat = (date: Date | null) => {
  if (!date) return dayjs().format('YYYY-MM-DD')
  return dayjs(date).format('YYYY-MM-DD')
}

export const toCapitalize = (str: string) => {
  return str.replace(/\b\w/g, match => match.toUpperCase())
}

export type SelectedRangeDate = 'month' | 'week' | 'today'

export interface DashboardForm {
  dateRange?: Array<Date | null>
  view: ViewMode
  viewSwitch: boolean
  userViewDate: string
  selectedRangeDate: SelectedRangeDate
}

const LPMDashboards = () => {
  const router = useRouter()
  const { formHook, infoDialog, memberView } = UseDashboardControl()
  const { control, setValue, ...props } = formHook
  const { isShowMemberView, showMemberView, hiddenMemberView } = memberView
  const { isShowInfoDialog, infoDialogKey, setOpenInfoDialog, close } =
    infoDialog

  const [dateRange, userViewDate] = useWatch({
    control,
    name: ['dateRange', 'userViewDate'],
  })

  const { data: ReportData } = useDashboardReport({
    from: getDateFormat((Array.isArray(dateRange) && dateRange[0]) || null),
    to: getDateFormat((Array.isArray(dateRange) && dateRange[1]) || null),
  })

  const [currency, setCurrency] = useState<Currency>('convertedToUSD')

  const onChangeCurrency = (type: Currency) => {
    setCurrency(type)
  }

  return (
    <FormProvider {...props} setValue={setValue} control={control}>
      <ApexChartWrapper>
        <Grid
          container
          gap='24px'
          sx={{
            padding: '10px',
          }}
        >
          <SwitchTypeHeader
            isShowMemberView={isShowMemberView}
            hiddenMemberView={hiddenMemberView}
            showMemberView={showMemberView}
          />
          <Grid container gap='24px'>
            {!isShowMemberView && (
              <GridItem width={290} height={362}>
                <Box
                  display='flex'
                  flexDirection='column'
                  sx={{ width: '100%', height: '100%' }}
                >
                  <Box marginBottom='20px'>
                    <Title
                      title='Report'
                      openDialog={() => setOpenInfoDialog(true, 'Report')}
                    />

                    <Box
                      component='ul'
                      display='flex'
                      flexDirection='column'
                      sx={{ padding: 0 }}
                    >
                      {ReportData &&
                        Object.entries(ReportData).map(
                          ([key, value], index) => (
                            <ReportItem
                              key={`${key}-${index}`}
                              label={toCapitalize(Status[index])}
                              value={value}
                              color={StatusColor[index]}
                              isHidden={[
                                Object.entries(ReportData).length - 1,
                                3,
                              ].includes(index)}
                            />
                          ),
                        )}
                    </Box>
                  </Box>
                </Box>
              </GridItem>
            )}
            {!isShowMemberView && (
              <GridItem height={362} sm padding='0'>
                <Box sx={{ width: '100%' }}>
                  <Title
                    title='New requests'
                    padding='10px 20px 0'
                    marginBottom='20px'
                    handleClick={() => router.push('/quotes/lpm/requests/')}
                    openDialog={setOpenInfoDialog}
                  />
                  <DashboardDataGrid
                    type='new'
                    pageNumber={4}
                    movePage={(id: number) => ''}
                    columns={RequestColumns}
                  />
                </Box>
              </GridItem>
            )}

            {/*{memberView && (*/}
            {/*  <GridItem width='269px' height={362} padding='0'>*/}
            {/*    <img*/}
            {/*      src='/images/dashboard/img_member_view.png'*/}
            {/*      alt='img'*/}
            {/*      style={{ width: '110%' }}*/}
            {/*    />*/}
            {/*  </GridItem>*/}
            {/*)}*/}
          </Grid>
          <StatusAndList
            userViewDate={userViewDate}
            type='order'
            statusColumn={StatusOrderColumns}
            initSort={[
              {
                field: 'category',
                sort: 'desc',
              },
            ]}
            setOpenInfoDialog={setOpenInfoDialog}
            from={getDateFormat(
              (Array.isArray(dateRange) && dateRange[0]) || null,
            )}
            to={getDateFormat(
              (Array.isArray(dateRange) && dateRange[1]) || null,
            )}
          />
          <StatusAndList
            userViewDate={userViewDate}
            type='job'
            statusColumn={StatusJobColumns}
            initSort={[
              {
                field: 'proName',
                sort: 'desc',
              },
            ]}
            setOpenInfoDialog={setOpenInfoDialog}
            from={getDateFormat(
              (Array.isArray(dateRange) && dateRange[0]) || null,
            )}
            to={getDateFormat(
              (Array.isArray(dateRange) && dateRange[1]) || null,
            )}
          />
          <Grid container gap='24px'>
            <GridItem height={229} xs={6}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Box>
                  <Title
                    title='Receivables - Paid this month'
                    handleClick={() => router.push('/quotes/lpm/requests/')}
                    openDialog={setOpenInfoDialog}
                  />
                  <Box display='flex' justifyContent='flex-end'>
                    <ConvertButtonGroup onChangeCurrency={onChangeCurrency} />
                  </Box>
                </Box>
                <TotalValueView
                  label='Paid this month'
                  amountLabel='Receivable amount'
                  countLabel='Counts'
                />
              </Box>
            </GridItem>
            <GridItem height={229} sm>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Box>
                  <Title
                    title='Payables - Paid this month'
                    openDialog={setOpenInfoDialog}
                  />
                  <Box display='flex' justifyContent='flex-end'>
                    <ConvertButtonGroup onChangeCurrency={onChangeCurrency} />
                  </Box>
                </Box>
                <TotalValueView
                  label='Paid this month'
                  amountLabel='Receivable amount'
                  countLabel='Counts'
                />
              </Box>
            </GridItem>
          </Grid>
          <Grid container gap='24px'>
            <GridItem height={525} xs={6}>
              <TotalChart
                title='Receivables - Total'
                iconColor='114, 225, 40'
                icon={Archive}
                setOpenInfoDialog={setOpenInfoDialog}
              />
            </GridItem>
            <GridItem height={525} sm>
              <TotalChart
                title='Payables - Total'
                icon={MonetizationOn}
                iconColor='102, 108, 255'
                setOpenInfoDialog={setOpenInfoDialog}
              />
            </GridItem>
          </Grid>
          <Grid container>
            <GridItem height={362} sm padding='0px'>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Title
                  marginBottom='20px'
                  padding='20px'
                  title='Long-standing receivables - Action required'
                  prefix='🚨 '
                  postfix=' (32)'
                  openDialog={setOpenInfoDialog}
                />
                <Box>sd</Box>
              </Box>
            </GridItem>
          </Grid>
          <Grid container>
            <GridItem height={362} sm padding='0px'>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Title
                  marginBottom='20px'
                  padding='20px'
                  title='Long-standing payables - Action required'
                  prefix='🚨 '
                  postfix=' (22)'
                  openDialog={setOpenInfoDialog}
                />
                <Box>sd</Box>
              </Box>
            </GridItem>
          </Grid>
          <Grid container spacing={5}>
            <DoughnutChart
              userViewDate={userViewDate}
              title='Clients'
              from={getDateFormat(
                (Array.isArray(dateRange) && dateRange[0]) || null,
              )}
              to={getDateFormat(
                (Array.isArray(dateRange) && dateRange[1]) || null,
              )}
              type='client'
              colors={Colors}
              setOpenInfoDialog={setOpenInfoDialog}
            />
            <DoughnutChart<PairRatioItem>
              userViewDate={userViewDate}
              title='Language pairs'
              from={getDateFormat(
                (Array.isArray(dateRange) && dateRange[0]) || null,
              )}
              to={getDateFormat(
                (Array.isArray(dateRange) && dateRange[1]) || null,
              )}
              type='language-pair'
              colors={SecondColors}
              getName={item => {
                return `${item?.sourceLanguage}->${item?.targetLanguage}`.toUpperCase()
              }}
              setOpenInfoDialog={setOpenInfoDialog}
            />
          </Grid>
          <Grid container spacing={5}>
            <DoughnutChart<CategoryRatioItem>
              userViewDate={userViewDate}
              title='Main categories'
              from={getDateFormat(
                (Array.isArray(dateRange) && dateRange[0]) || null,
              )}
              to={getDateFormat(
                (Array.isArray(dateRange) && dateRange[1]) || null,
              )}
              type='category'
              colors={Colors}
              getName={item => {
                return `${item?.category || '-'}`
              }}
              setOpenInfoDialog={setOpenInfoDialog}
            />
            <DoughnutChart<ServiceRatioItem>
              userViewDate={userViewDate}
              title='Service types'
              from={getDateFormat(
                (Array.isArray(dateRange) && dateRange[0]) || null,
              )}
              to={getDateFormat(
                (Array.isArray(dateRange) && dateRange[1]) || null,
              )}
              type='service-type'
              colors={SecondColors}
              getName={item => {
                return `${item?.serviceType || '-'}`
              }}
              setOpenInfoDialog={setOpenInfoDialog}
            />
          </Grid>
          <Grid container spacing={5}>
            <DoughnutChart<ExpertiseRatioItem>
              userViewDate={userViewDate}
              title='Area of expertises'
              from={getDateFormat(
                (Array.isArray(dateRange) && dateRange[0]) || null,
              )}
              to={getDateFormat(
                (Array.isArray(dateRange) && dateRange[1]) || null,
              )}
              type='expertise'
              colors={Colors}
              getName={item => {
                return `${item?.expertise || '-'}`
              }}
              setOpenInfoDialog={setOpenInfoDialog}
            />
          </Grid>
        </Grid>

        <InfoDialog
          open={isShowInfoDialog}
          keyName={infoDialogKey}
          infoType='LPM'
          close={close}
        />
      </ApexChartWrapper>
    </FormProvider>
  )
}

export default LPMDashboards

LPMDashboards.acl = {
  action: 'read',
  subject: 'client',
}
