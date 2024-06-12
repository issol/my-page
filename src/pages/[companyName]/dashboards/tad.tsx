import Grid from '@mui/material/Grid'
import { GridItem } from '@src/views/dashboard/dashboardItem'
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
import { getDateFormat } from 'src/pages/[companyName]/dashboards/lpm'
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
} from '@src/queries/dashnaord.query'
import Notice from '@src/views/dashboard/notice'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import find from 'lodash/find'
import {
  useGetOnboardingStatistic,
  useGetStatistic,
} from '@src/queries/onboarding/onboarding-query'
import UserStatistic from '@src/views/dashboard/user'
import { useGetRecruitingCount } from '@src/queries/recruiting.query'
import RecruitingStatistic from '@src/views/dashboard/recruting'

dayjs.extend(weekday)

export const mergeData = (
  array1: Array<Object>,
  array2: Array<Object>,
): Array<Record<string, any>> => {
  array1 = array1 || []
  array2 = array2 || []

  const maxLength = Math.max(array1.length, array2.length)

  return Array.from({ length: maxLength }).map((_, index) => {
    const item1 = array1[index] || {}
    const item2 = array2[index] || {}
    return { ...item1, ...item2 }
  })
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

  const { data: totalStatistics } = useGetStatistic()
  const { data: onboardingStatistic } = useGetOnboardingStatistic()
  const { data: recruitingStatistic } = useGetRecruitingCount()

  useEffect(() => {
    let Onboarding: TADOnboardingResult = {
      onboarded: 0,
      onboarding: 0,
      failed: 0,
    }
    let OngoingCount: DashboardCountResult = {
      applied: 0,
      passed: 0,
      ongoing: 0,
      failed: 0,
      created: 0,
      invoiced: 0,
      canceled: 0,
      approved: 0,
    }

    const filterOnboarding = data.filter(item => item[0].includes('Onboarding'))
    const filterOngoingCount = data.filter(item =>
      item[0].includes('ongoingCount'),
    )

    if (Array.isArray(filterOnboarding) && filterOnboarding.length > 0) {
      Onboarding = filterOnboarding[0][1] as TADOnboardingResult
    }

    if (Array.isArray(filterOngoingCount) && filterOngoingCount.length > 0) {
      OngoingCount = filterOngoingCount[0][1] as DashboardCountResult
    }

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

    mergeData1[0] = {
      ...mergeData1[0],
      'Application Status': 'Applied',
      'Application Status Number': OngoingCount?.applied || 0,
      '  ': '',
    }
    mergeData1[1] = {
      ...mergeData1[1],
      'Application Status': 'Passed',
      'Application Status Number': OngoingCount?.passed || 0,
      '  ': '',
    }
    mergeData1[2] = {
      ...mergeData1[2],
      'Application Status': 'Ongoing',
      'Application Status Number': OngoingCount?.ongoing || 0,
      '  ': '',
    }
    mergeData1[3] = {
      ...mergeData1[3],
      'Application Status': 'Failed',
      'Application Status Number': OngoingCount?.failed || 0,
      '  ': '',
    }

    const mergeData2 = mergeData(mergeData1, jobTypes)
    const mergeData3 = mergeData(mergeData2, roles)
    const mergeData4 = mergeData(mergeData3, sourceLanguages)
    const mergeData5 = mergeData(mergeData4, targetLanguages)

    mergeData5[0] = {
      'Onboarded Pros': Onboarding?.onboarded || 0,
      'Onboarding in progress': Onboarding?.onboarding || 0,
      'Failed Pros': Onboarding?.failed || 0,
      '    ': '',
      ...mergeData5[0],
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
            <GridItem width={490} height={267}>
              <OnboardingList setOpenInfoDialog={setOpenInfoDialog} />
            </GridItem>
            <GridItem sm height={267} padding='0px'>
              <DashboardDataGrid
                sectionTitle='Recruiting requests'
                overlayTitle='ongoing recruiting requests'
                path='recruiting/dashboard/recruiting/list/ongoing'
                sectionHeight={220}
                pageNumber={3}
                handleClick={() => router.push('/recruiting/')}
                movePage={params =>
                  router.push(`/recruiting/detail/${params.id}/`)
                }
                setOpenInfoDialog={setOpenInfoDialog}
                columns={RecruitingRequestColumn}
              />
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
                sectionTitle='Job type/Role pool'
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
