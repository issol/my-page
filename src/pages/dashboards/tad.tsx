import Grid from '@mui/material/Grid'
import { GridItem, Title } from '@src/views/dashboard/dashboardItem'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { FormProvider, useWatch } from 'react-hook-form'
import Button from '@mui/material/Button'
import React, { useEffect, useState } from 'react'
import DownloadIcon from '@mui/icons-material/Download'
import DashboardDataGrid from '@src/views/dashboard/dataGrid/request'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

import Doughnut from '@src/views/dashboard/chart/doughnut'
import weekday from 'dayjs/plugin/weekday'
import {
  Colors,
  SecondColors,
  ThirdColors,
} from '@src/shared/const/dashboard/chart'
import {
  CategoryRatioItem,
  RatioItem,
  RecruitingRequest,
  ServiceRatioItem,
} from '@src/types/dashboard'
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
import CSVDownload from '@src/views/dashboard/csvDownload'
import { useQuery, useQueryClient } from 'react-query'
import {
  DashboardCountResult,
  DEFAULT_QUERY_NAME,
  JobTypeAndRoleResult,
  LanguagePoolResult,
  OverviewType,
  TADOnboardingResult,
} from '@src/queries/dashboard/dashnaord-lpm'
import { TADHeader1, TADHeader2 } from '@src/shared/const/dashboard/csvTemplate'
import onboarding from '@src/views/dashboard/list/onboarding'

dayjs.extend(weekday)

const TADDashboards = () => {
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
  const [headers, setHeaders] = useState<Record<string, number | string>>({})
  const [CSVData, setCSVData] = useState<Array<Record<string, number>>>([])

  const mergeData = (
    array1: Array<Record<string, Number | string>>,
    array2: Array<Record<string, Number | string>>,
  ) => {
    return array1.reduce<Array<Record<string, any>>>(
      (acc, element, index) => [...acc, { ...element, ...array2[index] }],
      [],
    )
  }

  useEffect(() => {
    const csvList = [
      'Onboarding',
      'LanguagePool',
      'JobTypeAndRole',
      'ongoingCount',
      'ratio',
    ]

    const Onboarding = data.filter(item =>
      item[0].includes('Onboarding'),
    )[0][1] as TADOnboardingResult

    const OngoingCount = data.filter(item =>
      item[0].includes('ongoingCount'),
    )[0][1] as DashboardCountResult
    // {
    //   totalCount: number
    //   count: number
    //   report: Array<RecruitingRequest>
    // }

    const LanguagePool = data.filter(item =>
      item[0].includes('LanguagePool'),
    )[0][1] as LanguagePoolResult
    const JobTypeAndRole = data.filter(item =>
      item[0].includes('JobTypeAndRole'),
    )[0][1] as JobTypeAndRoleResult

    const ratios = data.filter(item => item[0].includes('ratio'))

    const jobTypes = ratios.filter(item =>
      item[0].includes('Applied job types'),
    )[0][1] as { totalCount: number; count: number; report: Array<RatioItem> }
    const roles = ratios.filter(item =>
      item[0].includes('Applied roles'),
    )[0][1] as { totalCount: number; count: number; report: Array<RatioItem> }
    const sourceLanguages = ratios.filter(item =>
      item[0].includes('Applied source languages'),
    )[0][1] as { totalCount: number; count: number; report: Array<RatioItem> }
    const targetLanguages = ratios.filter(item =>
      item[0].includes('Applied target languages'),
    )[0][1] as { totalCount: number; count: number; report: Array<RatioItem> }

    const filterLanguage = LanguagePool.report.map(item => {
      return {
        'Source languages': item.sourceLanguage || '-',
        'Target languages': item.targetLanguage || '-',
        Number: item.count || 0,
        Percent: item.ratio || 0,
      }
    })

    const filterJobTypeAndRole = JobTypeAndRole.report.map(item => {
      return {
        'Job Type': item.jobType,
        Role: item.role,
        Number: item.count,
        Percent: item.ratio,
      }
    })

    const filterJobTypes = jobTypes.report.map(item => {
      return {
        'Applied job types': item.name || '',
        'Applied job types Number': item.count,
        'Applied job types Percent': item.ratio,
      }
    })

    const filterRoles = roles.report.map(item => {
      return {
        'Applied roles': item.name || '',
        'Applied roles Number': item.count,
        'Applied roles Percent': item.ratio,
      }
    })

    const filterSourceLanguages = sourceLanguages.report.map(item => {
      return {
        'Applied source languages': item.name || '',
        'Applied source languages Number': item.count,
        'Applied source languages Percent': item.ratio,
      }
    })

    const filterTargetLanguages = targetLanguages.report.map(item => {
      return {
        'Applied target languages': item.name || '',
        'Applied target languages Number': item.count,
        'Applied target languages Percent': item.ratio,
      }
    })

    const mergeData1 = mergeData(filterLanguage, filterJobTypeAndRole)
    const mergeData2 = mergeData(mergeData1, filterJobTypes)
    const mergeData3 = mergeData(mergeData2, filterRoles)
    const mergeData4 = mergeData(mergeData3, filterSourceLanguages)
    const mergeData5 = mergeData(mergeData4, filterTargetLanguages)

    mergeData5[0] = {
      ...mergeData5[0],
      'Onboarded Pros': Onboarding?.onboarded || 0,
      'Onboarding in progress': Onboarding?.onboarding || 0,
      'Failed Pros': Onboarding?.failed || 0,
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
  }, [])

  return (
    <FormProvider {...props} setValue={setValue} control={control}>
      <ApexChartWrapper>
        <Grid container gap='24px' sx={{ padding: '10px' }}>
          <ChartDateHeader />
          <GridItem width={207} height={76}>
            <Box>
              <CSVDownload data={CSVData} />
            </Box>
          </GridItem>
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
                  />
                </Box>
                <DashboardDataGrid
                  path='recruiting/dashboard/recruiting/list/ongoing'
                  sectionHeight={220}
                  pageNumber={3}
                  movePage={(id: number) => ''}
                  columns={RecruitingRequestColumn}
                />
              </Box>
            </GridItem>
          </Grid>
          <Grid container gap='24px'>
            <GridItem width={490} height={496}>
              <TADLanguagePoolBarChart setOpenInfoDialog={setOpenInfoDialog} />
            </GridItem>
            <GridItem sm height={496} padding='0'>
              <TADJobDataGrid setOpenInfoDialog={setOpenInfoDialog} />
            </GridItem>
          </Grid>
          <StatusAndDataGrid
            userViewDate={userViewDate}
            type='application'
            statusColumn={StatusApplicationColumns}
            initSort={[
              {
                field: 'status',
                sort: 'desc',
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
              getName={row => `${toCapitalize(row?.name || '')}`}
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
              getName={row => `${toCapitalize(row?.name || '')}`}
              setOpenInfoDialog={setOpenInfoDialog}
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
  subject: 'client',
}
