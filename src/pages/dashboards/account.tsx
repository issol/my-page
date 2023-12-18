import Grid from '@mui/material/Grid'
import { GridItem, Title } from '@src/views/dashboard/dashboardItem'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { FormProvider, useWatch } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import DashboardDataGrid from '@src/views/dashboard/dataGrid/request'
import ApexChartWrapper from '@src/@core/styles/libs/react-apexcharts'

import Doughnut from '@src/views/dashboard/chart/doughnut'
import weekday from 'dayjs/plugin/weekday'
import {
  Colors,
  SecondColors,
  ThirdColors,
} from '@src/shared/const/dashboard/chart'
import { ApplicationItem, CSVDataType } from '@src/types/dashboard'
import StatusAndDataGrid from '@src/views/dashboard/dataGrid/status'
import {
  RecruitingRequestColumn,
  StatusApplicationColumns,
} from '@src/shared/const/columns/dashboard'
import { useRouter } from 'next/router'
import { getDateFormat, toCapitalize } from '@src/pages/dashboards/lpm'
import TADLanguagePoolBarChart from '@src/views/dashboard/chart/languagePoolBar'

import ChartDateHeader from '@src/views/dashboard/header/chartDateHeader'
import OnboardingList from '@src/views/dashboard/list/onboarding'
import UseDashboardControl from '@src/hooks/useDashboardControl'
import TADJobDataGrid from '@src/views/dashboard/dataGrid/jobAndRolePool'
import Information from '@src/views/dashboard/dialog/information'
import { CSVDownload } from '@src/views/dashboard/csvDownload'
import { useQueryClient } from 'react-query'
import {
  DashboardCountResult,
  DEFAULT_QUERY_NAME,
  TADOnboardingResult,
} from '@src/queries/dashboard/dashnaord-lpm'
import Notice from '@src/views/dashboard/notice'
import AccountTable from '@src/views/dashboard/accountTable'

dayjs.extend(weekday)

export const mergeData = (array1: Array<Object>, array2: Array<Object>) => {
  let tempArray1 = array1
  let tempArray2 = array2
  if (array1.length === 0) {
    tempArray1 = array2
    tempArray2 = array1
  }
  return tempArray1.reduce<Array<Record<string, any>>>(
    (acc, element, index) => [...acc, { ...element, ...tempArray2[index] }],
    [],
  )
}

const AccountDashboards = () => {
  const router = useRouter()
  const cache = useQueryClient()
  const data = cache.getQueriesData([DEFAULT_QUERY_NAME])

  const { formHook, infoDialog } = UseDashboardControl()
  const { control, setValue, ...props } = formHook
  const { isShowInfoDialog, infoDialogKey, setOpenInfoDialog, close } =
    infoDialog

  const [dateRange, userViewDate] = useWatch({
    control,
    name: ['dateRange', 'userViewDate'],
  })

  return (
    <FormProvider {...props} setValue={setValue} control={control}>
      <ApexChartWrapper>
        <Grid container gap='24px' sx={{ padding: '10px' }}>
          <Notice />
          <Grid
            item
            sm
            sx={{
              position: 'sticky',
              left: 0,
              top: '148px',
              zIndex: 10,
              backgroundColor: '#fff',
            }}
          >
            <ChartDateHeader />
          </Grid>
          <GridItem width={207} height={76}>
            <Box>
              <CSVDownload data={[]} />
            </Box>
          </GridItem>
        </Grid>
        <Grid container gap='24px' sx={{ padding: '10px' }}>
          <GridItem sm height={336} padding='0px'>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Title
                title='Sales recognition'
                openDialog={setOpenInfoDialog}
                subTitle={userViewDate}
                padding='20px'
              />
              <AccountTable
                headers={[
                  { label: 'Currency' },
                  { label: 'Prices', align: 'right' },
                ]}
              />
            </Box>
          </GridItem>
          <GridItem sm height={336} padding='0px'>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Title
                title='Paid Receivables'
                openDialog={setOpenInfoDialog}
                subTitle={userViewDate}
                padding='20px'
              />
              <AccountTable
                headers={[
                  { label: 'Currency' },
                  { label: 'Count', align: 'center' },
                  { label: 'Prices', align: 'right' },
                ]}
              />
            </Box>
          </GridItem>
          <GridItem sm height={336} padding='0px'>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Title
                title='Paid Payables'
                openDialog={setOpenInfoDialog}
                subTitle={userViewDate}
                padding='20px'
              />
              <AccountTable
                headers={[
                  { label: 'Currency' },
                  { label: 'Count', align: 'center' },
                  { label: 'Prices', align: 'right' },
                ]}
              />
            </Box>
          </GridItem>
        </Grid>
        <Information
          open={isShowInfoDialog}
          keyName={infoDialogKey}
          infoType='ACCOUNT'
          close={close}
        />
      </ApexChartWrapper>
    </FormProvider>
  )
}

export default AccountDashboards

AccountDashboards.acl = {
  action: 'read',
  subject: 'client',
}
