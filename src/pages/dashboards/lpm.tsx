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

import Doughnut from '@src/views/dashboard/chart/doughnut'
import weekday from 'dayjs/plugin/weekday'
import {
  Status,
  Colors,
  SecondColors,
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
import Total, {
  payableColors,
  ReceivableColors,
} from '@src/views/dashboard/chart/total'
import UseDashboardControl from '@src/hooks/useDashboardControl'
import SwitchTypeHeader from '@src/views/dashboard/header/SwitchType'
import LongStandingDataGrid from '@src/views/dashboard/dataGrid/longStanding'
import Notice from '@src/views/dashboard/notice'

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
                    path='u/dashboard/client-request/list/new'
                    pageNumber={4}
                    movePage={(id: number) => ''}
                    columns={RequestColumns}
                  />
                </Box>
              </GridItem>
            )}
          </Grid>
          <StatusAndDataGrid
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
          <StatusAndDataGrid
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
                </Box>
                <TotalValueView
                  type='receivable'
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
                </Box>
                <TotalValueView
                  type='payable'
                  label='Paid this month'
                  amountLabel='Receivable amount'
                  countLabel='Counts'
                />
              </Box>
            </GridItem>
          </Grid>
          <Grid container gap='24px'>
            <GridItem height={525} xs={6}>
              <Total
                type='receivable'
                title='Receivables - Total'
                iconColor='114, 225, 40'
                icon={Archive}
                setOpenInfoDialog={setOpenInfoDialog}
                statusList={['Invoiced', 'Paid', 'Overdue', 'Canceled']}
                colors={ReceivableColors}
              />
            </GridItem>
            <GridItem height={525} sm>
              <Total
                type='payable'
                title='Payables - Total'
                icon={MonetizationOn}
                iconColor='102, 108, 255'
                setOpenInfoDialog={setOpenInfoDialog}
                statusList={['Invoiced', 'Paid', 'Overdue']}
                colors={payableColors}
              />
            </GridItem>
          </Grid>
          <Grid container>
            <GridItem height={547} sm padding='0px'>
              <LongStandingDataGrid
                title='Long-standing receivables - Action required'
                type='receivable'
                columns={ReceivableColumns}
                initSort={[
                  {
                    field: 'clientName',
                    sort: 'desc',
                  },
                ]}
                setOpenInfoDialog={setOpenInfoDialog}
              />
            </GridItem>
          </Grid>
          <Grid container>
            <GridItem height={547} sm padding='0px'>
              <LongStandingDataGrid
                title='Long-standing payables - Action required'
                type='payable'
                columns={PayablesColumns}
                initSort={[
                  {
                    field: 'proName',
                    sort: 'desc',
                  },
                ]}
                setOpenInfoDialog={setOpenInfoDialog}
              />
            </GridItem>
          </Grid>
          <Grid container spacing={5}>
            <Doughnut
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
            <Doughnut<PairRatioItem>
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
              setOpenInfoDialog={setOpenInfoDialog}
            />
          </Grid>
          <Grid container spacing={5}>
            <Doughnut<CategoryRatioItem>
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
              menuOptions={[
                {
                  key: 'T/Translation',
                  text: 'Translation',
                },
                {
                  key: 'T/Dubbing',
                  text: 'Dubbing',
                },
                {
                  key: 'T/Translation',
                  text: 'Interpretation',
                },
                {
                  key: 'T/Misc.',
                  text: 'Misc.',
                },
                {
                  key: 'T/Misc',
                  text: 'Subtitle',
                },
                { key: 'C/Documents/Text', text: 'Documents/Text' },
                { key: 'C/Documents/Text', text: 'Dubbing' },
                { key: 'C/Interpretation', text: 'Interpretation' },
                { key: 'C/Misc.', text: 'Misc.' },
                { key: 'C/OTT/Subtitle', text: 'OTT/Subtitle' },
                { key: 'C/Webcomics', text: 'Webcomics' },
                { key: 'C/Webnovel', text: 'Webnovel' },
              ]}
              setOpenInfoDialog={setOpenInfoDialog}
            />
            <Doughnut<ServiceRatioItem>
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
            <Doughnut<ExpertiseRatioItem>
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
  subject: 'client',
}
