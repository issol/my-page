import Grid from '@mui/material/Grid'
import {
  GridItem,
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
} from '@src/queries/dashboard/dashnaord-lpm'
import { FormProvider, useWatch } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import ApexChartWrapper from '@src/@core/styles/libs/react-apexcharts'

import Doughnut from '@src/views/dashboard/chart/doughnut'
import weekday from 'dayjs/plugin/weekday'
import { Colors, SecondColors } from '@src/shared/const/dashboard/chart'
import {
  CategoryRatioItem,
  CSVDataType,
  ExpertiseRatioItem,
  LongStandingReceivableItem,
  PairRatioItem,
  ServiceRatioItem,
} from '@src/types/dashboard'
import StatusAndDataGrid from '@src/views/dashboard/dataGrid/status'
import {
  InvoiceColumns,
  ReceivableColumns,
  StatusOrderColumns,
} from '@src/shared/const/columns/dashboard'
import { getDateFormat } from '@src/pages/dashboards/lpm'
import UseDashboardControl from '@src/hooks/useDashboardControl'
import SwitchTypeHeader from '@src/views/dashboard/header/SwitchType'
import Total, { ReceivableColors } from '@src/views/dashboard/chart/total'
import { ReceiptLong } from '@mui/icons-material'
import ClientReport from '@src/views/dashboard/list/clientReport'
import Notice from '@src/views/dashboard/notice'
import Information from '@src/views/dashboard/dialog/information'
import { useRouter } from 'next/router'
import LongStandingDataGrid from '@src/views/dashboard/dataGrid/longStanding'
import { mergeData } from '@src/pages/dashboards/tad'
import { useQueryClient } from 'react-query'

dayjs.extend(weekday)

const ReportInit = {
  canceled: 0,
  invoicePayables: 0,
  invoiceReceivables: 0,
  orders: 0,
  quotes: 0,
  requests: 0,
}

const ClientDashboards = () => {
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

  const { data: ReportData } = useDashboardReport({
    from: getDateFormat((Array.isArray(dateRange) && dateRange[0]) || null),
    to: getDateFormat((Array.isArray(dateRange) && dateRange[1]) || null),
  })

  const [CSVData, setCSVData] = useState<CSVDataType>([])
  const [receivables, setReceivables] = useState<CSVDataType>([])
  const [languagePairs, setLanguagePairs] = useState<CSVDataType>([])
  const [categories, setCategories] = useState<CSVDataType>([])
  const [serviceTypes, setServiceTypes] = useState<CSVDataType>([])
  const [expertises, setExpertises] = useState<CSVDataType>([])

  useEffect(() => {
    const ongoingCounts = data.filter(item =>
      item[0].includes('ongoingCount'),
    )[0][1] as DashboardCountResult
    const paidThisMonths = data.filter(item =>
      item[0].includes('PaidThisMonth'),
    )[0][1] as PaidThisMonthAmount
    const totalPrices = data.filter(item =>
      item[0].includes('totalPrice'),
    )[0][1] as TotalPriceResult

    const filterInvoiceTotal = totalPrices.report.map(item => {
      return {
        'Invoice Status': item.name,
        'Invoice Count': item.count,
        'Invoice Price': item.sum,
        'Invoice Percent': item.ratio,
        ' ': ' ',
      }
    })

    const filterOngoingOrder = Object.entries(ongoingCounts).map(
      ([key, value]) => {
        return { orderStatus: key, orderNumber: value, '   ': '  ' }
      },
    )

    const mergeData1 = mergeData(filterInvoiceTotal, receivables)
    mergeData1[0] = {
      'Invoices - paid this month Price': paidThisMonths?.totalPrice || 0,
      'Invoices - paid this month Number': paidThisMonths?.count || 0,
      '': '',
      ...mergeData1[0],
    }

    const mergeData2 = mergeData(mergeData1, filterOngoingOrder)
    const mergeData3 = mergeData(mergeData2, languagePairs)
    const mergeData4 = mergeData(mergeData3, categories)
    const mergeData5 = mergeData(mergeData4, serviceTypes)
    const mergeData6 = mergeData(mergeData5, expertises)

    mergeData6[0] = {
      Requests: ReportData?.requests || 0,
      Quotes: ReportData?.quotes || 0,
      Orders: ReportData?.orders || 0,
      Receivables: ReportData?.invoiceReceivables || 0,
      Payables: ReportData?.invoicePayables || 0,
      Canceled: ReportData?.canceled || 0,
      '': '',
      ...mergeData6[0],
    }
    setCSVData(mergeData6)
  }, [receivables, languagePairs, serviceTypes, categories, expertises])

  return (
    <FormProvider {...props} setValue={setValue} control={control}>
      <ApexChartWrapper>
        <Grid container gap='24px' sx={{ minWidth: '1320px', padding: '10px' }}>
          <Notice />
          <SwitchTypeHeader
            csvData={CSVData}
            isShowMemberView={isShowMemberView}
            hiddenMemberView={hiddenMemberView}
            showMemberView={showMemberView}
          />
          <Grid container gap='24px'>
            <Grid item display='flex' flexDirection='column' gap='24px' xs={6}>
              {!isShowMemberView && (
                <>
                  <GridItem height={219} sm>
                    <Box sx={{ width: '100%', height: '100%' }}>
                      <Box>
                        <Title
                          title='Invoices - Paid this month'
                          openDialog={setOpenInfoDialog}
                          handleClick={() =>
                            router.push('/invoice/receivable/')
                          }
                        />
                      </Box>
                      <TotalValueView
                        type='receivable'
                        label='Paid this month'
                        amountLabel='Receivable amount'
                        countLabel='Counts'
                      />
                    </Box>
                  </GridItem>
                  <ClientReport
                    reportData={ReportData || ReportInit}
                    userViewDate={userViewDate}
                    setOpenInfoDialog={setOpenInfoDialog}
                  />
                </>
              )}
              {isShowMemberView && (
                <GridItem height={532} sm padding='0px'>
                  <Box display='flex' flexDirection='column'>
                    <Box
                      sx={{
                        width: '100%',
                        height: '320px',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src='/images/dashboard/img_client.png'
                        alt='dashboard_img'
                        style={{ width: '100%' }}
                      />
                    </Box>
                    <Box
                      sx={{
                        width: '100%',
                        height: '220px',
                        padding: '20px 20px 0',
                      }}
                    >
                      <Box>
                        <Title
                          title='Invoices - Paid this month'
                          openDialog={setOpenInfoDialog}
                          handleClick={() =>
                            router.push('/invoice/receivable/')
                          }
                        />
                      </Box>
                      <TotalValueView
                        type='receivable'
                        label='Paid this month'
                        amountLabel='Receivable amount'
                        countLabel='Counts'
                      />
                    </Box>
                  </Box>
                </GridItem>
              )}
            </Grid>
            <GridItem sm height={532}>
              <Total
                type='receivable'
                title='Invoices - Total'
                iconColor='114, 225, 40'
                icon={ReceiptLong}
                setOpenInfoDialog={setOpenInfoDialog}
                statusList={['Invoiced', 'Paid', 'Overdue', 'Canceled']}
                colors={ReceivableColors}
                handleTitleClick={() => router.push('/invoice/receivable/')}
              />
            </GridItem>
          </Grid>
          <Grid container>
            <GridItem height={547} sm padding='0px'>
              <LongStandingDataGrid<LongStandingReceivableItem>
                title='Long-standing invoices - Action required'
                type='receivable'
                columns={InvoiceColumns}
                initSort={[
                  {
                    field: 'clientName',
                    sort: 'asc',
                  },
                ]}
                dataRecord={receivables}
                setDataRecord={setReceivables}
                setOpenInfoDialog={setOpenInfoDialog}
                onRowClick={(params, event, details) => {
                  if (params.row.status === 30500) return
                  router.push(`/invoice/receivable/detail/${params.id}/`)
                }}
              />
            </GridItem>
          </Grid>
          <StatusAndDataGrid
            userViewDate={userViewDate}
            type='order'
            movePage={() => router.push('/orders/order-list/')}
            statusColumn={StatusOrderColumns}
            initSort={[
              {
                field: 'category',
                sort: 'asc',
              },
            ]}
            from={getDateFormat(
              (Array.isArray(dateRange) && dateRange[0]) || null,
            )}
            to={getDateFormat(
              (Array.isArray(dateRange) && dateRange[1]) || null,
            )}
            setOpenInfoDialog={setOpenInfoDialog}
          />
          <Grid container spacing={5}>
            <Doughnut<PairRatioItem>
              userViewDate={userViewDate}
              title='Language pairs@client'
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
            <Doughnut<CategoryRatioItem>
              userViewDate={userViewDate}
              title='Categories'
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
              setDataRecord={setCategories}
              setOpenInfoDialog={setOpenInfoDialog}
            />
          </Grid>
          <Grid container spacing={5}>
            <Doughnut<ServiceRatioItem>
              userViewDate={userViewDate}
              title='Service types@client'
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
            <Doughnut<ExpertiseRatioItem>
              userViewDate={userViewDate}
              title='Area of expertises@client'
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
              setDataRecord={setExpertises}
            />
          </Grid>
        </Grid>
        <Information
          open={isShowInfoDialog}
          keyName={infoDialogKey}
          infoType='CLIENT'
          close={close}
        />
      </ApexChartWrapper>
    </FormProvider>
  )
}

export default ClientDashboards

ClientDashboards.acl = {
  action: 'read',
  subject: 'client',
}
