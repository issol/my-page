import Grid from '@mui/material/Grid'
import {
  GridItem,
  ReportItem,
  Title,
  TotalValueView,
} from '@src/views/dashboard/dashboardItem'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import {
  DashboardCountResult,
  DEFAULT_QUERY_NAME,
  PaidThisMonthAmount,
  TotalPriceResult,
  useDashboardReport,
} from '@src/queries/dashnaord.query'
import { FormProvider, useWatch } from 'react-hook-form'
import React, { Suspense, useEffect, useState } from 'react'
import DashboardDataGrid from '@src/views/dashboard/dataGrid/request'
import ApexChartWrapper from '@src/@core/styles/libs/react-apexcharts'

import Doughnut from '@src/views/dashboard/chart/doughnut'
import weekday from 'dayjs/plugin/weekday'
import {
  Colors,
  SecondColors,
  Status,
  StatusColor,
} from '@src/shared/const/dashboard/chart'
import {
  CategoryRatioItem,
  CSVDataType,
  ExpertiseRatioItem,
  JobItem,
  PairRatioItem,
  ServiceRatioItem,
  ViewMode,
} from '@src/types/dashboard'
import StatusAndDataGrid from '@src/views/dashboard/dataGrid/status'
import { Archive, MonetizationOn } from '@mui/icons-material'
import {
  PayablesColumns,
  ReceivableColumns,
  RequestColumns,
  StatusJobColumns,
  StatusOrderColumns,
} from '@src/shared/const/columns/dashboard'
import { useRouter } from 'next/router'
import Information from '@src/views/dashboard/dialog/information'
import TotalPrice, {
  payableColors,
  ReceivableColors,
} from '@src/views/dashboard/chart/total'
import UseDashboardControl from '@src/hooks/useDashboardControl'
import SwitchTypeHeader from '@src/views/dashboard/header/SwitchType'
import LongStandingDataGrid from '@src/views/dashboard/dataGrid/longStanding'
import Notice from '@src/views/dashboard/notice'
import { mergeData } from 'src/pages/[companyName]/dashboards/tad'
import { useQueryClient } from 'react-query'
import FallbackSpinner from '@src/@core/components/spinner'
import { TryAgain } from '@src/views/dashboard/suspense'
import { ErrorBoundary } from 'react-error-boundary'
import { Headers } from 'react-csv/lib/core'
import {
  useGetOnboardingStatistic,
  useGetStatistic,
} from '@src/queries/onboarding/onboarding-query'
import UserStatistic from '@src/views/dashboard/user'
import { useGetRecruitingCount } from '@src/queries/recruiting.query'
import RecruitingStatistic from '@src/views/dashboard/recruting'

dayjs.extend(weekday)

export const getRangeDateTitle = (date1: Date, date2: Date | null) => {
  const title = date2
    ? dayjs(date2).set('date', dayjs(date1).daysInMonth()).format('DD, YYYY ')
    : '-'
  return `${dayjs(date1).format('MMMM D')} - ${title}`
}

export const getDateFormatter = (date1: Date, date2: Date | null) => {
  if (!date1) return

  if (dayjs(date1).isSame(dayjs(date2), 'day')) {
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
  if (!date) return ''
  return dayjs(date).format('YYYY-MM-DD')
}

export const toCapitalize = (str: string) => {
  return str.replace(/\b\w/g, match => match.toUpperCase())
}

export type SelectedRangeDate = 'month' | 'week' | 'today'

export interface DashboardForm {
  dateRange?: Array<Date | null>
  date?: Date
  view: ViewMode
  viewSwitch: boolean
  userViewDate: string
  selectedRangeDate: SelectedRangeDate
}

const LPMDashboards = () => {
  const router = useRouter()
  const cache = useQueryClient()
  const data = cache.getQueriesData([DEFAULT_QUERY_NAME])

  const { formHook, infoDialog, memberView } = UseDashboardControl()
  const { control, setValue, ...props } = formHook
  const { isShowMemberView, showMemberView, hiddenMemberView } = memberView
  const { isShowInfoDialog, infoDialogKey, setOpenInfoDialog, close } =
    infoDialog

  const [dateRange, userViewDate] = useWatch({
    control,
    name: ['dateRange', 'userViewDate'],
  })

  const [CSVData, setCSVData] = useState<CSVDataType>([])
  const [CSVHeader, setCSVHeader] = useState<Headers>([])
  const [receivables, setReceivables] = useState<CSVDataType>([])
  const [payables, setPayables] = useState<CSVDataType>([])
  const [clients, setClients] = useState<CSVDataType>([])
  const [languagePairs, setLanguagePairs] = useState<CSVDataType>([])
  const [categories, setCategories] = useState<CSVDataType>([])
  const [serviceTypes, setServiceTypes] = useState<CSVDataType>([])
  const [expertises, setExpertises] = useState<CSVDataType>([])

  const { data: ReportData } = useDashboardReport({
    from: getDateFormat((Array.isArray(dateRange) && dateRange[0]) || null),
    to: getDateFormat((Array.isArray(dateRange) && dateRange[1]) || null),
  })

  const { data: totalStatistics } = useGetStatistic()
  const { data: onboardingStatistic } = useGetOnboardingStatistic()
  const { data: recruitingStatistic } = useGetRecruitingCount()

  useEffect(() => {
    console.log(data)
    const ongoingCounts = data.filter(item => item[0].includes('ongoingCount'))
    const paidThisMonths = data.filter(item =>
      item[0].includes('PaidThisMonth'),
    )

    const totalPrices = data.filter(item => item[0].includes('totalPrice'))
    const receivableLong = data.filter(
      item =>
        item[0].includes('Long-standing') && item[0].includes('receivable'),
    )[0][1] as { data: Array<any>; count: number; totalCount: number }
    const payableLong = data.filter(
      item => item[0].includes('Long-standing') && item[0].includes('payable'),
    )[0][1] as { data: Array<any>; count: number; totalCount: number }

    const ongoingOrder = ongoingCounts.filter(item =>
      item[0].includes('order'),
    )[0]?.[1] as DashboardCountResult

    const ongoingJob = ongoingCounts.filter(item =>
      item[0].includes('job'),
    )[0]?.[1] as DashboardCountResult

    const receivableTotal = totalPrices.filter(item =>
      item[0].includes('receivable'),
    )[0]?.[1] as TotalPriceResult

    const payableTotal = totalPrices.filter(item =>
      item[0].includes('payable'),
    )[0]?.[1] as TotalPriceResult

    const receivableMonth = paidThisMonths.filter(item =>
      item[0].includes('receivable'),
    )[0]?.[1] as PaidThisMonthAmount

    const payableMonth = paidThisMonths.filter(item =>
      item[0].includes('payable'),
    )[0]?.[1] as PaidThisMonthAmount | null

    const filterOngoingOrder = Object.entries(ongoingOrder || {}).map(
      ([key, value]) => {
        return {
          orderStatus: key,
          orderNumber: value,
          'ongoing order empty': '',
        }
      },
    )

    const filterOngoingJob = Object.entries(ongoingJob || {}).map(
      ([key, value]) => {
        return { jobStatus: key, jobNumber: value, 'ongoing job empty': '' }
      },
    )

    const filterPayableTotal = (payableTotal?.report || []).map(
      (item, index) => {
        if (index === 0) {
          return {
            'Payables - paid this month Price': payableMonth?.totalPrice || 0,
            'Payables - paid this month Number': payableMonth?.count || 0,
            'Payables month empty': '',
            'Payables total Count': item.count || 0,
            'Payables total Price': item.sum || 0,
            'Payables total Percent': item.ratio || 0,
            'Payables total empty': '',
          }
        }
        return {
          'Payables total Count': item.count || 0,
          'Payables total Price': item.sum || 0,
          'Payables total Percent': item.ratio || 0,
          'Payables total empty': '',
        }
      },
    )

    const filterReceivableTotal = (receivableTotal?.report || []).map(
      (item, index) => {
        if (index === 0) {
          return {
            'Receivables - paid this month Price':
              receivableMonth?.totalPrice || 0,
            'Receivables - paid this month Number': receivableMonth?.count || 0,
            'Receivables month empty': ' ',
            'Receivables total Count': item.count || 0,
            'Receivables total Price': item.sum || 0,
            'Receivables total Percent': item.ratio || 0,
            'Receivables total empty': '',
            'Long-standing receivables - Action required':
              receivableLong?.count || 0,
            'Long-standing receivables - Action required empty': '',
            'Long-standing payables - Action required': payableLong?.count || 0,
            'Long-standing payables - Action required empty': '',
          }
        }
        return {
          'Receivables total Count': item.count || 0,
          'Receivables total Price': item.sum || 0,
          'Receivables total Percent': item.ratio || 0,
          'Receivables total empty': ' ',
        }
      },
    )

    const mergeObjectData1 = mergeData(filterOngoingOrder, filterOngoingJob)
    const mergeObjectData2 = mergeData(mergeObjectData1, filterReceivableTotal)
    const mergeObjectData3 = mergeData(mergeObjectData2, filterPayableTotal)

    const mergeData1 = mergeData(clients, languagePairs)
    const mergeData2 = mergeData(mergeData1, categories)

    const mergeData3 = mergeData(mergeData2, serviceTypes)
    const mergeData4 = mergeData(mergeData3, expertises)
    const mergeData5 = mergeData(mergeObjectData3, mergeData4)

    if (!isShowMemberView) {
      mergeData5[0] = {
        Requests: ReportData?.requests || 0,
        Quotes: ReportData?.quotes || 0,
        Orders: ReportData?.orders || 0,
        Receivables: ReportData?.invoiceReceivables || 0,
        Payables: ReportData?.invoicePayables || 0,
        Canceled: ReportData?.canceled || 0,
        'ReportData empty': '',
        ...mergeData5[0],
      }
    }

    const csvHeaders = Object.keys(mergeData5[0]).map((key, index) => {
      if (key.includes('empty')) {
        return { label: '', key: key }
      }
      return { label: key, key }
    })

    setCSVHeader(csvHeaders)
    setCSVData(mergeData5)
  }, [
    receivables,
    payables,
    clients,
    languagePairs,
    serviceTypes,
    categories,
    expertises,
    isShowMemberView,
  ])

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
          <Notice />

          <SwitchTypeHeader
            isShowMemberView={isShowMemberView}
            hiddenMemberView={hiddenMemberView}
            showMemberView={showMemberView}
            csvData={CSVData}
            csvHeader={CSVHeader}
          />

          <Grid container gap='24px'>
            {onboardingStatistic && totalStatistics ? (
              <GridItem height={87} width={'55%'}>
                <UserStatistic
                  onboardingStatistic={onboardingStatistic}
                  totalStatistics={totalStatistics}
                />
              </GridItem>
            ) : null}
            {recruitingStatistic ? (
              <GridItem height={87} sm>
                <RecruitingStatistic recruitingData={recruitingStatistic} />
              </GridItem>
            ) : null}
            {!isShowMemberView && (
              <GridItem width={300} height={362}>
                <Box
                  display='flex'
                  flexDirection='column'
                  sx={{ width: '100%', height: '100%' }}
                >
                  <Box marginBottom='20px'>
                    <Title
                      title='Report'
                      subTitle={userViewDate}
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
            <GridItem height={362} sm padding='0'>
              <Box sx={{ width: '100%' }}>
                <DashboardDataGrid
                  sectionTitle='New requests'
                  overlayTitle='New requests from clients'
                  sectionHeight={280}
                  path='u/dashboard/client-request/list/new'
                  pageNumber={4}
                  columns={RequestColumns}
                  setOpenInfoDialog={setOpenInfoDialog}
                  movePage={params =>
                    router.push(`/quotes/lpm/requests/${params.id}/`)
                  }
                  handleClick={() => router.push('/quotes/lpm/requests/')}
                />
              </Box>
            </GridItem>
            {isShowMemberView && (
              <GridItem width={269} height={362}>
                <img
                  src='/images/dashboard/img_member_view.png'
                  alt='img'
                  style={{ width: '128%' }}
                />
              </GridItem>
            )}
          </Grid>
          <StatusAndDataGrid
            userViewDate={userViewDate}
            type='order'
            statusColumn={StatusOrderColumns}
            initSort={[
              {
                field: 'clientName',
                sort: 'asc',
              },
            ]}
            setOpenInfoDialog={setOpenInfoDialog}
            from={getDateFormat(
              (Array.isArray(dateRange) && dateRange[0]) || null,
            )}
            to={getDateFormat(
              (Array.isArray(dateRange) && dateRange[1]) || null,
            )}
            movePage={() => router.push('/orders/order-list/')}
            moveDetailPage={params =>
              router.push(`/orders/order-list/detail/${params.id}`)
            }
          />
          <StatusAndDataGrid<JobItem>
            userViewDate={userViewDate}
            type='job'
            statusColumn={StatusJobColumns}
            initSort={[
              {
                field: 'proName',
                sort: 'asc',
              },
            ]}
            setOpenInfoDialog={setOpenInfoDialog}
            from={getDateFormat(
              (Array.isArray(dateRange) && dateRange[0]) || null,
            )}
            to={getDateFormat(
              (Array.isArray(dateRange) && dateRange[1]) || null,
            )}
            movePage={() => router.push('/orders/job-list/?menu=list')}
            // moveDetailPage={params =>
            //   router.push(
            //     `/orders/job-list/details/?orderId=${params.row?.orderId}&jobId=${params.row.id}`,
            //   )
            // }
          />
          <Grid container gap='24px'>
            <GridItem height={229} xs={6}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Box>
                  <Title
                    title='Receivables - Paid this month'
                    handleClick={() => router.push('/invoice/receivable/')}
                    openDialog={setOpenInfoDialog}
                  />
                </Box>
                <Suspense fallback={<FallbackSpinner />}>
                  <ErrorBoundary
                    fallback={
                      <TryAgain
                        refreshDataQueryKey={['PaidThisMonth', 'receivable']}
                      />
                    }
                  >
                    <TotalValueView
                      type='receivable'
                      label='Paid this month'
                      amountLabel='Receivable amount'
                      countLabel='Counts'
                    />
                  </ErrorBoundary>
                </Suspense>
              </Box>
            </GridItem>
            <GridItem height={229} sm>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Box>
                  <Title
                    title='Payables - Paid this month'
                    openDialog={setOpenInfoDialog}
                    handleClick={() => router.push('/invoice/payable/')}
                  />
                </Box>
                <Suspense fallback={<FallbackSpinner />}>
                  <ErrorBoundary
                    fallback={
                      <TryAgain
                        refreshDataQueryKey={['PaidThisMonth', 'payable']}
                      />
                    }
                  >
                    <TotalValueView
                      type='payable'
                      label='Paid this month'
                      amountLabel='Receivable amount'
                      countLabel='Counts'
                    />
                  </ErrorBoundary>
                </Suspense>
              </Box>
            </GridItem>
          </Grid>
          <Grid container gap='24px'>
            <GridItem height={525} xs={6}>
              <TotalPrice
                type='receivable'
                title='Receivables - Total'
                iconColor='114, 225, 40'
                icon={Archive}
                setOpenInfoDialog={setOpenInfoDialog}
                statusList={['Invoiced', 'Paid', 'Overdue', 'Canceled']}
                colors={ReceivableColors}
                handleTitleClick={() => router.push('/invoice/receivable/')}
              />
            </GridItem>
            <GridItem height={525} sm>
              <TotalPrice
                type='payable'
                title='Payables - Total'
                icon={MonetizationOn}
                iconColor='102, 108, 255'
                setOpenInfoDialog={setOpenInfoDialog}
                statusList={['Invoiced', 'Paid', 'Overdue']}
                colors={payableColors}
                handleTitleClick={() => router.push('/invoice/payable/')}
              />
            </GridItem>
          </Grid>
          <Grid container>
            <LongStandingDataGrid
              title='Long-standing receivables - Action required'
              overlayTitle='There are no long-standing receivables'
              type='receivable'
              columns={ReceivableColumns}
              initSort={[
                {
                  field: 'clientName',
                  sort: 'asc',
                },
              ]}
              dataRecord={receivables}
              setDataRecord={setReceivables}
              setOpenInfoDialog={setOpenInfoDialog}
              onRowClick={params =>
                router.push(`/invoice/receivable/detail/${params.id}/`)
              }
            />
          </Grid>
          <Grid container>
            <LongStandingDataGrid
              title='Long-standing payables - Action required'
              overlayTitle='There are no long-standing payables'
              type='payable'
              columns={PayablesColumns}
              initSort={[
                {
                  field: 'proName',
                  sort: 'asc',
                },
              ]}
              dataRecord={payables}
              setDataRecord={setPayables}
              setOpenInfoDialog={setOpenInfoDialog}
              onRowClick={params =>
                router.push(`/invoice/payable/${params.id}/?menu=info`)
              }
            />
          </Grid>
          <Grid container spacing={5}>
            <Doughnut
              userViewDate={userViewDate}
              title='Clients'
              overlayTitle='There are no client information'
              from={getDateFormat(
                (Array.isArray(dateRange) && dateRange[0]) || null,
              )}
              to={getDateFormat(
                (Array.isArray(dateRange) && dateRange[1]) || null,
              )}
              type='client'
              colors={Colors}
              setDataRecord={setClients}
              setOpenInfoDialog={setOpenInfoDialog}
            />
            <Doughnut<PairRatioItem>
              userViewDate={userViewDate}
              title='Language pairs'
              overlayTitle='There are no language information'
              from={getDateFormat(
                (Array.isArray(dateRange) && dateRange[0]) || null,
              )}
              to={getDateFormat(
                (Array.isArray(dateRange) && dateRange[1]) || null,
              )}
              type='language-pair'
              colors={SecondColors}
              getName={item => {
                if (item?.sourceLanguage && item?.targetLanguage) {
                  return `${item?.sourceLanguage}→${item?.targetLanguage}`.toUpperCase()
                }
                if (item?.sourceLanguage && !item?.targetLanguage) {
                  return `${item?.sourceLanguage}`.toUpperCase()
                }
                return `${item?.targetLanguage}`.toUpperCase()
              }}
              menuOptions={[
                {
                  key: 'pair',
                  text: 'Language pairs',
                },
                {
                  key: 'source',
                  text: 'Source languages',
                },
                {
                  key: 'target',
                  text: 'Target languages',
                },
              ]}
              setDataRecord={setLanguagePairs}
              setOpenInfoDialog={setOpenInfoDialog}
            />
          </Grid>
          <Grid container spacing={5}>
            <Doughnut<CategoryRatioItem>
              userViewDate={userViewDate}
              title='Main categories'
              overlayTitle='There are no category information'
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
              menuOptions={[
                {
                  key: 'mainCategories',
                  text: 'Main categories',
                },
                {
                  key: 'detailedCategories',
                  text: 'Detailed categories',
                },
              ]}
              setDataRecord={setCategories}
              setOpenInfoDialog={setOpenInfoDialog}
            />
            <Doughnut<ServiceRatioItem>
              userViewDate={userViewDate}
              title='Service types'
              overlayTitle='There are no service type information'
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
              setDataRecord={setServiceTypes}
              setOpenInfoDialog={setOpenInfoDialog}
            />
          </Grid>
          <Grid container spacing={5}>
            <Doughnut<ExpertiseRatioItem>
              userViewDate={userViewDate}
              title='Area of expertises'
              overlayTitle='There are no area of expertise information'
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
              setDataRecord={setExpertises}
              setOpenInfoDialog={setOpenInfoDialog}
            />
          </Grid>
        </Grid>

        <Information
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
  subject: 'dashboard_LPM',
}