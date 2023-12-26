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

import ChartDate from '@src/views/dashboard/header/chartDate'
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
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import find from 'lodash/find'
import useStickyHeader from '@src/hooks/useStickyHeader'

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

const TADDashboards = () => {
  const router = useRouter()
  const cache = useQueryClient()
  const data = cache.getQueriesData([DEFAULT_QUERY_NAME])

  const gloLanguage = getGloLanguage()

  const { formHook, infoDialog } = UseDashboardControl()
  const { control, setValue, ...props } = formHook
  const { isShowInfoDialog, infoDialogKey, setOpenInfoDialog, close } =
    infoDialog

  const [dateRange, userViewDate] = useWatch({
    control,
    name: ['dateRange', 'userViewDate'],
  })

  const [CSVData, setCSVData] = useState<CSVDataType>([])
  const [languagePool, setLanguagePool] = useState<CSVDataType>([])
  const [jobTypeAndRole, setJobTypeAndRole] = useState<CSVDataType>([])
  const [jobTypes, setJobTypes] = useState<CSVDataType>([])
  const [roles, setRoles] = useState<CSVDataType>([])
  const [sourceLanguages, setSourceLanguages] = useState<CSVDataType>([])
  const [targetLanguages, setTargetLanguages] = useState<CSVDataType>([])

  useEffect(() => {
    const Onboarding = data.filter(item =>
      item[0].includes('Onboarding'),
    )[0][1] as TADOnboardingResult

    const OngoingCount = data.filter(item =>
      item[0].includes('ongoingCount'),
    )[0][1] as DashboardCountResult

    const fullLangPool = languagePool.map((item: any) => ({
      ...item,
      'Source languages':
        find(gloLanguage, {
          value: item['Source languages'],
        })?.label || '-',
      'Target languages':
        find(gloLanguage, {
          value: item['Target languages'],
        })?.label || '-',
    }))
    const mergeData1 = mergeData(fullLangPool, jobTypeAndRole)
    const mergeData2 = mergeData(mergeData1, jobTypes)
    const mergeData3 = mergeData(mergeData2, roles)
    const mergeData4 = mergeData(mergeData3, sourceLanguages)
    const mergeData5 = mergeData(mergeData4, targetLanguages)

    mergeData5[0] = {
      'Onboarded Pros': Onboarding?.onboarded || 0,
      'Onboarding in progress': Onboarding?.onboarding || 0,
      'Failed Pros': Onboarding?.failed || 0,
      '        ': '',
      ...mergeData5[0],
      'Application Status': 'Applied',
      'Application Status Number': OngoingCount.applied,
    }
    mergeData5[1] = {
      ...mergeData5[1],
      'Application Status': 'Passed',
      'Application Status Number': OngoingCount.passed,
    }
    mergeData5[2] = {
      ...mergeData5[2],
      'Application Status': 'Ongoing',
      'Application Status Number': OngoingCount.ongoing,
    }
    mergeData5[3] = {
      ...mergeData5[3],
      'Application Status': 'Failed',
      'Application Status Number': OngoingCount.failed,
    }
    setCSVData(mergeData5)
  }, [
    languagePool,
    jobTypeAndRole,
    jobTypes,
    roles,
    sourceLanguages,
    targetLanguages,
  ])

  const getFileTitle = () => {
    const from = getDateFormat(
      (Array.isArray(dateRange) && dateRange[0]) || null,
    )
    const to = getDateFormat((Array.isArray(dateRange) && dateRange[1]) || null)
    return `tad-data-${from}-${to}`
  }

  return (
    <FormProvider {...props} setValue={setValue} control={control}>
      <ApexChartWrapper>
        <Grid container gap='24px' sx={{ padding: '10px' }}>
          <Notice />
          <Grid
            container
            gap='24px'
            sx={{ position: 'sticky', top: 138, zIndex: 10 }}
          >
            <Grid
              component='div'
              item
              sm
              sx={{ position: 'sticky', top: 138, zIndex: 10 }}
            >
              <ChartDate />
            </Grid>
            <GridItem width={207} height={76}>
              <Box>
                <CSVDownload title={`${getFileTitle()}`} data={CSVData} />
              </Box>
            </GridItem>
          </Grid>
          <Grid container gap='24px'>
            <GridItem width={490} height={267}>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ margin: '20px 0' }}>
                  <Title
                    title='Onboarding overview'
                    openDialog={setOpenInfoDialog}
                  />
                </Box>
                <OnboardingList />
              </Box>
            </GridItem>
            <GridItem sm height={267} padding='0px'>
              <Box sx={{ width: '100%', marginTop: '20px' }}>
                <Box sx={{ padding: '0 20px' }}>
                  <Title
                    title='Recruiting requests'
                    openDialog={setOpenInfoDialog}
                    handleClick={() => router.push('/recruiting/')}
                  />
                </Box>
                <DashboardDataGrid
                  title='ongoing recruiting requests'
                  path='recruiting/dashboard/recruiting/list/ongoing'
                  sectionHeight={220}
                  pageNumber={3}
                  movePage={params =>
                    router.push(`/recruiting/detail/${params.id}/`)
                  }
                  columns={RecruitingRequestColumn}
                />
              </Box>
            </GridItem>
          </Grid>
          <Grid container gap='24px'>
            <GridItem width={490} height={496}>
              <TADLanguagePoolBarChart
                setOpenInfoDialog={setOpenInfoDialog}
                dataRecord={languagePool}
                setDataRecord={setLanguagePool}
              />
            </GridItem>
            <GridItem sm height={496} padding='0'>
              <TADJobDataGrid
                setOpenInfoDialog={setOpenInfoDialog}
                dataRecord={jobTypeAndRole}
                setDataRecord={setJobTypeAndRole}
              />
            </GridItem>
          </Grid>
          <StatusAndDataGrid<ApplicationItem>
            userViewDate={userViewDate}
            type='application'
            movePage={() => router.push('/onboarding')}
            moveDetailPage={params => {
              router.push(`/onboarding/detail/${params.row.pro.id}/`)
            }}
            statusColumn={StatusApplicationColumns}
            initSort={[
              {
                field: 'status',
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
            <Doughnut
              apiType='cert'
              userViewDate={userViewDate}
              title='Applied job types'
              from={getDateFormat(
                (Array.isArray(dateRange) && dateRange[0]) || null,
              )}
              to={getDateFormat(
                (Array.isArray(dateRange) && dateRange[1]) || null,
              )}
              type='job-type'
              colors={Colors}
              setOpenInfoDialog={setOpenInfoDialog}
              dataRecord={jobTypes}
              setDataRecord={setJobTypes}
              isHiddenValue={true}
            />
            <Doughnut
              apiType='cert'
              userViewDate={userViewDate}
              title='Applied roles'
              from={getDateFormat(
                (Array.isArray(dateRange) && dateRange[0]) || null,
              )}
              to={getDateFormat(
                (Array.isArray(dateRange) && dateRange[1]) || null,
              )}
              type='role'
              colors={ThirdColors}
              setOpenInfoDialog={setOpenInfoDialog}
              dataRecord={roles}
              setDataRecord={setRoles}
              isHiddenValue={true}
            />
          </Grid>
          <Grid container spacing={5}>
            <Doughnut
              apiType='cert'
              userViewDate={userViewDate}
              title='Applied source languages'
              from={getDateFormat(
                (Array.isArray(dateRange) && dateRange[0]) || null,
              )}
              to={getDateFormat(
                (Array.isArray(dateRange) && dateRange[1]) || null,
              )}
              type='source-language'
              colors={SecondColors}
              setOpenInfoDialog={setOpenInfoDialog}
              dataRecord={sourceLanguages}
              setDataRecord={setSourceLanguages}
              getName={row => `${row?.name}`.toUpperCase()}
              isHiddenValue={true}
            />

            <Doughnut
              apiType='cert'
              userViewDate={userViewDate}
              title='Applied target languages'
              from={getDateFormat(
                (Array.isArray(dateRange) && dateRange[0]) || null,
              )}
              to={getDateFormat(
                (Array.isArray(dateRange) && dateRange[1]) || null,
              )}
              type='target-language'
              colors={SecondColors}
              getName={row => `${row?.name}`.toUpperCase()}
              setOpenInfoDialog={setOpenInfoDialog}
              dataRecord={targetLanguages}
              setDataRecord={setTargetLanguages}
              isHiddenValue={true}
            />
          </Grid>
        </Grid>
        <Information
          open={isShowInfoDialog}
          keyName={infoDialogKey}
          infoType='TAD'
          close={close}
        />
      </ApexChartWrapper>
    </FormProvider>
  )
}

export default TADDashboards

TADDashboards.acl = {
  action: 'read',
  subject: 'dashboard_TAD',
}
