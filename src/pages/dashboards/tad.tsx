import Grid from '@mui/material/Grid'
import {
  GridItem,
  SectionTitle,
  SubDateDescription,
} from '@src/views/dashboard/dashboardItem'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { FormProvider, useWatch } from 'react-hook-form'
import Button from '@mui/material/Button'
import React from 'react'
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
import { CategoryRatioItem, ServiceRatioItem } from '@src/types/dashboard'
import StatusAndDataGrid from '@src/views/dashboard/dataGrid/status'
import { KeyboardArrowRight } from '@mui/icons-material'
import {
  RecruitingRequestColumn,
  RecruitingRequestColumns,
  StatusApplicationColumns,
  StatusOrderColumns,
} from '@src/shared/const/columns/dashboard'
import { useRouter } from 'next/router'
import { getDateFormat, toCapitalize } from '@src/pages/dashboards/lpm'
import TADLanguagePoolBarChart from '@src/views/dashboard/chart/languagePoolBar'

import ChartDateHeader from '@src/views/dashboard/header/chartDateHeader'
import OnboardingList from '@src/views/dashboard/list/onboarding'
import UseDashboardControl from '@src/hooks/useDashboardControl'
import TADJobDataGrid from '@src/views/dashboard/dataGrid/jobAndRolePool'
import Information from '@src/views/dashboard/dialog/information'

dayjs.extend(weekday)

const TADDashboards = () => {
  const router = useRouter()
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
          <ChartDateHeader />
          <GridItem width={207} height={76}>
            <Box>
              <Button
                variant='contained'
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <DownloadIcon sx={{ width: '20px', marginRight: '4px' }} />{' '}
                Download csv
              </Button>
            </Box>
          </GridItem>
          <Grid container gap='24px'>
            <GridItem width={490} height={267}>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ margin: '20px 0' }}>
                  <SectionTitle>
                    <span
                      role='button'
                      className='title'
                      onClick={() => router.push('/quotes/lpm/requests/')}
                    >
                      Onboarding overview
                    </span>
                    <ErrorOutlineIcon className='info_icon' />
                    <KeyboardArrowRight className='arrow_icon' />
                  </SectionTitle>
                </Box>
                <OnboardingList />
              </Box>
            </GridItem>
            <GridItem sm height={267} padding='0px'>
              <Box sx={{ width: '100%', marginTop: '20px' }}>
                <Box sx={{ padding: '0 20px' }}>
                  <SectionTitle>
                    <span
                      role='button'
                      className='title'
                      onClick={() => router.push('/quotes/lpm/requests/')}
                    >
                      Recruiting requests
                    </span>
                    <ErrorOutlineIcon className='info_icon' />
                    <KeyboardArrowRight className='arrow_icon' />
                  </SectionTitle>
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
              <Box sx={{ width: '100%', height: '100%', marginTop: '20px' }}>
                <Box>
                  <SectionTitle>
                    <span
                      role='button'
                      className='title'
                      onClick={() => router.push('/quotes/lpm/requests/')}
                    >
                      Language pool
                    </span>
                    <ErrorOutlineIcon className='info_icon' />
                    <KeyboardArrowRight className='arrow_icon' />
                  </SectionTitle>
                  <SubDateDescription textAlign='left'>
                    Total 210 Language pairs
                  </SubDateDescription>
                </Box>
                <TADLanguagePoolBarChart />
              </Box>
            </GridItem>
            <GridItem sm height={496} padding='0'>
              <Box sx={{ width: '100%', height: '100%', marginTop: '20px' }}>
                <Box sx={{ padding: '20px 20px 10px' }}>
                  <SectionTitle>
                    <span
                      role='button'
                      className='title'
                      onClick={() => router.push('/quotes/lpm/requests/')}
                    >
                      Job type/Role pool
                    </span>
                    <ErrorOutlineIcon className='info_icon' />
                    <KeyboardArrowRight className='arrow_icon' />
                  </SectionTitle>
                  <SubDateDescription textAlign='left'>
                    Total 210 Job type/Role
                  </SubDateDescription>
                </Box>
                <TADJobDataGrid />
              </Box>
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
            <Doughnut<CategoryRatioItem>
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

            <Doughnut<ServiceRatioItem>
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
