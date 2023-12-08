import Grid from '@mui/material/Grid'
import {
  GridItem,
  OnboardingList,
  ReportItem,
  SectionTitle,
  SubDateDescription,
  TitleIcon,
} from '@src/views/dashboard/dashboardItem'
import {
  Box,
  ButtonGroup,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import dayjs from 'dayjs'
import {
  DEFAULT_QUERY_NAME,
  useDashboardReport,
} from '@src/queries/dashboard/dashnaord-lpm'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form'
import Button from '@mui/material/Button'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import React, { MouseEvent, useCallback, useEffect, useState } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import DownloadIcon from '@mui/icons-material/Download'
import DashboardDataGrid from '@src/views/dashboard/dataGrid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Custom Components Imports
import DoughnutChart from '@src/views/dashboard/doughnutChart'
import weekday from 'dayjs/plugin/weekday'
import {
  Colors,
  SecondColors,
  Status,
  StatusColor,
  ThirdColors,
} from '@src/shared/const/dashboard/chart'
import {
  CategoryRatioItem,
  ExpertiseRatioItem,
  PairRatioItem,
  ServiceRatioItem,
} from '@src/types/dashboard'
import StatusAndList from '@src/views/dashboard/statusAndList'
import { useRecoilState, useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { currentRoleSelector } from '@src/states/permission'
import { dashboardState } from '@src/states/dashboard'
import { useQueryClient } from 'react-query'
import MemberSearchList from '@src/views/dashboard/member-search'
import { PermissionChip } from '@src/@core/components/chips/chips'
import {
  KeyboardArrowRight,
  LogoutOutlined,
  ReceiptLong,
} from '@mui/icons-material'
import {
  RecruitingRequestColumns,
  StatusJobColumns,
  StatusOrderColumns,
} from '@src/shared/const/columns/dashboard'
import { useRouter } from 'next/router'
import {
  DashboardForm,
  DEFAULT_LAST_DATE,
  DEFAULT_START_DATE,
  getDateFormat,
  getDateFormatter,
  getRangeDateTitle,
  SelectedRangeDate,
  toCapitalize,
} from '@src/pages/dashboards/lpm'
import BarChart from '@src/views/dashboard/barChart'
import JobDataTable from '@src/views/dashboard/jobDataTable'
import InfoDialog from '@src/views/dashboard/infoDialog'
import useInfoDialog from '@src/hooks/useInfoDialog'
import ChartDateHeader from '@src/views/dashboard/chartDateHeader'

dayjs.extend(weekday)

const TADDashboards = () => {
  const router = useRouter()

  const { control, setValue, ...props } = useForm<DashboardForm>({
    defaultValues: {
      dateRange: [DEFAULT_START_DATE, DEFAULT_LAST_DATE],
      userViewDate: getRangeDateTitle(DEFAULT_START_DATE, DEFAULT_LAST_DATE),
      selectedRangeDate: 'month',
      viewSwitch: true,
    },
  })

  const [dateRange, userViewDate] = useWatch({
    control,
    name: ['dateRange', 'userViewDate'],
  })

  const [openDialog, setOpenDialog] = useState(false)

  return (
    <FormProvider {...props} setValue={setValue} control={control}>
      <ApexChartWrapper>
        <Grid container gap='24px' sx={{ minWidth: '1320px', padding: '10px' }}>
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
        </Grid>
        <Grid
          container
          gap='24px'
          sx={{
            minWidth: '1320px',
            height: 'calc(100vh - 220px)',
            overflowX: 'auto',
            overFlowY: 'scroll',
            padding: '10px',
          }}
        >
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
                  type='new'
                  sectionHeight={220}
                  pageNumber={3}
                  movePage={(id: number) => ''}
                  columns={RecruitingRequestColumns}
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
                <BarChart />
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
                <JobDataTable />
              </Box>
            </GridItem>
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
            from={getDateFormat(
              (Array.isArray(dateRange) && dateRange[0]) || null,
            )}
            to={getDateFormat(
              (Array.isArray(dateRange) && dateRange[1]) || null,
            )}
          />

          <Grid container spacing={5}>
            <DoughnutChart
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
            />
            <DoughnutChart
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
            />
          </Grid>
          <Grid container spacing={5}>
            <DoughnutChart<CategoryRatioItem>
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
            />

            <DoughnutChart<ServiceRatioItem>
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
            />
          </Grid>
        </Grid>
        <MemberSearchList
          open={openDialog}
          onClose={() => setOpenDialog(false)}
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
